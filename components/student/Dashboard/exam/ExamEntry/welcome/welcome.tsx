'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Peer, { Instance as PeerInstance } from 'simple-peer';
import socket from '@/lib/socket';
import { toast } from 'sonner';
import MessageInbox from '@/components/common/MessageInbox';

interface DataManagementProps {
  onPrev: () => void;
  onNext: () => void;
  examStartTime?: string; // ISO string for exam start time
  examId?: string;
}

interface PeerData {
    id: string;
    peer: PeerInstance;
}

export function DataManagement({ onPrev, onNext, examStartTime, examId = 'test-exam' }: DataManagementProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [canProceed, setCanProceed] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // WebRTC and proctoring states
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [peers, setPeers] = useState<PeerData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: string; message: string }[]>([]);
  const [adminId, setAdminId] = useState<string | null>(null);
  const voicePeerRef = useRef<Peer.Instance | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [voiceConnected, setVoiceConnected] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<{ [id: string]: PeerInstance }>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get stream with specific devices
  const getStream = useCallback(async () => {
    const constraints: MediaStreamConstraints = {
      video: { 
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
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
      toast.error(`Something went wrong! Contact Admin`);
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
        setStream(stream);
        
        // Set video element srcObject immediately
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(err => console.error("Error playing video:", err));
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
          console.log(`[Student] Received signal from ${sender}`, signalData.type);

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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleError = (error: any) => {
          if (!mounted) return;
          console.error('[Student] Socket error:', error);
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (mounted) {
          toast.error('Something went wrong! Contact Admin');
          console.error('Media error', err);
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId, getStream, createPeer]);

  // Update video element when stream changes
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => console.error("Error playing video:", err));
    }
  }, [stream]);

  useEffect(() => {
    const handlePrivateMessage = ({ from, message }: { from: string; message: string }) => {
      setMessages(prev => [...prev, { from, message }]);
      setInboxOpen(true);
    };
    socket.on('private-message', handlePrivateMessage);
    return () => { socket.off('private-message', handlePrivateMessage); };
  }, []);

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
    return () => {socket.off('voice-disconnect', handleVoiceDisconnect);};
  }, []);

  // Countdown timer based on exam start time
  useEffect(() => {
    if (!examStartTime) {
      setCanProceed(true);
      return;
    }

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Convert exam start time to Sri Lanka timezone
      const examStartDate = new Date(examStartTime);
      const sriLankaExamStart = new Date(examStartDate.toLocaleString("en-US", {
        timeZone: "Asia/Colombo"
      }));
      
      const remaining = Math.max(0, sriLankaExamStart.getTime() - now.getTime());
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        setCanProceed(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [examStartTime]);

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      timeZone: "Asia/Colombo",
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="text-center space-y-8">
      <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
          <div className="flex items-center space-x-2 ">
            <div className={`w-2 h-2 rounded-full bg-green-500`}></div>
            <span className="text-xs text-gray-600 dark:text-gray-300">
              Proctoring Active
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-black dark:text-white">Welcome to</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Data Management Examination</p>
      </div>

      {/* Current Time Display */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-w-md mx-auto">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Time (Sri Lanka)</p>
        <p className="text-lg font-mono text-black dark:text-white">
          {formatDateTime(currentTime)}
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {examStartTime ? 'Exam Starts In' : 'Exam Ready to Start'}
          </p>
          <div className="text-8xl font-bold text-black dark:text-white tracking-tight">
            {examStartTime ? formatTime(timeLeft) : '00:00'}
          </div>
        </div>
        
        {examStartTime && (
          <div className="max-w-md mx-auto">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-teal-500 h-2 rounded-full transition-all duration-100 ml-auto" 
                style={{
                  width: `${examStartTime ? Math.max(0, (timeLeft / (new Date(examStartTime).getTime() - new Date().getTime())) * 100) : 0}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Camera Preview */}
      <div className="max-w-xs mx-auto">
        <p className="text-gray-600 dark:text-gray-300 mb-2">Camera Preview</p>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden aspect-video relative border-2 border-gray-300 dark:border-gray-600">
          {stream ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
              style={{ 
                minHeight: '200px',
                backgroundColor: '#000'
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-2"></div>
                <p className="text-gray-400 text-sm">Accessing camera...</p>
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Make sure your face is clearly visible</p>
      </div>

      {/* Message Inbox */}
      <MessageInbox
        open={inboxOpen}
        onClose={() => setInboxOpen(false)}
        messages={messages}
        canSend={true}
        onSend={msg => {
          socket.emit('private-message', { to: adminId, from: socket.id, message: msg, participantId: socket.id ?? ''  });
          setMessages(prev => ([...prev, { from: socket.id ?? '', message: msg }]));
        }}
      />

      <div className="pt-4 flex justify-center space-x-4">
        <button
          onClick={onPrev}
          className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl text-lg font-medium shadow-lg transition-colors"
        >
          Back
        </button>
        
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`px-8 py-3 rounded-xl text-lg font-medium shadow-lg transition-all ${
            canProceed
              ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-teal-500/25 hover:scale-105'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          {canProceed ? 'Start Exam' : 'Waiting for Exam to Start...'}
        </button>
      </div>
    </div>
  );
}
