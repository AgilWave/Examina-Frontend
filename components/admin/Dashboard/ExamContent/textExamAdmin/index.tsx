"use client";

import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import socket from "@/lib/socket";
import MessageInbox from '@/components/common/MessageInbox';
import { Video, Mic, MicOff, VideoOff, Hand, MessageCircle, User, VolumeX } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { toast } from "sonner";


interface StreamData {
  id: string;
  stream: MediaStream;
}

interface AdminViewProps {
  examId: string;
}

export default function AdminView({ examId }: AdminViewProps) {
  const [streams, setStreams] = useState<StreamData[]>([]);
  const peerMap = useRef<{ [id: string]: Peer.Instance }>({});
  const connectionStates = useRef<{ [id: string]: string }>({});
  const peerInitiatorMap = useRef<{ [id: string]: boolean }>({});
  const [inboxOpen, setInboxOpen] = useState<{ [id: string]: boolean }>({});
  const [messages, setMessages] = useState<{ [id: string]: { from: string; message: string; studentName?: string; studentId?: string }[] }>({});
  const [handsUp, setHandsUp] = useState<{ [id: string]: boolean }>({});
  const audioPeerMap = useRef<{ [id: string]: Peer.Instance }>({});
  const [activeAudio, setActiveAudio] = useState<{ [id: string]: boolean }>({});
  const [mediaStatus, setMediaStatus] = useState<{ [id: string]: { webcam: boolean; mic: boolean } }>({});
  const [socketToStudentId, setSocketToStudentId] = useState<{ [socketId: string]: { studentId: string, studentName: string } }>({});



  const createPeerConnection = (userId: string, isInitiator: boolean = true) => {
    if (peerMap.current[userId]) {
      return peerMap.current[userId];
    }

    const peer = new Peer({
      initiator: isInitiator,
      trickle: false,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      }
    });

    connectionStates.current[userId] = 'connecting';
    peerInitiatorMap.current[userId] = isInitiator;

    peer.on("signal", (signalData) => {
      socket.emit("signal", { target: userId, signalData });
    });

    peer.on("connect", () => {
      connectionStates.current[userId] = 'connected';
    });

    peer.on("stream", (remoteStream) => {
      setStreams((prev) => {
        const exists = prev.find((s) => s.id === userId);
        if (exists) return prev;
        return [...prev, { id: userId, stream: remoteStream }];
      });
    });

    peer.on("error", (err) => {
      console.error(`[Admin] Peer error for ${userId}:`, err);
      if (peerMap.current[userId]) {
        peerMap.current[userId].destroy();
        delete peerMap.current[userId];
        delete connectionStates.current[userId];
        delete peerInitiatorMap.current[userId];
      }
      setStreams((prev) => prev.filter((s) => s.id !== userId));
    });

    peer.on("close", () => {
      delete peerMap.current[userId];
      delete connectionStates.current[userId];
      delete peerInitiatorMap.current[userId];
      setStreams((prev) => prev.filter((s) => s.id !== userId));
    });

    peerMap.current[userId] = peer;
    return peer;
  };

  useEffect(() => {
    socket.emit("join-exam", { examId, role: "admin" });

    socket.on("user-joined", ({ id, studentId, studentName }) => {
      createPeerConnection(id, true);
      setSocketToStudentId(prev => ({ ...prev, [id]: { studentId, studentName } }));
    });

    socket.on("existing-users", ({ users }) => {
      const studentIdMap: { [key: string]: { studentId: string, studentName: string } } = {};
      users.forEach((user: { id: string, studentId: string, studentName: string }) => {
        studentIdMap[user.id] = { studentId: user.studentId, studentName: user.studentName };
        createPeerConnection(user.id, true);
      });
      setSocketToStudentId(prev => ({ ...prev, ...studentIdMap }));
    });

    socket.on("signal", ({ sender, signalData }) => {
      let peer = peerMap.current[sender];

      if (!peer && signalData.type === 'offer') {
        peer = createPeerConnection(sender, false);
      }

      if (!peer) {
        return;
      }

      try {
        if (signalData.type === 'offer' && peerInitiatorMap.current[sender]) {
          return;
        }

        if (signalData.type === 'answer' && !peerInitiatorMap.current[sender]) {
          return;
        }

        peer.signal(signalData);
      } catch (err) {
        console.error(`[Admin] Signal error for ${sender}:`, err);
        if (peerMap.current[sender]) {
          peerMap.current[sender].destroy();
          delete peerMap.current[sender];
          delete connectionStates.current[sender];
          delete peerInitiatorMap.current[sender];
          setTimeout(() => {
            createPeerConnection(sender, signalData.type !== 'offer');
          }, 1000);
        }
      }
    });

    socket.on("user-left", ({ id }) => {
      setSocketToStudentId(prev => {
        const copy = { ...prev };
        delete copy[id];
        setMediaStatus((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
        setHandsUp((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
        setInboxOpen((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
        setMessages((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
        setActiveAudio((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
        if (audioPeerMap.current[id]) {
          audioPeerMap.current[id].destroy();
          delete audioPeerMap.current[id];
        }
        setStreams((prev) => prev.filter((s) => s.id !== id));
        return copy;
      });
    });

    return () => {
      socket.off("user-joined");
      socket.off("existing-users");
      socket.off("signal");
      socket.off("user-left");

      Object.values(peerMap.current).forEach((peer) => {
        try {
          peer.destroy();
        } catch {
          // ignore
        }
      });

      peerMap.current = {};
      connectionStates.current = {};
      peerInitiatorMap.current = {};
      setStreams([]);
    };
  }, [examId]);

  useEffect(() => {
    const handlePrivateMessage = ({ from, message, participantId, studentName, studentId }: { from: string; message: string; participantId: string; studentName?: string; studentId?: string }) => {
      setMessages(prev => ({
        ...prev,
        [participantId]: [...(prev[participantId] || []), { from, message, studentName, studentId }]
      }));
      setInboxOpen(prev => ({ ...prev, [participantId]: true }));
    };
    socket.on('private-message', handlePrivateMessage);
    return () => { socket.off('private-message', handlePrivateMessage); };
  }, []);


  useEffect(() => {
    const handleHelp = ({ from }: { from: string }) => {
      setHandsUp(prev => ({ ...prev, [from]: true }));
    };
    socket.on('student-help-request', handleHelp);
    return () => { socket.off('student-help-request', handleHelp); };
  }, []);

  useEffect(() => {
    const handleVoiceSignal = ({ sender, signalData }: { sender: string, signalData: unknown }) => {
      let peer = audioPeerMap.current[sender];
      if (!peer) {
        peer = new Peer({
          initiator: false,
          trickle: false,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        });
        audioPeerMap.current[sender] = peer;
        setActiveAudio(prev => ({ ...prev, [sender]: true }));
        peer.on('signal', (signal) => {
          socket.emit('voice-signal', { target: sender, signalData: signal });
        });
        peer.on('stream', (remoteStream) => {
          const audio = new window.Audio();
          audio.srcObject = remoteStream;
          audio.autoplay = true;
          audio.play().catch((e) => {
            console.error('[Admin] Audio playback failed:', e);
          });
        });
        peer.on('connect', () => {
          // connected
        });
        peer.on('error', (err) => {
          console.error('[Admin] Peer connection error:', err);
        });
        peer.on('close', () => {
          setActiveAudio(prev => ({ ...prev, [sender]: false }));
          delete audioPeerMap.current[sender];
        });
        peer.on('error', () => {
          setActiveAudio(prev => ({ ...prev, [sender]: false }));
          delete audioPeerMap.current[sender];
        });
      }
      peer.signal(signalData as Peer.SignalData);
    };
    socket.on('voice-signal', handleVoiceSignal);
    return () => { socket.off('voice-signal', handleVoiceSignal); };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleMediaStatus = ({ sender, webcam, mic, examId }: { sender: string, webcam: boolean, mic: boolean, examId: string }) => {
      setMediaStatus(prev => ({ ...prev, [sender]: { webcam, mic } }));
    };
    socket.on('media-status', handleMediaStatus);
    return () => {
      socket.off('media-status', handleMediaStatus);
    };
  }, []);

  return (
    <div className="flex h-[90vh] w-full bg-gray-50 dark:bg-neutral-900 rounded-lg shadow-lg overflow-hidden">
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Admin Live View – Exam ID: {examId}</h2>
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          Joined: {streams.length} students
        </div>
        {streams.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">No students connected yet...</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6">
          {streams.map(({ id, stream }) => (
            <div key={id} className="relative rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md p-3 flex flex-col items-center transition-transform hover:scale-[1.02] group">
              {handsUp[id] && (
                <div className="absolute top-3 right-3 z-10 animate-pulse">
                  <Hand className="text-yellow-400 w-8 h-8 drop-shadow-lg" />
                </div>
              )}
              <div className="w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                <video
                  ref={(video) => {
                    if (video && video.srcObject !== stream) {
                      video.srcObject = stream;
                    }
                  }}
                  autoPlay
                  playsInline
                  muted
                  controls={false}
                  className="w-full h-full object-cover rounded-lg"
                  onLoadedMetadata={() => {
                  }}
                  onError={() => {
                    // error handled elsewhere
                  }}
                />
              </div>
              <div className="w-full mt-3 flex flex-col items-center gap-1">
                <span className="font-semibold text-gray-700 dark:text-gray-100 text-base truncate max-w-full flex items-center gap-1">
                  <User className="w-4 h-4 inline-block text-blue-400 dark:text-blue-300" />
                  {socketToStudentId[id]?.studentName || ''}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-400">ID: {socketToStudentId[id]?.studentId || id}</span>
                <div className="flex gap-2 mt-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {mediaStatus[id]?.webcam ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 flex items-center gap-1">
                          <Video className="w-4 h-4" /> On
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 dark:bg-neutral-700 text-gray-400 dark:text-gray-500 flex items-center gap-1">
                          <VideoOff className="w-4 h-4" /> Off
                        </span>
                      )}
                    </TooltipTrigger>
                    <TooltipContent>Webcam {mediaStatus[id]?.webcam ? 'On' : 'Off'}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {mediaStatus[id]?.mic ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 flex items-center gap-1">
                          <Mic className="w-4 h-4" /> On
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 dark:bg-neutral-700 text-gray-400 dark:text-gray-500 flex items-center gap-1">
                          <MicOff className="w-4 h-4" /> Off
                        </span>
                      )}
                    </TooltipTrigger>
                    <TooltipContent>Mic {mediaStatus[id]?.mic ? 'On' : 'Off'}</TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">Status: {connectionStates.current[id] || 'connecting'}</span>
              </div>
              <div className="flex gap-2 w-full mt-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-2 py-1 text-xs font-semibold transition flex items-center justify-center gap-1"
                      onClick={() => {
                        setInboxOpen(prev => ({ ...prev, [id]: true }));
                        if (handsUp[id]) {
                          setHandsUp(prev => ({ ...prev, [id]: false }));
                        }
                      }}
                    >
                      <MessageCircle className="w-4 h-4" /> Message
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Send Message</TooltipContent>
                </Tooltip>
                {!activeAudio[id] && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={`flex-1 bg-gray-200 dark:bg-neutral-700 hover:bg-green-500 text-white rounded-lg px-2 py-1 text-xs font-semibold transition flex items-center justify-center gap-1`}
                        onClick={async () => {
                          if (!audioPeerMap.current[id]) {
                            let stream: MediaStream | null = null;
                            try {
                              stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                            } catch {
                              toast.error('Could not access microphone. Please allow microphone access.');
                              return;
                            }
                            const peer = new Peer({
                              initiator: false,
                              trickle: false,
                              stream,
                              config: {
                                iceServers: [
                                  { urls: 'stun:stun.l.google.com:19302' },
                                  { urls: 'stun:global.stun.twilio.com:3478' }
                                ]
                              }
                            });
                            audioPeerMap.current[id] = peer;
                            setActiveAudio(prev => ({ ...prev, [id]: true }));
                            peer.on('signal', (signal) => {
                              socket.emit('voice-signal', { target: id, signalData: signal });
                            });
                            peer.on('stream', (remoteStream) => {
                              const audio = new window.Audio();
                              audio.srcObject = remoteStream;
                              audio.autoplay = true;
                              audio.play().then(() => {
                              }).catch((e) => {
                                console.error('[Admin] Audio playback failed:', e);
                              });
                            });
                            peer.on('connect', () => {
                            });
                            peer.on('error', (err) => {
                              console.error('[Admin] Peer connection error:', err);
                            });
                            peer.on('close', () => {
                              setActiveAudio(prev => ({ ...prev, [id]: false }));
                              delete audioPeerMap.current[id];
                            });
                            peer.on('error', () => {
                              setActiveAudio(prev => ({ ...prev, [id]: false }));
                              delete audioPeerMap.current[id];
                            });
                          }
                          socket.emit('voice-connect-request', { to: id });
                        }}
                        disabled={!!activeAudio[id]}
                      >
                        <Mic className="w-4 h-4" /> Voice Connect
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Voice Connect</TooltipContent>
                  </Tooltip>
                )}
                {activeAudio[id] && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg px-2 py-1 text-xs font-semibold transition flex items-center justify-center gap-1"
                        onClick={() => {
                          if (audioPeerMap.current[id]) {
                            audioPeerMap.current[id].destroy();
                            delete audioPeerMap.current[id];
                            setActiveAudio(prev => ({ ...prev, [id]: false }));
                            socket.emit('voice-disconnect', { to: id });
                          }
                        }}
                        disabled={!activeAudio[id]}
                      >
                        <VolumeX className="w-4 h-4" /> Disconnect
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Disconnect Voice</TooltipContent>
                  </Tooltip>
                )}
              </div>
              <MessageInbox
                open={!!inboxOpen[id]}
                onClose={() => setInboxOpen(prev => ({ ...prev, [id]: false }))}
                messages={messages[id] || []}
                canSend={true}
                onSend={msg => {
                  socket.emit('private-message', { to: id, from: 'admin', message: msg, participantId: id });
                  setMessages(prev => ({
                    ...prev,
                    [id]: [...(prev[id] || []), { from: 'admin', message: msg, studentName: socketToStudentId[id]?.studentName, studentId: socketToStudentId[id]?.studentId }]
                  }));
                }}
                participantName={socketToStudentId[id]?.studentName}
                participantId={socketToStudentId[id]?.studentId}
                isProctor={true}
                selfId={'admin'}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="w-80 bg-white/90 dark:bg-neutral-900/90 border-l border-gray-200 dark:border-neutral-800 p-6 flex flex-col gap-4 overflow-y-auto shadow-lg">
        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-100 mb-2">Joined Students</h3>
        <ul className="flex-1 flex flex-col gap-3">
          {Object.entries(socketToStudentId).length === 0 && (
            <li className="text-gray-400 dark:text-gray-500 text-sm">No students joined.</li>
          )}
          {Object.entries(socketToStudentId).map(([sid, { studentId, studentName }]) => (
            <li key={sid} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition group border border-gray-100 dark:border-neutral-800">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 dark:from-blue-900 dark:to-blue-600 flex items-center justify-center text-lg font-bold text-white shadow">
                {studentName?.[0] || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 dark:text-gray-100 truncate">{studentName || 'Unknown'}</div>
                <div className="text-xs text-gray-400 dark:text-gray-400 truncate">ID: {studentId || sid}</div>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <Tooltip>
                  <TooltipTrigger asChild>
                    {mediaStatus[sid]?.webcam ? (
                      <Video className="w-4 h-4 text-green-500" />
                    ) : (
                      <VideoOff className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    )}
                  </TooltipTrigger>
                  <TooltipContent>Webcam {mediaStatus[sid]?.webcam ? 'On' : 'Off'}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {mediaStatus[sid]?.mic ? (
                      <Mic className="w-4 h-4 text-green-500" />
                    ) : (
                      <MicOff className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    )}
                  </TooltipTrigger>
                  <TooltipContent>Mic {mediaStatus[sid]?.mic ? 'On' : 'Off'}</TooltipContent>
                </Tooltip>
                {handsUp[sid] && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Hand className="w-5 h-5 text-yellow-400 animate-bounce" />
                    </TooltipTrigger>
                    <TooltipContent>Hand Raised</TooltipContent>
                  </Tooltip>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}