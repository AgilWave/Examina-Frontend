"use client";

import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import socket from "@/lib/socket";
import MessageInbox from '@/components/common/MessageInbox';


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
  const [messages, setMessages] = useState<{ [id: string]: { from: string; message: string }[] }>({});
  const [handsUp, setHandsUp] = useState<{ [id: string]: boolean }>({});
  const audioPeerMap = useRef<{ [id: string]: Peer.Instance }>({});
  const [activeAudio, setActiveAudio] = useState<{ [id: string]: boolean }>({});
  const [mediaStatus, setMediaStatus] = useState<{ [id: string]: { webcam: boolean; mic: boolean } }>({});


  const createPeerConnection = (userId: string, isInitiator: boolean = true) => {
    if (peerMap.current[userId]) {
      console.log(`[Admin] Peer already exists for ${userId}`);
      return peerMap.current[userId];
    }

    console.log(`[Admin] Creating peer for ${userId}, initiator: ${isInitiator}`);

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
      console.log(`[Admin] Sending signal to ${userId}:`, signalData.type);
      socket.emit("signal", { target: userId, signalData });
    });

    peer.on("connect", () => {
      console.log(`[Admin] Connected to ${userId}`);
      connectionStates.current[userId] = 'connected';
    });

    peer.on("stream", (remoteStream) => {
      console.log(`[Admin] Received stream from ${userId}`);
      setStreams((prev) => {
        const exists = prev.find((s) => s.id === userId);
        if (exists) return prev;
        return [...prev, { id: userId, stream: remoteStream }];
      });
    });

    peer.on("error", (err) => {
      console.error(`[Admin] Peer error for ${userId}:`, err);
      // Clean up failed connection
      if (peerMap.current[userId]) {
        peerMap.current[userId].destroy();
        delete peerMap.current[userId];
        delete connectionStates.current[userId];
        delete peerInitiatorMap.current[userId];
      }
      // Remove stream if it exists
      setStreams((prev) => prev.filter((s) => s.id !== userId));
    });

    peer.on("close", () => {
      console.log(`[Admin] Connection closed for ${userId}`);
      delete peerMap.current[userId];
      delete connectionStates.current[userId];
      delete peerInitiatorMap.current[userId];
      setStreams((prev) => prev.filter((s) => s.id !== userId));
    });

    peerMap.current[userId] = peer;
    return peer;
  };

  useEffect(() => {
    console.log(`[Admin] Joining exam: ${examId}`);
    socket.emit("join-exam", { examId, role: "admin" });

    // Handle new users joining
    socket.on("user-joined", ({ id }) => {
      console.log(`[Admin] User joined: ${id}`);
      createPeerConnection(id, true); // Admin initiates connection
    });

    // Handle existing users already in the room
    socket.on("existing-users", ({ users }) => {
      console.log(`[Admin] Existing users:`, users);
      users.forEach((userId: string) => {
        createPeerConnection(userId, true);
      });
    });

    // Handle signaling
    socket.on("signal", ({ sender, signalData }) => {
      console.log(`[Admin] Received signal from ${sender}:`, signalData.type);

      let peer = peerMap.current[sender];

      // If no peer exists and this is an offer, create a non-initiator peer
      if (!peer && signalData.type === 'offer') {
        console.log(`[Admin] Creating non-initiator peer for ${sender}`);
        peer = createPeerConnection(sender, false);
      }

      if (!peer) {
        console.warn(`[Admin] No peer found for sender: ${sender}`);
        return;
      }

      try {
        // Check if peer is in correct state for the signal
        if (signalData.type === 'offer' && peerInitiatorMap.current[sender]) {
          console.warn(`[Admin] Received offer but peer is initiator for ${sender}`);
          return;
        }

        if (signalData.type === 'answer' && !peerInitiatorMap.current[sender]) {
          console.warn(`[Admin] Received answer but peer is not initiator for ${sender}`);
          return;
        }

        peer.signal(signalData);
      } catch (err) {
        console.error(`[Admin] Signal error for ${sender}:`, err);

        // If signaling fails, try to recreate the connection
        if (peerMap.current[sender]) {
          peerMap.current[sender].destroy();
          delete peerMap.current[sender];
          delete connectionStates.current[sender];
          delete peerInitiatorMap.current[sender];

          // Recreate with opposite initiator role
          setTimeout(() => {
            createPeerConnection(sender, signalData.type !== 'offer');
          }, 1000);
        }
      }
    });

    // Handle user disconnection
    socket.on("user-left", ({ id }) => {
      console.log(`[Admin] User left: ${id}`);
      if (peerMap.current[id]) {
        peerMap.current[id].destroy();
        delete peerMap.current[id];
        delete connectionStates.current[id];
        delete peerInitiatorMap.current[id];
      }
      setStreams((prev) => prev.filter((s) => s.id !== id));
    });

    return () => {
      console.log("[Admin] Cleaning up connections");
      socket.off("user-joined");
      socket.off("existing-users");
      socket.off("signal");
      socket.off("user-left");

      // Destroy all peer connections
      Object.values(peerMap.current).forEach((peer) => {
        try {
          peer.destroy();
        } catch (err) {
          console.error("Error destroying peer:", err);
        }
      });

      peerMap.current = {};
      connectionStates.current = {};
      peerInitiatorMap.current = {};
      setStreams([]);
    };
  }, [examId]);

  // Listen for incoming messages
  useEffect(() => {
    const handlePrivateMessage = ({ from, message, participantId }: { from: string; message: string; participantId: string }) => {
      setMessages(prev => ({
        ...prev,
        [participantId]: [...(prev[participantId] || []), { from, message }]
      }));
      setInboxOpen(prev => ({ ...prev, [participantId]: true }));
    };
    socket.on('private-message', handlePrivateMessage);
    return () => { socket.off('private-message', handlePrivateMessage); };
  }, []);


  useEffect(() => {
    const handleHelp = ({ from }: { from: string }) => {
      setHandsUp(prev => ({ ...prev, [from]: true }));
      // Optionally, show a toast or sound
    };
    socket.on('student-help-request', handleHelp);
    return () => { socket.off('student-help-request', handleHelp); };
  }, []);

  // --- AUDIO SIGNALING ---
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any  
    const handleVoiceSignal = ({ sender, signalData }: { sender: string, signalData: any }) => {
      let peer = audioPeerMap.current[sender];
      if (!peer) {
        // Create receiving peer (admin is not initiator)
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
          // Play audio
          const audio = new window.Audio();
          audio.srcObject = remoteStream;
          audio.autoplay = true;
          audio.play();
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
      peer.signal(signalData);
    };
    socket.on('voice-signal', handleVoiceSignal);
    return () => { socket.off('voice-signal', handleVoiceSignal); };
  }, []);

  useEffect(() => {
    // Listen for media status updates from students
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Admin Live View – Exam ID: {examId}</h2>

      <div className="mb-4 text-sm text-gray-600">
        Connected: {streams.length} students
      </div>

      {streams.length === 0 && (
        <p className="text-sm text-gray-500">No students connected yet...</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {streams.map(({ id, stream }) => (
          <div key={id} className="relative rounded overflow-hidden border p-2 bg-black">
            {/* Hands up icon in top right, large and overlayed */}
            {handsUp[id] && (
              <div className="absolute top-2 right-2 z-10">
                <span className="text-yellow-400 text-4xl select-none">👋</span>
              </div>
            )}
            <video
              ref={(video) => {
                if (video && video.srcObject !== stream) {
                  video.srcObject = stream;
                }
              }}
              autoPlay
              playsInline
              muted // Mute to prevent audio feedback
              controls={false}
              className="w-full h-48 object-cover"
              onLoadedMetadata={() => {
                console.log(`[Admin] Video loaded for ${id}`);
              }}
              onError={(e) => {
                console.error(`[Admin] Video error for ${id}:`, e);
              }}
            />
            <p className="text-xs text-center mt-1 text-white">
              Student ID: {id}
            </p>
            <div className="flex justify-center gap-2 mb-1">
              {/* Webcam icon */}
              {mediaStatus[id]?.webcam ? (
                <span title="Webcam On" className="text-green-400 text-lg">📷 {mediaStatus[id]?.webcam ? 'On' : 'Off'}</span>
              ) : (
                <span title="Webcam Off" className="text-gray-400 text-lg">📷 {mediaStatus[id]?.webcam ? 'On' : 'Off'}</span>
              )}
              {/* Mic icon */}
              {mediaStatus[id]?.mic ? (
                <span title="Mic On" className="text-green-400 text-lg">🎤 {mediaStatus[id]?.mic ? 'On' : 'Off'}</span>
              ) : (
                <span title="Mic Off" className="text-gray-400 text-lg">🎤 {mediaStatus[id]?.mic ? 'On' : 'Off'}</span>
              )}
            </div>
            <p className="text-xs text-center text-gray-400">
              Status: {connectionStates.current[id] || 'connecting'}
            </p>
            <button
              className="mt-2 w-full bg-blue-500 text-white rounded px-2 py-1 text-xs hover:bg-blue-600"
              onClick={() => {
                setInboxOpen(prev => ({ ...prev, [id]: true }));
                if (handsUp[id]) {
                  setHandsUp(prev => ({ ...prev, [id]: false }));
                }
              }}
            >
              💬 Message
            </button>
            <div className="flex flex-row gap-2 h-10 "> 
            <button
              className="mt-2 w-full bg-green-500 text-white rounded px-2 py-1 text-xs hover:bg-green-600"
              onClick={() => {
                // If not already, create the Peer for audio (admin is NOT initiator)
                if (!audioPeerMap.current[id]) {
                  const peer = new Peer({
                    initiator: false,
                    trickle: false,
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
                    // Play audio
                    const audio = new window.Audio();
                    audio.srcObject = remoteStream;
                    audio.autoplay = true;
                    audio.play();
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
                // Now send the request to the student
                socket.emit('voice-connect-request', { to: id });
              }}
              disabled={!!activeAudio[id]}
            >
              {activeAudio[id] ? '🔊 Connected' : '🎤 Voice Connect'}
            </button>
            {
              activeAudio[id] && (
                <button
                  className="mt-2 w-full bg-red-500 text-white rounded px-2 py-1 text-xs hover:bg-red-600"
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
                  🔇 Disconnect Voice
                </button>
              )
            }
            </div>
            <MessageInbox
              open={!!inboxOpen[id]}
              onClose={() => setInboxOpen(prev => ({ ...prev, [id]: false }))}
              messages={messages[id] || []}
              canSend={true}
              onSend={msg => {
                console.log(`[Admin] Sending message to ${id}:`, msg);
                socket.emit('private-message', { to: id, from: 'admin', message: msg, participantId: id });
                setMessages(prev => ({
                  ...prev,
                  [id]: [...(prev[id] || []), { from: 'admin', message: msg }]
                }));
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}