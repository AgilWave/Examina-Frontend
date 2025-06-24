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
  const [mcqSelected, setMcqSelected] = useState<number | null>(null);
  const [multiSelectSelected, setMultiSelectSelected] = useState<number[]>([]);
  const [structuredAnswer, setStructuredAnswer] = useState<string>('');

  // WebRTC and proctoring 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [peers, setPeers] = useState<PeerData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: string; message: string }[]>([]);
  const [adminId, setAdminId] = useState<string | null>(null);
  const voicePeerRef = useRef<Peer.Instance | null>(null);
  const [voiceConnected, setVoiceConnected] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<{ [id: string]: PeerInstance }>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showProctoringWarning, setShowProctoringWarning] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lastActivity, setLastActivity] = useState(Date.now());
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      console.log(`[Student] Sending signal to ${id}`, signal.type);
      socket.emit('signal', { target: id, signalData: signal });
    });

    peer.on('connect', () => {
      console.log(`[Student] Connected to peer ${id}`);
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
      console.log(`[Student] Peer connection closed with ${id}`);
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

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

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
          socket.emit('join-exam', { examId, role: "student" });
        }

        // Socket event listeners
        const handleExistingUsers = ({ users }: { users: string[] }) => {
          if (!mounted) return;
          console.log('[Student] Existing users:', users);
          users.forEach((id) => {
            if (id !== socket.id && !peersRef.current[id]) {
              console.log(`[Student] Creating peer for existing user: ${id}`);
              createPeer(id, true, stream);
            }
          });
        };

        const handleUserJoined = ({ id }: { id: string }) => {
          if (!mounted) return;
          console.log('[Student] User joined:', id);
          if (id !== socket.id && !peersRef.current[id]) {
            // toast.info('Proctor joined: ' + id);
            createPeer(id, false, stream);
          }
        };

        const handleUserLeft = ({ id }: { id: string }) => {
          if (!mounted) return;
          console.log('[Student] User left:', id);
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
          console.log(`[Student] Received signal from ${sender}`, (signalData as any).type);

          let peer = peersRef.current[sender];

          if (!peer) {
            console.log(`[Student] Creating new peer for ${sender}`);
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

  // Reset answers when question changes
  useEffect(() => {
    setMcqSelected(null);
    setMultiSelectSelected([]);
    setStructuredAnswer('');
    updateActivity();
  }, [currentQuestionIndex, updateActivity]);

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
    const handlePrivateMessage = ({ from, message }: { from: string; message: string }) => {
      setMessages(prev => [...prev, { from, message }]);
      setInboxOpen(true);
      updateActivity();
    };
    socket.on('private-message', handlePrivateMessage);
    return () => { socket.off('private-message', handlePrivateMessage); };
  }, [updateActivity]);

  useEffect(() => {
    const handleAdminInfo = ({ adminId }: { adminId: string }) => {
      console.log('[Student] Admin ID:', adminId);
      setAdminId(adminId);
    };
    socket.on('admin-info', handleAdminInfo);
    return () => { socket.off('admin-info', handleAdminInfo); };
  }, []);

  // Handle voice connect request from admin
  useEffect(() => {
    const handleVoiceConnectRequest = async ({ from }: { from: string }) => {
      if (voicePeerRef.current) {
        voicePeerRef.current.destroy();
        voicePeerRef.current = null;
        setVoiceConnected(false);
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
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
          socket.emit('voice-signal', { target: from, signalData: signal });
        });
        peer.on('connect', () => {
          setVoiceConnected(true);
          toast.success('Voice connection established');
        });
        peer.on('close', () => {
          setVoiceConnected(false);
          voicePeerRef.current = null;
        });
        peer.on('error', () => {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleVoiceSignal = ({ signalData }: { sender: string, signalData: any }) => {
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

  // Handle next button click
  const handleNextClick = () => {
    if (isLastQuestion) {
      onComplete();
    } else {
      onNext();
    }
    updateActivity();
  };

  // Render the appropriate question component based on the question type
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
          />
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className="relative">
      {/* Proctoring Video Overlay (now styled like question camera preview) */}
      <div className="fixed bottom-4 left-4 z-[100]">
        <div className="w-[320px] h-[240px] rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 shadow-md relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover cursor-pointer bg-black"
          />
          {/* Hand Help Icon at top right */}
          <div className="absolute top-2 right-2 z-20 flex space-x-2">
            {voiceConnected && (
              <button
                className="bg-black/50 hover:bg-black/60 cursor-pointer text-white rounded-full p-2 shadow-lg transition-colors"
                title="Voice Chat Active"
                type="button"
                tabIndex={-1}
                disabled
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => {
                socket.emit('student-help-request', { from: socket.id, examId });
                toast.info('Admin will notify you. Please wait for help.');
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

      {/* Activity Warning */}
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
          setMessages(prev => ([...prev, { from: socket.id ?? '', message: msg }]));
          updateActivity();
        }}
      />

      {/* Question Content */}
      <div className="mt-16">
        {renderQuestion()}
      </div>
    </div>
  );
}

export default QuestionComponent;