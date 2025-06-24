'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MCQQuestion } from './Mcq/mcq';
import { MultiSelectQuestion } from './MultiSelect/multiSelect';
import { StructuredQuestion } from './structure/structure';
import Peer, { Instance as PeerInstance } from 'simple-peer';
import socket from '@/lib/socket';
import { toast } from 'sonner';
import MessageInbox from '@/components/common/MessageInbox';
import { Mic, AlertTriangle, Hand } from 'lucide-react';
import { decrypt } from '@/lib/encryption';
import Cookies from 'js-cookie';
// import * as tf from '@tensorflow/tfjs';
// import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
// import '@tensorflow/tfjs-backend-webgl';
// import * as faceapi from 'face-api.js';

// console.log('[Student] question.tsx file loaded');

export type QuestionType = 'mcq' | 'multiSelect' | 'structured';

export interface BaseQuestionData {
  id: string;
  question: string;
  type: QuestionType;
  attachment?: string;
}

export interface MCQQuestionData extends BaseQuestionData {
  type: 'mcq';
  options: string[];
  correctAnswer?: number;
}

export interface MultiSelectQuestionData extends BaseQuestionData {
  type: 'multiSelect';
  options: string[];
  correctAnswers?: number[];
}

export interface StructuredQuestionData extends BaseQuestionData {
  type: 'structured';
  expectedAnswer?: string;
}

export type QuestionData = MCQQuestionData | MultiSelectQuestionData | StructuredQuestionData;

interface PeerData {
  id: string;
  peer: PeerInstance;
}

interface QuestionComponentProps {
  questions: QuestionData[];
  currentQuestionIndex: number;
  onNext: () => void;
  onPrevious?: () => void;
  onComplete: () => void;
  timeRemaining: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAnswerChange?: (answer: any) => void;
  examId?: string;
}

export function QuestionComponent({
  questions,
  currentQuestionIndex,
  onNext,
  onComplete,
  timeRemaining,
  onAnswerChange,
  examId = 'test-exam',
}: QuestionComponentProps) {
  // console.log('[Student] QuestionComponent rendered');
  const [mcqSelected, setMcqSelected] = useState<number | null>(null);
  const [multiSelectSelected, setMultiSelectSelected] = useState<number[]>([]);
  const [structuredAnswer, setStructuredAnswer] = useState<string>('');

  // WebRTC and proctoring 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [peers, setPeers] = useState<PeerData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: string; message: string; studentName?: string; studentId?: string }[]>([]);
  const [adminId, setAdminId] = useState<string | null>(null);
  const voicePeerRef = useRef<Peer.Instance | null>(null);
  const [voiceConnected, setVoiceConnected] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const peersRef = useRef<{ [id: string]: PeerInstance }>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showProctoringWarning, setShowProctoringWarning] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lastActivity, setLastActivity] = useState(Date.now());
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [studentName, setStudentName] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const examActiveRef = useRef(true);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const [fullscreenExitCount, setFullscreenExitCount] = useState(0);
  const MAX_FULLSCREEN_EXITS = 3;
  const [finalFullscreenLockout, setFinalFullscreenLockout] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [securityViolationCount, setSecurityViolationCount] = useState(0);
  const MAX_VIOLATIONS = 5;
  const fullscreenRequestTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastViolationRef = useRef<{ type: string; time: number }>({ type: '', time: 0 });
  const VIOLATION_DEBOUNCE_MS = 3000; // 3 seconds

  // Get stream with specific devices
  const getStream = useCallback(async () => {
    const constraints: MediaStreamConstraints = {
      video: { width: 640, height: 480 },
      audio: true,
    };
    return navigator.mediaDevices.getUserMedia(constraints);
  }, []);

  const createPeer = useCallback((id: string, isInitiator: boolean, stream: MediaStream) => {
    if (peersRef.current[id]) {
      peersRef.current[id].destroy();
    }

    const peer = new Peer({
      initiator: isInitiator,
      trickle: false,
      stream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      }
    });

    peer.on('signal', (signal) => {
      // console.log(`[Student] Sending signal to ${id}`, signal.type);
      socket.emit('signal', { target: id, signalData: signal });
    });

    peer.on('connect', () => {
      // console.log(`[Student] Connected to peer ${id}`);
      setIsConnected(true);
      // toast.success(`Connected to proctor ${id}`);
    });

    peer.on('error', (err) => {
      console.error(`[Student] Peer error with ${id}:`, err);
      // Only show error toast for non-state errors
      if (!err.message.includes('stable') && !err.message.includes('InvalidStateError')) {
        toast.error(`Something went wrong! Contact Admin`);
      }
      delete peersRef.current[id];
      setPeers(prev => prev.filter(p => p.id !== id));
    });

    peer.on('close', () => {
      // console.log(`[Student] Peer connection closed with ${id}`);
      setIsConnected(false);
      delete peersRef.current[id];
      setPeers(prev => prev.filter(p => p.id !== id));
    });

    peersRef.current[id] = peer;
    setPeers(prev => {
      const exists = prev.find(p => p.id === id);
      if (exists) {
        return prev.map(p => p.id === id ? { id, peer } : p);
      }
      return [...prev, { id, peer }];
    });

    return peer;
  }, []);

  // Initialize WebRTC and socket connection
  useEffect(() => {
    let mounted = true;
    let hasJoined = false;

    const init = async () => {
      try {
        // Clean up existing stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }

        const stream = await getStream();
        if (!mounted) return;

        streamRef.current = stream;
        setLocalStream(stream);

        // Emit webcam/mic access status to admin
        socket.emit('media-status', {
          examId,
          webcam: stream.getVideoTracks().length > 0,
          mic: stream.getAudioTracks().length > 0,
        });

        // Clean up existing peers
        Object.values(peersRef.current).forEach(peer => peer.destroy());
        peersRef.current = {};
        setPeers([]);

        if (!isConnected && !hasJoined) {
          hasJoined = true;
          const userData = Cookies.get("userDetails");
          if (userData) {
            const decryptedData = decrypt(userData);
            const parsedData = JSON.parse(decryptedData);
            socket.emit('join-exam', { examId, role: "student", studentId: parsedData.studentDetails.studentId, studentName: parsedData.name });
            setStudentName(parsedData.name);
            setStudentId(parsedData.studentDetails.studentId);
          }
        }

        // Socket event listeners
        const handleExistingUsers = ({ users }: { users: string[] }) => {
          if (!mounted) return;
          // console.log('[Student] Existing users:', users);
          users.forEach((id) => {
            if (id !== socket.id && !peersRef.current[id]) {
              // console.log(`[Student] Creating peer for existing user: ${id}`);
              createPeer(id, true, stream);
            }
          });
        };

        const handleUserJoined = ({ id }: { id: string }) => {
          if (!mounted) return;
          // console.log('[Student] User joined:', id);
          if (id !== socket.id && !peersRef.current[id]) {
            // toast.info('Proctor joined: ' + id);
            createPeer(id, false, stream);
          }
        };

        const handleUserLeft = ({ id }: { id: string }) => {
          if (!mounted) return;
          // console.log('[Student] User left:', id);
          const peer = peersRef.current[id];
          if (peer) {
            peer.destroy();
            delete peersRef.current[id];
            setPeers(prev => prev.filter(p => p.id !== id));
          }
          // toast.info(`Proctor ${id} left the exam`);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleSignal = ({ sender, signalData }: { sender: string, signalData: any }) => {
          if (!mounted) return;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          //

          let peer = peersRef.current[sender];

          if (!peer) {
            // console.log(`[Student] Creating new peer for ${sender}`);
            peer = createPeer(sender, false, stream);
          }

          try {
            peer.signal(signalData);
          } catch (err) {
            console.error(`[Student] Signal error with ${sender}:`, err);
          }
        };

        const handleError = (error: unknown) => {
          if (!mounted) return;
          console.error('[Student] Socket error:', error);
          // const err = error as Error;
          toast.error('Something went wrong! Contact Admin');
        };

        // Add event listeners
        socket.on('existing-users', handleExistingUsers);
        socket.on('user-joined', handleUserJoined);
        socket.on('signal', handleSignal);
        socket.on('user-left', handleUserLeft);
        socket.on('error', handleError);

        // Cleanup function
        return () => {
          socket.off('existing-users', handleExistingUsers);
          socket.off('user-joined', handleUserJoined);
          socket.off('signal', handleSignal);
          socket.off('user-left', handleUserLeft);
          socket.off('error', handleError);
        };

      } catch (err: unknown) {
        if (mounted) {
          const error = err as Error;
          toast.error('Something went wrong! Contact Admin');
          console.error('Media error', error);
        }
      }
    };

    init();

    return () => {
      mounted = false;
      setIsConnected(false);
      // Clean up socket listeners
      socket.off('existing-users');
      socket.off('user-joined');
      socket.off('signal');
      socket.off('user-left');
      socket.off('error');

      // Clean up peers
      Object.values(peersRef.current).forEach(peer => peer.destroy());
      peersRef.current = {};
      setPeers([]);

      // Clean up stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      // Leave exam room
      if (isConnected) {
        socket.emit('leave-exam', { examId });
      }
    };
  }, [examId, getStream, createPeer]);

  // NEW: Set video element srcObject when both are available
  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }

    activityTimeoutRef.current = setTimeout(() => {
      setShowProctoringWarning(true);
      toast.warning('No activity detected. Please ensure you are actively taking the exam.');
    }, 30000); // 30 seconds of inactivity
  }, []);

  

  const handleSecurityViolation = useCallback((violationType: string) => {
    const now = Date.now();
    if (
      lastViolationRef.current.type === violationType &&
      now - lastViolationRef.current.time < VIOLATION_DEBOUNCE_MS
    ) {
      return;
    }
    lastViolationRef.current = { type: violationType, time: now };

    setSecurityViolationCount(prev => {
      const newCount = prev + 1;
      const isFaceViolation = violationType.includes('face');
      const maxViolations = isFaceViolation ? MAX_VIOLATIONS * 2 : MAX_VIOLATIONS;
      
      toast.error(`Security violation: ${violationType}. Violations: ${newCount}/${maxViolations}`);
      socket.emit('session-security-violation', { 
        examId, 
        studentId, 
        violationType, 
        count: newCount 
      });

      if (newCount >= maxViolations) {
        toast.error('Too many security violations. Exam will be auto-submitted.');
        setTimeout(() => {
          examActiveRef.current = false;
          onComplete();
        }, 2000);
      }
      return newCount;
    });
  }, [examId, studentId, onComplete]);

  // Reset answers when question changes
  useEffect(() => {
    setMcqSelected(null);
    setMultiSelectSelected([]);
    setStructuredAnswer('');
    updateActivity();
  }, [currentQuestionIndex, updateActivity]);

  // Enhanced security measures
  useEffect(() => {
    examActiveRef.current = true;

    // Helper to request fullscreen with multiple attempts
    const requestFullscreen = (element: HTMLElement | null) => {
      if (!element || !examActiveRef.current) return;
      
      if (document.fullscreenElement) return;
      
      const attemptFullscreen = () => {
        if (element.requestFullscreen) {
          element.requestFullscreen().catch(() => {
            // Retry after a short delay
            setTimeout(attemptFullscreen, 500);
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } else if ((element as any).webkitRequestFullscreen) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (element as any).webkitRequestFullscreen();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } else if ((element as any).msRequestFullscreen) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (element as any).msRequestFullscreen();
        }
      };
      
      attemptFullscreen();
    };

    // Enhanced keyboard event handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!examActiveRef.current) return;

      // Block function keys
      const blockedKeys = [
        'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
        'Escape', 'PrintScreen', 'Insert', 'Delete', 'Home', 'End', 'PageUp', 'PageDown'
      ];

      // Block key combinations
      const isBlockedCombination = 
        (e.ctrlKey && ['t', 'n', 'w', 'r', 'shift+i', 'shift+j', 'u', 'shift+c'].includes(e.key.toLowerCase())) ||
        (e.altKey && ['Tab', 'F4'].includes(e.key)) ||
        (e.ctrlKey && e.shiftKey && ['i', 'j', 'c', 'n'].includes(e.key.toLowerCase())) ||
        (e.metaKey && ['t', 'n', 'w', 'r'].includes(e.key.toLowerCase())); // Mac cmd key

      if (blockedKeys.includes(e.key) || isBlockedCombination) {
        e.preventDefault();
        e.stopPropagation();
        handleSecurityViolation(`Blocked key: ${e.key}${e.ctrlKey ? '+Ctrl' : ''}${e.altKey ? '+Alt' : ''}${e.shiftKey ? '+Shift' : ''}`);
        
        // Force fullscreen if F11 was pressed
        if (e.key === 'F11') {
          setTimeout(() => requestFullscreen(mainContainerRef.current), 100);
        }
        
        return false;
      }

      // Special handling for Escape key - force fullscreen
      if (e.key === 'Escape') {
        setTimeout(() => requestFullscreen(mainContainerRef.current), 100);
      }
    };

    // Enhanced right-click prevention
    const handleContextMenu = (e: MouseEvent) => {
      if (!examActiveRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      handleSecurityViolation('Right-click attempt');
      return false;
    };

    // Block text selection and drag
    const handleSelectStart = (e: Event) => {
      // Allow selection only in input fields and textareas
      const target = e.target as HTMLElement;
      if (!target.matches('input, textarea, [contenteditable]')) {
        e.preventDefault();
        return false;
      }
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Enhanced fullscreen change handler
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && examActiveRef.current) {
        setFullscreenExitCount(prev => {
          const newCount = prev + 1;
          handleSecurityViolation('Fullscreen exit');
          
          if (newCount >= MAX_FULLSCREEN_EXITS) {
            setFinalFullscreenLockout(true);
            setShowFullscreenWarning(false);
            setTimeout(() => {
              examActiveRef.current = false;
              onComplete();
            }, 1000);
          } else {
            setShowFullscreenWarning(true);
            // Persistent fullscreen re-request
            const retryFullscreen = () => {
              if (!document.fullscreenElement && examActiveRef.current) {
                requestFullscreen(mainContainerRef.current);
                fullscreenRequestTimeoutRef.current = setTimeout(retryFullscreen, 1000);
              }
            };
            retryFullscreen();
          }
          return newCount;
        });
      } else {
        setShowFullscreenWarning(false);
        if (fullscreenRequestTimeoutRef.current) {
          clearTimeout(fullscreenRequestTimeoutRef.current);
        }
      }
    };

    // Enhanced visibility change handler
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible' && examActiveRef.current) {
        setShowTabWarning(true);
        handleSecurityViolation('Tab switch/minimize');
      } else {
        setShowTabWarning(false);
      }
    };

    // Window focus/blur handlers
    const handleBlur = () => {
      if (examActiveRef.current) {
        setShowTabWarning(true);
        handleSecurityViolation('Window lost focus');
      }
    };

    const handleFocus = () => {
      setShowTabWarning(false);
      // Force fullscreen when regaining focus
      setTimeout(() => requestFullscreen(mainContainerRef.current), 100);
    };

    // Prevent page refresh/close with enhanced message
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (examActiveRef.current) {
        const message = 'Are you sure you want to leave? Your exam progress will be lost.';
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    // Block developer tools attempts
    const handleResize = () => {
      // Detect if window was resized significantly (might indicate dev tools opening)
      const threshold = 100;
      if (Math.abs(window.innerHeight - window.screen.height) > threshold && examActiveRef.current) {
        handleSecurityViolation('Potential developer tools detected');
      }
    };

    // Detect copy/paste attempts
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (!target.matches('input, textarea, [contenteditable]')) {
        e.preventDefault();
        handleSecurityViolation('Copy attempt');
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (!target.matches('input, textarea, [contenteditable]')) {
        e.preventDefault();
        handleSecurityViolation('Paste attempt');
      }
    };

    // Add all event listeners
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    document.addEventListener('contextmenu', handleContextMenu, { capture: true });
    document.addEventListener('selectstart', handleSelectStart, { capture: true });
    document.addEventListener('dragstart', handleDragStart, { capture: true });
    document.addEventListener('copy', handleCopy, { capture: true });
    document.addEventListener('paste', handlePaste, { capture: true });
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('resize', handleResize);

    // Block common shortcuts via keyup as well
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!examActiveRef.current) return;
      
      // Additional blocking on keyup for persistent keys
      if (['F11', 'F12', 'Escape'].includes(e.key)) {
        e.preventDefault();
        setTimeout(() => requestFullscreen(mainContainerRef.current), 50);
      }
    };
    
    document.addEventListener('keyup', handleKeyUp, { capture: true });

    // Initial fullscreen request with retries
    let retryCount = 0;
    const initialFullscreen = () => {
      requestFullscreen(mainContainerRef.current);
      retryCount++;
      if (retryCount < 5 && !document.fullscreenElement) {
        setTimeout(initialFullscreen, 500);
      }
    };
    
    setTimeout(initialFullscreen, 100);

    // Disable drag and drop globally
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };
    
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      handleSecurityViolation('File drop attempt');
      return false;
    };

    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    // Cleanup function
    return () => {
      examActiveRef.current = false;
      setFullscreenExitCount(0);
      setFinalFullscreenLockout(false);
      setSecurityViolationCount(0);
      
      if (fullscreenRequestTimeoutRef.current) {
        clearTimeout(fullscreenRequestTimeoutRef.current);
      }
      
      // Remove all event listeners
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('keyup', handleKeyUp, { capture: true });
      document.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      document.removeEventListener('selectstart', handleSelectStart, { capture: true });
      document.removeEventListener('dragstart', handleDragStart, { capture: true });
      document.removeEventListener('copy', handleCopy, { capture: true });
      document.removeEventListener('paste', handlePaste, { capture: true });
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
      
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('resize', handleResize);
      
      setShowFullscreenWarning(false);
      setShowTabWarning(false);
    };
  }, [onComplete, handleSecurityViolation]);

  // Initialize WebRTC on component mount
  useEffect(() => {
    // Set up activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });

      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
    };
  }, [updateActivity]);

  // Listen for incoming messages
  useEffect(() => {
    const handlePrivateMessage = ({ from, message, studentName, studentId }: { from: string; message: string; studentName?: string; studentId?: string }) => {
      setMessages(prev => [...prev, { from, message, studentName, studentId }]);
      setInboxOpen(true);
      updateActivity();
    };
    socket.on('private-message', handlePrivateMessage);
    return () => { socket.off('private-message', handlePrivateMessage); };
  }, [updateActivity]);

  useEffect(() => {
    const handleAdminInfo = ({ adminId }: { adminId: string }) => {
      // console.log('[Student] Admin ID:', adminId);
      setAdminId(adminId);
    };
    socket.on('admin-info', handleAdminInfo);
    return () => { socket.off('admin-info', handleAdminInfo); };
  }, []);

  // Handle voice connect request from admin
  useEffect(() => {
    // console.log('[Student] Setting up voice-connect-request listener');
    const handleVoiceConnectRequest = async ({ from }: { from: string }) => {
      if (voicePeerRef.current) {
        voicePeerRef.current.destroy();
        voicePeerRef.current = null;
        setVoiceConnected(false);
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        // console.log('[Student] Got local audio stream:', stream, stream.getAudioTracks());
        // console.log('[Student] Creating Peer for voice, initiator: true, with stream:', stream);
        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        });
        voicePeerRef.current = peer;
        setVoiceConnected(true);
        peer.on('signal', (signal) => {
          // console.log('[Student] Sending voice-signal to', from, signal);
          socket.emit('voice-signal', { target: from, signalData: signal });
        });
        peer.on('stream', (remoteStream) => {
          // console.log('[Student] Received remote audio stream:', remoteStream); 
          // console.log('[Student] Audio tracks:', remoteStream.getAudioTracks());
          const audio = new window.Audio();
          audio.srcObject = remoteStream;
          audio.autoplay = true;
          audio.play().then(() => {
            // console.log('[Student] Audio playback started');
          }).catch((e) => {
            console.error('[Student] Audio playback failed:', e);
          });
        });
        peer.on('connect', () => {
          // console.log('[Student] Peer connection established for voice!');
          setVoiceConnected(true);
          toast.success('Voice connection established');
        });
        peer.on('close', () => {
          setVoiceConnected(false);
          voicePeerRef.current = null;
        });
        peer.on('error', (err) => {
          console.error('[Student] Peer connection error:', err);
          setVoiceConnected(false);
          voicePeerRef.current = null;
        });
      } catch {
        setVoiceConnected(false);
        voicePeerRef.current = null;
      }
    };
    socket.on('voice-connect-request', handleVoiceConnectRequest);
    return () => { socket.off('voice-connect-request', handleVoiceConnectRequest); };
  }, []);

  // Handle incoming voice-signal from admin
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    const handleVoiceSignal = ({ signalData, sender }: { sender: string, signalData: any }) => {
      // console.log('[Student] Received voice-signal from', sender, signalData);
      if (voicePeerRef.current) {
        try {
          voicePeerRef.current.signal(signalData);
        } catch {
          // ignore
        }
      }
    };
    socket.on('voice-signal', handleVoiceSignal);
    return () => { socket.off('voice-signal', handleVoiceSignal); };
  }, []);


  useEffect(() => {
    const handleRequestMediaStatus = () => {
      if (streamRef.current) {
        socket.emit('media-status', {
          examId,
          webcam: streamRef.current.getVideoTracks().length > 0,
          mic: streamRef.current.getAudioTracks().length > 0,
        });
      }
    };
    socket.on('request-media-status', handleRequestMediaStatus);
    return () => { socket.off('request-media-status', handleRequestMediaStatus); };
  }, [examId]);

  useEffect(() => {
    const handleVoiceDisconnect = () => {
      if (voicePeerRef.current) {
        voicePeerRef.current.destroy();
        voicePeerRef.current = null;
      }
      setVoiceConnected(false);
    };
    socket.on('voice-disconnect', handleVoiceDisconnect);
    return () => { socket.off('voice-disconnect', handleVoiceDisconnect); };
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // MCQ selection handler
  const handleMcqSelect = (index: number) => {
    setMcqSelected(index);
    if (onAnswerChange) onAnswerChange(index);
    updateActivity();
  };

  // MultiSelect selection handler
  const handleMultiSelectSelect = (index: number) => {
    const newSelected = (prev: number[]) => {
      // If already selected, remove it
      if (prev.includes(index)) {
        return prev.filter((i: number) => i !== index);
      }
      // Otherwise add it
      return [...prev, index];
    };

    setMultiSelectSelected(prev => {
      const updated = newSelected(prev);
      if (onAnswerChange) onAnswerChange(updated);
      return updated;
    });
    updateActivity();
  };

  // Structured question answer handler
  const handleStructuredAnswerChange = (value: string) => {
    setStructuredAnswer(value);
    if (onAnswerChange) onAnswerChange(value);
    updateActivity();
  };

  const handleNextClick = () => {
    if (isLastQuestion) {
      onComplete();
    } else {
      onNext();
    }
    updateActivity();
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'mcq':
        return (
          <MCQQuestion
            question={currentQuestion.question}
            options={currentQuestion.options}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            selected={mcqSelected}
            onSelect={handleMcqSelect}
            onNext={handleNextClick}
            time={timeRemaining}
            attachment={currentQuestion.attachment}
            isLastQuestion={isLastQuestion}
          />
        );

      case 'multiSelect':
        return (
          <MultiSelectQuestion
            question={currentQuestion.question}
            options={currentQuestion.options}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            selected={multiSelectSelected}
            onSelect={handleMultiSelectSelect}
            onNext={handleNextClick}
            time={timeRemaining}
            attachment={currentQuestion.attachment}
            isLastQuestion={isLastQuestion}
          />
        );

      case 'structured':
        return (
          <StructuredQuestion
            question={currentQuestion.question}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            answer={structuredAnswer}
            setAnswer={handleStructuredAnswerChange}
            onNext={handleNextClick}
            time={timeRemaining}
            attachment={currentQuestion.attachment}
            isLastQuestion={isLastQuestion}
          />
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  // --- Fullscreen and Security Logic ---
  useEffect(() => {
    examActiveRef.current = true;
    // Helper to request fullscreen
    const requestFullscreen = (element: HTMLElement | null) => {
      if (!element) return;
      if (document.fullscreenElement) return;
      if (element.requestFullscreen) {
        element.requestFullscreen();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } else if ((element as any).webkitRequestFullscreen) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (element as any).webkitRequestFullscreen();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } else if ((element as any).msRequestFullscreen) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (element as any).msRequestFullscreen();
      }
    };

    // Re-request fullscreen if exited, count violations
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && examActiveRef.current) {
        setFullscreenExitCount(prev => {
          const newCount = prev + 1;
          if (newCount >= MAX_FULLSCREEN_EXITS) {
            setFinalFullscreenLockout(true);
            setShowFullscreenWarning(false);
            setTimeout(() => {
              examActiveRef.current = false;
              onComplete();
            }, 1000);
          } else {
            setShowFullscreenWarning(true);
            requestFullscreen(mainContainerRef.current);
          }
          return newCount;
        });
      } else {
        setShowFullscreenWarning(false);
      }
    };

    // Warn/block on tab switch
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible' && examActiveRef.current) {
        setShowTabWarning(true);
      } else {
        setShowTabWarning(false);
      }
    };
    const handleBlur = () => {
      if (examActiveRef.current) setShowTabWarning(true);
    };
    const handleFocus = () => {
      setShowTabWarning(false);
    };

    // Prevent refresh/close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (examActiveRef.current) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange as (e: Event) => void);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange as (e: Event) => void);
    document.addEventListener('msfullscreenchange', handleFullscreenChange as (e: Event) => void);
    document.addEventListener('visibilitychange', handleVisibilityChange as (e: Event) => void);
    window.addEventListener('blur', handleBlur as (e: Event) => void);
    window.addEventListener('focus', handleFocus as (e: Event) => void);
    window.addEventListener('beforeunload', handleBeforeUnload as (e: BeforeUnloadEvent) => void);

    // Initial fullscreen request
    setTimeout(() => requestFullscreen(mainContainerRef.current), 100);

    return () => {
      examActiveRef.current = false;
      setFullscreenExitCount(0);
      setFinalFullscreenLockout(false);
      document.removeEventListener('fullscreenchange', handleFullscreenChange as (e: Event) => void);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange as (e: Event) => void);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange as (e: Event) => void);
      document.removeEventListener('visibilitychange', handleVisibilityChange as (e: Event) => void);
      window.removeEventListener('blur', handleBlur as (e: Event) => void);
      window.removeEventListener('focus', handleFocus as (e: Event) => void);
      window.removeEventListener('beforeunload', handleBeforeUnload as (e: BeforeUnloadEvent) => void);
      setShowFullscreenWarning(false);
      setShowTabWarning(false);
    };
  }, [onComplete]);

  return (
    <div ref={mainContainerRef} className="relative">
      {/* Fullscreen Warning */}
      {showFullscreenWarning && !finalFullscreenLockout && (
        <div className="fixed top-0 left-0 w-full z-[9999] bg-yellow-500 text-white px-4 py-3 text-center text-lg font-bold shadow-lg">
          Please do not exit fullscreen mode during the exam.<br />
          {`You have ${MAX_FULLSCREEN_EXITS - fullscreenExitCount} attempt(s) remaining before the exam is auto-submitted.`}
        </div>
      )}
      {finalFullscreenLockout && (
        <div className="fixed top-0 left-0 w-full z-[9999] bg-red-700 text-white px-4 py-3 text-center text-lg font-bold shadow-lg">
          You exited fullscreen too many times. The exam is being submitted.
        </div>
      )}
      {/* Tab Switch Warning */}
      {showTabWarning && (
        <div className="fixed top-0 left-0 w-full z-[9999] bg-red-600 text-white px-4 py-3 text-center text-lg font-bold shadow-lg">
          Tab switching or minimizing is not allowed during the exam.
        </div>
      )}
      <div className="fixed bottom-4 left-4 z-[100]">
        <div className="w-[320px] h-[240px] rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 shadow-md relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover cursor-pointer bg-black"
          />
          <div className="absolute top-2 right-2 z-20 flex space-x-2">
            {voiceConnected && (
              <button className="bg-black/50 hover:bg-black/60 cursor-pointer text-white rounded-full p-2 shadow-lg transition-colors" title="Voice Chat Active">
                <Mic className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => {
                socket.emit('student-help-request', { from: socket.id, examId });
                toast.info('Help request sent. Please wait for assistance.');
              }}
              className="bg-black/50 hover:bg-black/60 cursor-pointer text-white rounded-full p-2 shadow-lg transition-colors"
              title="Need Help"
            >
              <Hand className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 bg-black/40 text-white text-xs px-2 py-0.5 rounded">
            Proctoring active
          </div>
        </div>
      </div>

      {showProctoringWarning && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">Please ensure you are actively taking the exam</span>
          <button
            onClick={() => setShowProctoringWarning(false)}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Message Inbox */}
      <MessageInbox
        open={inboxOpen}
        onClose={() => setInboxOpen(false)}
        messages={messages}
        canSend={true}
        onSend={msg => {
          socket.emit('private-message', { to: adminId, from: socket.id, message: msg, participantId: socket.id ?? '' });
          setMessages(prev => ([...prev, { from: socket.id ?? '', message: msg, studentName: studentName, studentId: studentId }]));
          updateActivity();
        }}
        participantName={studentName}
        participantId={studentId}
        isProctor={false}
        selfId={socket.id}
      />

      {/* Question Content */}
      <div className="mt-16">
        {renderQuestion()}
      </div>
    </div>
  );
}

export default QuestionComponent;