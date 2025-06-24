"use client"
import { useEffect, useRef, useState, useCallback } from 'react';
import Peer, { Instance as PeerInstance } from 'simple-peer';
import socket from '@/lib/socket';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import MessageInbox from '@/components/common/MessageInbox';
import { Button } from '@/components/ui/button';

interface StudentExamProps {
    examId: string;
}

interface PeerData {
    id: string;
    peer: PeerInstance;
}

interface MediaDevice {
    deviceId: string;
    label: string;
}

export default function StudentExam({ examId }: StudentExamProps) {
    const [peers, setPeers] = useState<PeerData[]>([]);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoDevices, setVideoDevices] = useState<MediaDevice[]>([]);
    const [audioDevices, setAudioDevices] = useState<MediaDevice[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<string | undefined>(undefined);
    const [selectedAudio, setSelectedAudio] = useState<string | undefined>(undefined);
    const streamRef = useRef<MediaStream | null>(null);
    const peersRef = useRef<{ [id: string]: PeerInstance }>({});
    const [isConnected, setIsConnected] = useState(false);
    const [inboxOpen, setInboxOpen] = useState(false);
    const [messages, setMessages] = useState<{ from: string; message: string }[]>([]);
    const [adminId, setAdminId] = useState<string | null>(null);
    const voicePeerRef = useRef<Peer.Instance | null>(null);
    const [voiceConnected, setVoiceConnected] = useState(false);

    useEffect(() => {
        const getDevices = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoList = devices.filter(d => d.kind === 'videoinput').map(d => ({
                    deviceId: d.deviceId,
                    label: d.label || `Camera ${d.deviceId.slice(0, 8)}`
                }));
                const audioList = devices.filter(d => d.kind === 'audioinput').map(d => ({
                    deviceId: d.deviceId,
                    label: d.label || `Microphone ${d.deviceId.slice(0, 8)}`
                }));

                setVideoDevices(videoList);
                setAudioDevices(audioList);

                if (!selectedVideo && videoList.length > 0) setSelectedVideo(videoList[0].deviceId);
                if (!selectedAudio && audioList.length > 0) setSelectedAudio(audioList[0].deviceId);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                toast.error('Could not enumerate devices: ' + err.message);
            }
        };
        getDevices();
    }, [selectedVideo, selectedAudio]);

    const getStream = useCallback(async (videoId?: string, audioId?: string) => {
        const constraints: MediaStreamConstraints = {
            video: videoId ? { deviceId: { exact: videoId } } : { width: 640, height: 480 },
            audio: audioId ? { deviceId: { exact: audioId } } : true,
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
            toast.success(`Connected to peer ${id}`);
        });

        peer.on('error', (err) => {
            console.error(`[Student] Peer error with ${id}:`, err);
            toast.error(`Peer error with ${id}: ${err.message}`);
            // Clean up failed peer
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

    

    // Initialize stream and socket
    useEffect(() => {
        let mounted = true;
        let hasJoined = false;

        const init = async () => {
            try {
                // Clean up existing stream
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                }

                const stream = await getStream(selectedVideo, selectedAudio);
                if (!mounted) return;

                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                toast.success('Camera and microphone access granted');

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
                        toast.info('New user joined: ' + id);
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
                    toast.info(`User ${id} left the exam`);
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
                    toast.error('Connection error: ' + error.message);
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
                    toast.error('Could not access camera/microphone: ' + err.message);
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
    }, [examId, getStream, createPeer]);

    // Handle device changes separately to avoid re-joining
    useEffect(() => {
        if (!isConnected || !streamRef.current) return;

        const updateStream = async () => {
            try {
                const newStream = await getStream(selectedVideo, selectedAudio);

                // Update video element
                if (videoRef.current) {
                    videoRef.current.srcObject = newStream;
                }

                // Update all peer connections with new stream
                Object.values(peersRef.current).forEach(peer => {
                    if (peer && !peer.destroyed) {
                        try {
                            // Get current tracks from the peer's stream (if any)
                            const currentVideoTrack = peer.streams?.[0]?.getVideoTracks()[0];
                            const currentAudioTrack = peer.streams?.[0]?.getAudioTracks()[0];

                            const newVideoTrack = newStream.getVideoTracks()[0];
                            const newAudioTrack = newStream.getAudioTracks()[0];

                            // Only replace tracks if both old and new tracks exist
                            if (currentVideoTrack && newVideoTrack) {
                                peer.replaceTrack(currentVideoTrack, newVideoTrack, peer.streams[0]);
                            }

                            if (currentAudioTrack && newAudioTrack) {
                                peer.replaceTrack(currentAudioTrack, newAudioTrack, peer.streams[0]);
                            }
                        } catch (err) {
                            console.error('Error replacing tracks:', err);
                        }
                    }
                });

                // Stop old stream
                streamRef.current?.getTracks().forEach(track => track.stop());
                streamRef.current = newStream;

                toast.success('Media devices updated');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                toast.error('Failed to update devices: ' + err.message);
            }
        };

        updateStream();
    }, [selectedVideo, selectedAudio, isConnected, getStream]);

    // Handle device change
    const handleVideoChange = (value: string) => {
        setSelectedVideo(value || undefined);
    };

    const handleAudioChange = (value: string) => {
        setSelectedAudio(value || undefined);
    };

    // Listen for incoming messages
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const handlePrivateMessage = ({ from, message, participantId }: { from: string; message: string; participantId: string }) => {
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
            // Only allow one voice connection at a time
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
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
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
        const handleVoiceSignal = ({ sender, signalData }: { sender: string, signalData: any }) => {
            if (voicePeerRef.current) {
                try {
                    voicePeerRef.current.signal(signalData);
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (err) {
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

    return (
        <div>
            <h2>Student Exam Page</h2>
            <div style={{ marginBottom: 16, display: 'flex', gap: 24 }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 4 }}>Camera:</label>
                    <Select value={selectedVideo || ''} onValueChange={handleVideoChange}>
                        <SelectTrigger className="w-[220px]">
                            <SelectValue placeholder="Select camera" />
                        </SelectTrigger>
                        <SelectContent>
                            {videoDevices.map(device => (
                                <SelectItem key={device.deviceId} value={device.deviceId}>{device.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: 4 }}>Microphone:</label>
                    <Select value={selectedAudio || ''} onValueChange={handleAudioChange}>
                        <SelectTrigger className="w-[220px]">
                            <SelectValue placeholder="Select microphone" />
                        </SelectTrigger>
                        <SelectContent>
                            {audioDevices.map(device => (
                                <SelectItem key={device.deviceId} value={device.deviceId}>{device.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div style={{ marginBottom: 16 }}>
                <p>Connection Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
                <p>Active Peers: {peers.length}</p>
            </div>

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: 400, height: 300, background: '#000', border: '1px solid #ccc' }}
            />
            <Button
                variant="secondary"
                className="mb-2"
                onClick={() => {
                    socket.emit('student-help-request', { from: socket.id, examId });
                    toast.info('Admin will notify you. Please wait for help.');
                }}
            >
                🙋 Need Help
            </Button>
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
            {/* Voice connected indicator */}
            {voiceConnected && (
                <div style={{
                    position: 'fixed',
                    top: 16,
                    right: 16,
                    zIndex: 1000,
                    background: 'rgba(34,197,94,0.95)',
                    color: 'white',
                    borderRadius: 8,
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                    <span style={{ fontSize: 22, marginRight: 8 }}>🎤</span>
                    <span style={{ fontWeight: 600 }}>Voice Connected</span>
                </div>
            )}
        </div>
    );
}