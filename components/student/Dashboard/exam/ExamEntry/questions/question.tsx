"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MCQQuestion } from "./Mcq/mcq";
import { MultiSelectQuestion } from "./MultiSelect/multiSelect";
import { StructuredQuestion } from "./structure/structure";
import Peer, { Instance as PeerInstance } from "simple-peer";
import socket from "@/lib/socket";
import { toast } from "sonner";
import MessageInbox from "@/components/common/MessageInbox";
import { Mic, AlertTriangle, Hand, Wifi, WifiOff } from "lucide-react";
import { decrypt } from "@/lib/encryption";
import Cookies from "js-cookie";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as blazeface from "@tensorflow-models/blazeface";
import {
  saveAnswerOffline,
  getOfflineAnswers,
  clearOfflineAnswers,
  // saveViolationOffline,
  getOfflineViolations,
  clearOfflineViolations,
  // saveMediaOffline,
  getOfflineMedia,
  clearOfflineMedia,
  saveVideoChunkOffline,
  getOfflineVideoChunks,
  clearOfflineVideoChunks,
} from '@/utils/offlineStorage';

// console.log('[Student] question.tsx file loaded');

export type QuestionType = "mcq" | "multiSelect" | "structured";

export interface BaseQuestionData {
  id: string;
  question: string;
  type: QuestionType;
  attachment?: string;
}

export interface MCQQuestionData extends BaseQuestionData {
  type: "mcq";
  options: string[];
  correctAnswer?: number;
}

export interface MultiSelectQuestionData extends BaseQuestionData {
  type: "multiSelect";
  options: string[];
  correctAnswers?: number[];
}

export interface StructuredQuestionData extends BaseQuestionData {
  type: "structured";
  expectedAnswer?: string;
}

export type QuestionData =
  | MCQQuestionData
  | MultiSelectQuestionData
  | StructuredQuestionData;

interface FaceDetection {
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  landmarks?: Array<{ x: number; y: number }>;
  headPose?: {
    pitch: number;
    roll: number;
    yaw: number;
  };
  mouthMovement?: {
    isOpen: boolean;
    openness: number;
    isTalking: boolean;
  };
  confidence: number;
}

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
  examId = "test-exam",
}: QuestionComponentProps) {
  // console.log('[Student] QuestionComponent rendered');
  const [mcqSelected, setMcqSelected] = useState<number | null>(null);
  const [multiSelectSelected, setMultiSelectSelected] = useState<number[]>([]);
  const [structuredAnswer, setStructuredAnswer] = useState<string>("");

  // WebRTC and proctoring
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [peers, setPeers] = useState<PeerData[]>([]);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [messages, setMessages] = useState<
    {
      from: string;
      message: string;
      studentName?: string;
      studentId?: string;
    }[]
  >([]);
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
  const [studentName, setStudentName] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
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
  const lastViolationRef = useRef<{ [key: string]: number }>({});
  const isProcessingViolationRef = useRef(false);
  const VIOLATION_DEBOUNCE_MS = 5000; // 5 seconds for same violation type
  const VIOLATION_DISPLAY_COOLDOWN_MS = 0.5 * 60 * 1000; // 30 seconds for display filtering
  const hasJoinedRef = useRef(false); // Track if already joined exam

  // Face detection state variables
  const [faceData, setFaceData] = useState<FaceDetection[] | null>(null);
  const [faceDetectionError, setFaceDetectionError] = useState<string | null>(
    null
  );
  const [modelLoaded, setModelLoaded] = useState(false);
  const [model, setModel] = useState<blazeface.BlazeFaceModel | null>(null);
  const [faceDetectionActive, setFaceDetectionActive] = useState(false);

  // Audio-based talking detection
  const [talkingDetected, setTalkingDetected] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [audioLevels, setAudioLevels] = useState<number[]>([]);
  const audioDetectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- MediaRecorder for camera and screen recording ---
  const cameraRecorderRef = useRef<MediaRecorder | null>(null);
  const screenRecorderRef = useRef<MediaRecorder | null>(null);
  const cameraChunksRef = useRef<Blob[]>([]);
  const screenChunksRef = useRef<Blob[]>([]);

  // Start camera recording
  const startCameraRecording = useCallback((stream: MediaStream) => {
    if (cameraRecorderRef.current) {
      cameraRecorderRef.current.stop();
      cameraRecorderRef.current = null;
    }
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    cameraRecorderRef.current = recorder;
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        cameraChunksRef.current.push(e.data);
        if (!navigator.onLine) {
          saveVideoChunkOffline({ type: 'camera', blob: e.data, meta: { examId, studentId, timestamp: Date.now() } });
        }
      }
    };
    recorder.start(30000); // 30s chunks
  }, [examId, studentId]);

  // Start screen recording
  const startScreenRecording = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      if (screenRecorderRef.current) {
        screenRecorderRef.current.stop();
        screenRecorderRef.current = null;
      }
      const recorder = new MediaRecorder(screenStream, { mimeType: 'video/webm' });
      screenRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          screenChunksRef.current.push(e.data);
          if (!navigator.onLine) {
            saveVideoChunkOffline({ type: 'screen', blob: e.data, meta: { examId, studentId, timestamp: Date.now() } });
          }
        }
      };
      recorder.start(30000); // 30s chunks
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // User may deny screen sharing
    }
  }, [examId, studentId]);

  // Stop all recordings
  const stopAllRecordings = () => {
    if (cameraRecorderRef.current) {
      cameraRecorderRef.current.stop();
      cameraRecorderRef.current = null;
    }
    if (screenRecorderRef.current) {
      screenRecorderRef.current.stop();
      screenRecorderRef.current = null;
    }
  };

  // Start camera recording when localStream is available
  useEffect(() => {
    if (localStream) {
      startCameraRecording(localStream);
    }
    return () => {
      stopAllRecordings();
    };
  }, [localStream, startCameraRecording]);

  // Optionally, start screen recording on exam start (or on user action)
  useEffect(() => { startScreenRecording(); }, []);

  // --- Sync offline video chunks on reconnect ---
  useEffect(() => {
    const syncVideoChunks = async () => {
      const chunks = await getOfflineVideoChunks();
      if (chunks.length > 0) {
        for (const chunk of chunks) {
          try {
            const formData = new FormData();

            // Add the video file - must be MP4, WebM, or OGG format
            formData.append('file', chunk.blob, `${chunk.type}_${chunk.meta?.timestamp || Date.now()}.webm`);

            // Add any required metadata from CreateExamResourceDto
            formData.append('examId', chunk.examId); // You'll need to track this
            formData.append('resourceType', 'VIDEO');
            formData.append('description', 'Recorded exam session video');

            const response = await fetch('/api/exams/upload-resource', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${Cookies.get('jwt')}`
              },
              body: formData
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.message || 'Failed to upload video');
            }

          } catch (error) {
            console.error('Failed to upload video chunk:', error);
            // You might want to implement retry logic or store failed uploads
          }
        }
        await clearOfflineVideoChunks();
      }
    };

    window.addEventListener('online', syncVideoChunks);
    return () => window.removeEventListener('online', syncVideoChunks);
  }, []);
  // Get stream with specific devices
  const getStream = useCallback(async () => {
    const constraints: MediaStreamConstraints = {
      video: { width: 640, height: 480 },
      audio: true,
    };
    return navigator.mediaDevices.getUserMedia(constraints);
  }, []);

  const createPeer = useCallback(
    (id: string, isInitiator: boolean, stream: MediaStream) => {
      if (peersRef.current[id]) {
        peersRef.current[id].destroy();
      }

      const peer = new Peer({
        initiator: isInitiator,
        trickle: false,
        stream,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:global.stun.twilio.com:3478" },
          ],
        },
      });

      peer.on("signal", (signal) => {
        // console.log(`[Student] Sending signal to ${id}`, signal.type);
        socket.emit("signal", { target: id, signalData: signal });
      });

      peer.on("connect", () => {
        // console.log(`[Student] Connected to peer ${id}`);
        // toast.success(`Connected to proctor ${id}`);
      });

      peer.on("error", (err) => {
        console.error(`[Student] Peer error with ${id}:`, err);
        // Only show error toast for non-state errors
        if (
          !err.message.includes("stable") &&
          !err.message.includes("InvalidStateError")
        ) {
          // toast.error(`Something went wrong! Contact Admin`);
        }
        delete peersRef.current[id];
        setPeers((prev) => prev.filter((p) => p.id !== id));
      });

      peer.on("close", () => {
        // console.log(`[Student] Peer connection closed with ${id}`);
        delete peersRef.current[id];
        setPeers((prev) => prev.filter((p) => p.id !== id));
      });

      peersRef.current[id] = peer;
      setPeers((prev) => {
        const exists = prev.find((p) => p.id === id);
        if (exists) {
          return prev.map((p) => (p.id === id ? { id, peer } : p));
        }
        return [...prev, { id, peer }];
      });

      return peer;
    },
    []
  );

  // Initialize TensorFlow.js and load BlazeFace model
  useEffect(() => {
    const initializeTensorFlow = async () => {
      try {
        // Initialize TensorFlow.js backend
        await tf.ready();
        console.log("TensorFlow.js initialized for exam proctoring");

        // Load BlazeFace model
        const blazeFaceModel = await blazeface.load();
        setModel(blazeFaceModel);
        setModelLoaded(true);
        setFaceDetectionActive(true);

        console.log("BlazeFace model loaded for exam proctoring");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setFaceDetectionError(
          `Failed to load face detection model: ${errorMessage}`
        );
        console.error("Face detection initialization failed:", err);
      }
    };

    initializeTensorFlow();
  }, []);

  // Calculate head pose from facial landmarks
  const calculateHeadPose = useCallback(
    (landmarks: Array<{ x: number; y: number }>) => {
      if (!landmarks || landmarks.length < 6) {
        return { pitch: 0, yaw: 0, roll: 0 };
      }

      // BlazeFace provides 6 key landmarks:
      // 0: right eye, 1: left eye, 2: nose tip, 3: mouth center, 4: right ear, 5: left ear
      const rightEye = landmarks[0];
      const leftEye = landmarks[1];
      const noseTip = landmarks[2];
      const mouth = landmarks[3];

      // Calculate face center
      const faceCenter = {
        x: (rightEye.x + leftEye.x) / 2,
        y: (rightEye.y + leftEye.y) / 2,
      };

      // Calculate yaw (left/right rotation) - improved calculation
      const eyeDistance = Math.abs(rightEye.x - leftEye.x);
      const faceWidth = eyeDistance * 3; // Approximate face width
      const noseCenterOffset = noseTip.x - faceCenter.x;

      // Yaw calculation based on nose position relative to eye center
      let yaw = (noseCenterOffset / (faceWidth * 0.15)) * 15; // More conservative yaw calculation
      yaw = Math.max(-45, Math.min(45, yaw));

      // Calculate pitch (up/down rotation) - improved calculation
      const eyeNoseDistance = noseTip.y - faceCenter.y;
      const eyeMouthDistance = mouth.y - faceCenter.y;

      // Normal ratio when looking straight
      const normalRatio = 0.4; // Expected ratio of eye-nose to eye-mouth distance
      const actualRatio = eyeNoseDistance / eyeMouthDistance;

      let pitch = (actualRatio - normalRatio) * 75; // Convert ratio difference to degrees
      pitch = Math.max(-30, Math.min(30, pitch));

      // Calculate roll (tilt) - keep existing calculation but make it more stable
      const eyeSlope = (leftEye.y - rightEye.y) / (leftEye.x - rightEye.x);
      let roll = Math.atan(eyeSlope) * (180 / Math.PI);
      roll = Math.max(-25, Math.min(25, roll));

      return { pitch, yaw, roll };
    },
    []
  );

  // Calculate mouth movement from facial landmarks (removed for audio-based detection)
  // const calculateMouthMovement = useCallback((landmarks: Array<{ x: number; y: number }>, previousHistory: number[]) => {
  //   // Audio-based talking detection will replace this
  //   return { isOpen: false, openness: 0, isTalking: false };
  // }, []);

  // Initialize audio analysis for talking detection
  const initializeAudioAnalysis = useCallback(async (stream: MediaStream) => {
    try {
      // Create audio context
      const audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create analyser node
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Connect microphone to analyser
      const microphone = audioContext.createMediaStreamSource(stream);
      microphoneRef.current = microphone;
      microphone.connect(analyser);

      console.log("Audio analysis initialized for talking detection");
      return true;
    } catch (error) {
      console.error("Failed to initialize audio analysis:", error);
      setFaceDetectionError(
        "Failed to initialize audio analysis for talking detection"
      );
      return false;
    }
  }, []);

  // Analyze audio levels to detect talking
  const analyzeAudioForTalking = useCallback(() => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    analyser.getByteFrequencyData(dataArray);

    // Calculate average volume
    const average =
      dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;

    // Update audio levels history (keep last 20 measurements for 2 seconds at 100ms intervals)
    setAudioLevels((prev) => {
      const newLevels = [...prev, average].slice(-20);

      // Detect talking based on audio patterns
      if (newLevels.length >= 10) {
        // Calculate variance in audio levels
        const avg =
          newLevels.reduce((sum, val) => sum + val, 0) / newLevels.length;
        const variance =
          newLevels.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) /
          newLevels.length;

        // Check for consistent audio above threshold
        const highLevels = newLevels.filter((level) => level > 30).length; // Threshold for sound detection
        const recentHighLevels = newLevels
          .slice(-5)
          .filter((level) => level > 30).length; // Recent activity

        // Talking detected if:
        // 1. Sufficient variance in audio levels (indicating speech patterns)
        // 2. Consistent audio above threshold
        // 3. Recent audio activity
        const isTalking =
          variance > 200 &&
          highLevels >= 5 &&
          recentHighLevels >= 2 &&
          avg > 25;

        setTalkingDetected(isTalking);
      }

      return newLevels;
    });
  }, []);

  // Start audio monitoring
  const startAudioMonitoring = useCallback(() => {
    if (audioDetectionIntervalRef.current) {
      clearInterval(audioDetectionIntervalRef.current);
    }

    // Analyze audio every 100ms for responsive detection
    audioDetectionIntervalRef.current = setInterval(
      analyzeAudioForTalking,
      100
    );
  }, [analyzeAudioForTalking]);

  // Stop audio monitoring
  const stopAudioMonitoring = useCallback(() => {
    if (audioDetectionIntervalRef.current) {
      clearInterval(audioDetectionIntervalRef.current);
      audioDetectionIntervalRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setTalkingDetected(false);
    setAudioLevels([]);
  }, []);

  // TensorFlow.js face detection
  const detectFacesWithTensorFlow = useCallback(
    async (video: HTMLVideoElement): Promise<FaceDetection[]> => {
      if (!model || !modelLoaded) {
        throw new Error("Face detection model not loaded yet");
      }

      try {
        // Get predictions from BlazeFace model
        const predictions = await model.estimateFaces(video, false);

        const faces: FaceDetection[] = predictions.map((prediction) => {
          // Extract bounding box
          const topLeft = prediction.topLeft as number[];
          const bottomRight = prediction.bottomRight as number[];
          const x = topLeft[0];
          const y = topLeft[1];
          const width = bottomRight[0] - x;
          const height = bottomRight[1] - y;

          // Extract landmarks if available
          const landmarks = prediction.landmarks
            ? Array.isArray(prediction.landmarks)
              ? prediction.landmarks.map((landmark: number[]) => ({
                x: landmark[0],
                y: landmark[1],
              }))
              : [] // Handle Tensor2D case
            : [];

          // Calculate head pose from landmarks
          const headPose =
            landmarks.length > 0 ? calculateHeadPose(landmarks) : undefined;

          // Note: Mouth movement detection replaced with audio-based talking detection

          // Handle probability
          let confidence = 0.9;
          if (prediction.probability) {
            if (typeof prediction.probability === "number") {
              confidence = prediction.probability;
            } else if (Array.isArray(prediction.probability)) {
              confidence = prediction.probability[0] || 0.9;
            }
          }

          return {
            boundingBox: { x, y, width, height },
            landmarks,
            headPose,
            mouthMovement: undefined, // Removed in favor of audio detection
            confidence,
          };
        });

        return faces;
      } catch (err) {
        console.error("TensorFlow face detection error:", err);
        throw err;
      }
    },
    [model, modelLoaded, calculateHeadPose]
  );

  // Helper function to determine if looking away from screen
  const isLookingAwayFromScreen = useCallback(
    (headPose?: { pitch: number; yaw: number }) => {
      if (!headPose) return false;
      const { pitch, yaw } = headPose;

      // More lenient thresholds - only flag as looking away if significantly turned
      // Increased thresholds to reduce false positives
      return Math.abs(pitch) > 20 || Math.abs(yaw) > 25;
    },
    []
  );

  // Face detection analysis function
  const analyzeFaceDetection = useCallback(async () => {
    if (!videoRef.current || !modelLoaded || !model || !faceDetectionActive)
      return;

    try {
      const video = videoRef.current;
      const faces = await detectFacesWithTensorFlow(video);
      setFaceData(faces);

      // Check for suspicious activity
      if (faces.length === 0) {
        // We'll handle this after handleSecurityViolation is defined
        console.warn("No face detected during exam");
      } else {
        const isLookingAway = faces.some(
          (face) => face.headPose && isLookingAwayFromScreen(face.headPose)
        );

        // Note: Talking detection now handled by audio analysis
        // const isTalkingDetected = faces.some(face =>
        //   face.mouthMovement && face.mouthMovement.isTalking
        // );

        if (isLookingAway) {
          console.warn("Looking away from screen detected");
        }

        // Talking detection is now handled by audio analysis in separate useEffect
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setFaceDetectionError("Face detection failed: " + errorMessage);
    }
  }, [
    modelLoaded,
    model,
    faceDetectionActive,
    detectFacesWithTensorFlow,
    isLookingAwayFromScreen,
  ]);

  // Face detection analysis interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (faceDetectionActive && modelLoaded && localStream) {
      // Analyze frame every 2 seconds for exam proctoring
      interval = setInterval(() => {
        analyzeFaceDetection();
      }, 2000);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faceDetectionActive, modelLoaded, localStream]);

  // Initialize WebRTC and socket connection
  useEffect(() => {
    let mounted = true;

    // Prevent multiple initialization
    if (localStream) {
      console.log("Stream already initialized, skipping...");
      return;
    }

    const init = async () => {
      try {
        console.log("Initializing WebRTC and socket connection...");

        // Clean up existing stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        const stream = await getStream();
        if (!mounted) return;

        streamRef.current = stream;
        setLocalStream(stream);

        // Initialize audio analysis for talking detection
        const audioInitialized = await initializeAudioAnalysis(stream);
        if (audioInitialized) {
          startAudioMonitoring();
          console.log("Audio-based talking detection started");
        }

        // Emit webcam/mic access status to admin
        socket.emit("media-status", {
          examId,
          webcam: stream.getVideoTracks().length > 0,
          mic: stream.getAudioTracks().length > 0,
        });

        // Clean up existing peers
        Object.values(peersRef.current).forEach((peer) => peer.destroy());
        peersRef.current = {};
        setPeers([]);

        // Join exam only once
        if (!hasJoinedRef.current) {
          hasJoinedRef.current = true;
          const userData = Cookies.get("userDetails");
          if (userData) {
            const decryptedData = decrypt(userData);
            const parsedData = JSON.parse(decryptedData);
            console.log(
              "Joining exam with studentId:",
              parsedData.studentDetails.studentId
            );
            socket.emit("join-exam", {
              examId,
              role: "student",
              studentId: parsedData.studentDetails.studentId,
              studentName: parsedData.name,
            });
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
            setPeers((prev) => prev.filter((p) => p.id !== id));
          }
          // toast.info(`Proctor ${id} left the exam`);
        };

        const handleSignal = ({
          sender,
          signalData,
        }: {
          sender: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          signalData: any;
        }) => {
          if (!mounted) return;
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
          console.error("[Student] Socket error:", error);
          // const err = error as Error;
          // toast.error("Something went wrong! Contact Admin");
        };

        // Add event listeners
        socket.on("existing-users", handleExistingUsers);
        socket.on("user-joined", handleUserJoined);
        socket.on("signal", handleSignal);
        socket.on("user-left", handleUserLeft);
        socket.on("error", handleError);

        // Cleanup function
        return () => {
          socket.off("existing-users", handleExistingUsers);
          socket.off("user-joined", handleUserJoined);
          socket.off("signal", handleSignal);
          socket.off("user-left", handleUserLeft);
          socket.off("error", handleError);
        };
      } catch (err: unknown) {
        if (mounted) {
          const error = err as Error;
          // toast.error("Something went wrong! Contact Admin");
          console.error("Media error", error);
        }
      }
    };

    init();

    return () => {
      mounted = false;
      // Clean up socket listeners
      socket.off("existing-users");
      socket.off("user-joined");
      socket.off("signal");
      socket.off("user-left");
      socket.off("error");

      // Clean up peers
      Object.values(peersRef.current).forEach((peer) => peer.destroy());
      peersRef.current = {};
      setPeers([]);

      // Clean up stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      // Stop audio monitoring
      stopAudioMonitoring();

      // Leave exam room
      if (hasJoinedRef.current) {
        socket.emit("leave-exam", { examId });
        hasJoinedRef.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId, getStream, createPeer]); // Only include examId and localStream to control when this runs

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
      toast.warning(
        "No activity detected. Please ensure you are actively taking the exam."
      );
    }, 30000); // 30 seconds of inactivity
  }, []);

  // Capture webcam screenshot
  const captureWebcamScreenshot = useCallback(async (): Promise<
    string | null
  > => {
    try {
      if (!videoRef.current) return null;

      const canvas = document.createElement("canvas");
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.drawImage(video, 0, 0);
      return canvas.toDataURL("image/jpeg", 0.8);
    } catch (error) {
      console.error("Failed to capture webcam screenshot:", error);
      return null;
    }
  }, []);

  // Capture screen screenshot
  const captureScreenScreenshot = useCallback(async (): Promise<
    string | null
  > => {
    try {
      // For screen capture, we'll use html2canvas or similar approach
      // Since we can't access full screen due to security, we'll capture the exam container
      const container = mainContainerRef.current;
      if (!container) return null;

      // Dynamic import to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(container, {
        useCORS: true,
        allowTaint: true,
        scale: 0.5, // Reduce size for performance
      });

      return canvas.toDataURL("image/jpeg", 0.8);
    } catch (error) {
      console.error("Failed to capture screen screenshot:", error);
      return null;
    }
  }, []);

  // Add this effect at the top level of the component (after useState declarations)
  useEffect(() => {
    const syncOfflineData = async () => {
      // Sync answers
      const answers = await getOfflineAnswers();
      if (answers.length > 0) {
        for (const ans of answers) {
          // You may want to batch this, but for now, send individually
          // Replace with your actual answer submission logic
          try {
            // You may need to adjust the payload to match your backend
            socket.emit('submit-offline-answer', ans);
            //eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) { /* handle error */ }
        }
        await clearOfflineAnswers();
      }
      // Sync violations
      const violations = await getOfflineViolations();
      if (violations.length > 0) {
        for (const v of violations) {
          try {
            socket.emit('session-security-violation', v);
            //eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) { /* handle error */ }
        }
        await clearOfflineViolations();
      }
      // Sync media
      const media = await getOfflineMedia();
      if (media.length > 0) {
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const m of media) {
          // You may want to POST to a REST endpoint for file uploads
          // For now, emit via socket (or implement upload logic)
          // socket.emit('upload-media', m);
        }
        await clearOfflineMedia();
      }
    };
    window.addEventListener('online', syncOfflineData);
    return () => window.removeEventListener('online', syncOfflineData);
  }, []);

  // --- Answer change handlers ---
  // MCQ selection handler
  const handleMcqSelect = (index: number) => {
    setMcqSelected(index);
    if (onAnswerChange) onAnswerChange(index);
    // Save answer offline if offline
    if (!navigator.onLine) {
      saveAnswerOffline({
        examId,
        questionId: questions[currentQuestionIndex]?.id,
        answer: index,
        type: 'mcq',
        timestamp: Date.now(),
      });
    }
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

    setMultiSelectSelected((prev) => {
      const updated = newSelected(prev);
      if (onAnswerChange) onAnswerChange(updated);
      if (!navigator.onLine) {
        saveAnswerOffline({
          examId,
          questionId: questions[currentQuestionIndex]?.id,
          answer: updated,
          type: 'multiSelect',
          timestamp: Date.now(),
        });
      }
      return updated;
    });
    updateActivity();
  };
  // Structured question answer handler
  const handleStructuredAnswerChange = (value: string) => {
    setStructuredAnswer(value);
    if (onAnswerChange) onAnswerChange(value);
    if (!navigator.onLine) {
      saveAnswerOffline({
        examId,
        questionId: questions[currentQuestionIndex]?.id,
        answer: value,
        type: 'structured',
        timestamp: Date.now(),
      });
    }
    updateActivity();
  };

  // --- Violation handler ---
  const handleSecurityViolation = useCallback(
    async (violationType: string) => {
      const now = Date.now();

      console.log(`[Student] handleSecurityViolation called with: ${violationType} at ${now}`);

      // Global processing check to prevent concurrent execution
      if (isProcessingViolationRef.current) {
        console.log(`[Student] Another violation is being processed - skipping ${violationType}`);
        return;
      }

      // Check if same violation type occurred recently (debounce)
      if (
        lastViolationRef.current[violationType] &&
        now - lastViolationRef.current[violationType] < VIOLATION_DEBOUNCE_MS
      ) {
        console.log(`[Student] Violation ${violationType} debounced - ignoring`);
        return;
      }

      try {
        // Set processing flag
        isProcessingViolationRef.current = true;

        // Update last violation time for this type
        lastViolationRef.current[violationType] = now;

        console.log(`[Student] Security violation detected: ${violationType}`);

        // Capture screenshots
        const webcamScreenshot = await captureWebcamScreenshot();
        const screenScreenshot = await captureScreenScreenshot();

        // Check if we should show this violation (30-minute cooldown for display)
        const lastDisplayTime =
          lastViolationRef.current[`${violationType}_display`] || 0;
        const shouldShowViolation =
          now - lastDisplayTime > VIOLATION_DISPLAY_COOLDOWN_MS;

        setSecurityViolationCount((prev) => {
          const newCount = prev + 1;
          const isFaceViolation = violationType.includes("face");
          const maxViolations = isFaceViolation
            ? MAX_VIOLATIONS * 2
            : MAX_VIOLATIONS;

          // Only show toast if within display cooldown
          if (shouldShowViolation) {
            if (isFaceViolation) {
              toast.error(
                `Please ensure your face is visible on camera. and not looking away from the screen.`
              );
            }
            // toast.error(`Security violation: ${violationType}. Violations: ${newCount}/${maxViolations}`);
            lastViolationRef.current[`${violationType}_display`] = now;
          }

          console.log(`[Student] Emitting security violation to admin:`, {
            examId,
            studentId,
            violationType,
            count: newCount,
            socketId: socket.id,
            webcamScreenshot: webcamScreenshot ? "captured" : "failed",
            screenScreenshot: screenScreenshot ? "captured" : "failed",
          });

          // Always send to backend regardless of display cooldown
          socket.emit("session-security-violation", {
            examId,
            studentId,
            violationType,
            count: newCount,
            socketId: socket.id,
            timestamp: now,
            webcamScreenshot,
            screenScreenshot,
            studentName,
          });

          if (newCount >= maxViolations) {
            toast.error(
              "Too many security violations. Exam will be auto-submitted."
            );
            setTimeout(() => {
              examActiveRef.current = false;
              onComplete();
            }, 2000);
          }
          return newCount;
        });

      } catch (error) {
        console.error(`[Student] Error in handleSecurityViolation:`, error);
      } finally {
        // Clear processing flag
        isProcessingViolationRef.current = false;
      }
    },
    [
      examId,
      studentId,
      studentName,
      onComplete,
      captureWebcamScreenshot,
      captureScreenScreenshot,
      VIOLATION_DISPLAY_COOLDOWN_MS,
      VIOLATION_DEBOUNCE_MS,
      MAX_VIOLATIONS,
    ]
  );

  // Monitor face detection for security violations
  useEffect(() => {
    if (!faceData || !faceDetectionActive) return;

    // Check for no face detected
    if (faceData.length === 0) {
      handleSecurityViolation("No face detected");
      return;
    }

    // Check for multiple faces detected
    if (faceData.length >= 2) {
      handleSecurityViolation(
        `Multiple faces detected (${faceData.length} faces)`
      );
      return;
    }

    // Check for looking away from screen
    const isLookingAway = faceData.some(
      (face) => face.headPose && isLookingAwayFromScreen(face.headPose)
    );

    // Check for talking/mouth movement
    // const isTalkingDetected = faceData.some(face =>
    //   face.mouthMovement && face.mouthMovement.isTalking
    // );

    if (isLookingAway) {
      handleSecurityViolation("Looking away from screen");
    }

    // Note: Talking detection now handled separately via audio analysis
    // if (isTalkingDetected) {
    //   handleSecurityViolation('Talking/mouth movement detected');
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    faceData,
    faceDetectionActive,
    isLookingAwayFromScreen,
  ]);

  // Monitor audio-based talking detection for security violations
  useEffect(() => {
    if (talkingDetected && faceDetectionActive) {
      handleSecurityViolation("Talking detected via microphone");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [talkingDetected, faceDetectionActive]);

  // Reset answers when question changes
  useEffect(() => {
    setMcqSelected(null);
    setMultiSelectSelected([]);
    setStructuredAnswer("");
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
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
        "Escape",
        "PrintScreen",
        "Insert",
        "Delete",
        "Home",
        "End",
        "PageUp",
        "PageDown",
      ];

      // Block key combinations
      const isBlockedCombination =
        (e.ctrlKey &&
          ["t", "n", "w", "r", "shift+i", "shift+j", "u", "shift+c"].includes(
            e.key.toLowerCase()
          )) ||
        (e.altKey && ["Tab", "F4"].includes(e.key)) ||
        (e.ctrlKey &&
          e.shiftKey &&
          ["i", "j", "c", "n"].includes(e.key.toLowerCase())) ||
        (e.metaKey && ["t", "n", "w", "r"].includes(e.key.toLowerCase())); // Mac cmd key

      if (blockedKeys.includes(e.key) || isBlockedCombination) {
        e.preventDefault();
        e.stopPropagation();
        handleSecurityViolation(
          `Blocked key: ${e.key}${e.ctrlKey ? "+Ctrl" : ""}${e.altKey ? "+Alt" : ""
          }${e.shiftKey ? "+Shift" : ""}`
        );

        // Force fullscreen if F11 was pressed
        if (e.key === "F11") {
          setTimeout(() => requestFullscreen(mainContainerRef.current), 100);
        }

        return false;
      }

      // Special handling for Escape key - force fullscreen
      if (e.key === "Escape") {
        setTimeout(() => requestFullscreen(mainContainerRef.current), 100);
      }
    };

    // Enhanced right-click prevention
    const handleContextMenu = (e: MouseEvent) => {
      if (!examActiveRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      handleSecurityViolation("Right-click attempt");
      return false;
    };

    // Block text selection and drag
    const handleSelectStart = (e: Event) => {
      // Allow selection only in input fields and textareas
      const target = e.target as HTMLElement;
      if (!target.matches("input, textarea, [contenteditable]")) {
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
        setFullscreenExitCount((prev) => {
          const newCount = prev + 1;
          handleSecurityViolation("Fullscreen exit");

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
                fullscreenRequestTimeoutRef.current = setTimeout(
                  retryFullscreen,
                  1000
                );
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
      if (document.visibilityState !== "visible" && examActiveRef.current) {
        setShowTabWarning(true);
        handleSecurityViolation("Tab switch/minimize");
      } else {
        setShowTabWarning(false);
      }
    };

    // Window focus/blur handlers
    const handleBlur = () => {
      if (examActiveRef.current) {
        setShowTabWarning(true);
        handleSecurityViolation("Window lost focus");
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
        const message =
          "Are you sure you want to leave? Your exam progress will be lost.";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    // Block developer tools attempts
    const handleResize = () => {
      // Detect if window was resized significantly (might indicate dev tools opening)
      const threshold = 100;
      if (
        Math.abs(window.innerHeight - window.screen.height) > threshold &&
        examActiveRef.current
      ) {
        handleSecurityViolation("Potential developer tools detected");
      }
    };

    // Detect copy/paste attempts
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (!target.matches("input, textarea, [contenteditable]")) {
        e.preventDefault();
        handleSecurityViolation("Copy attempt");
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (!target.matches("input, textarea, [contenteditable]")) {
        e.preventDefault();
        handleSecurityViolation("Paste attempt");
      }
    };

    // Add all event listeners
    document.addEventListener("keydown", handleKeyDown, { capture: true });
    document.addEventListener("contextmenu", handleContextMenu, {
      capture: true,
    });
    document.addEventListener("selectstart", handleSelectStart, {
      capture: true,
    });
    document.addEventListener("dragstart", handleDragStart, { capture: true });
    document.addEventListener("copy", handleCopy, { capture: true });
    document.addEventListener("paste", handlePaste, { capture: true });

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("resize", handleResize);

    // Block common shortcuts via keyup as well
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!examActiveRef.current) return;

      // Additional blocking on keyup for persistent keys
      if (["F11", "F12", "Escape"].includes(e.key)) {
        e.preventDefault();
        setTimeout(() => requestFullscreen(mainContainerRef.current), 50);
      }
    };

    document.addEventListener("keyup", handleKeyUp, { capture: true });

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
      handleSecurityViolation("File drop attempt");
      return false;
    };

    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDrop);

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
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.removeEventListener("keyup", handleKeyUp, { capture: true });
      document.removeEventListener("contextmenu", handleContextMenu, {
        capture: true,
      });
      document.removeEventListener("selectstart", handleSelectStart, {
        capture: true,
      });
      document.removeEventListener("dragstart", handleDragStart, {
        capture: true,
      });
      document.removeEventListener("copy", handleCopy, { capture: true });
      document.removeEventListener("paste", handlePaste, { capture: true });
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDrop);

      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );

      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("resize", handleResize);

      setShowFullscreenWarning(false);
      setShowTabWarning(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onComplete]);

  // Initialize WebRTC on component mount
  useEffect(() => {
    // Set up activity listeners
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => {
      document.addEventListener(event, updateActivity);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateActivity);
      });

      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }

      // Cleanup audio monitoring
      stopAudioMonitoring();
    };
  }, [updateActivity, stopAudioMonitoring]);

  // Listen for incoming messages
  useEffect(() => {
    const handlePrivateMessage = ({
      from,
      message,
      studentName,
      studentId,
    }: {
      from: string;
      message: string;
      studentName?: string;
      studentId?: string;
    }) => {
      setMessages((prev) => [
        ...prev,
        { from, message, studentName, studentId },
      ]);
      setInboxOpen(true);
      updateActivity();
    };
    socket.on("private-message", handlePrivateMessage);
    return () => {
      socket.off("private-message", handlePrivateMessage);
    };
  }, [updateActivity]);

  useEffect(() => {
    const handleAdminInfo = ({ adminId }: { adminId: string }) => {
      // console.log('[Student] Admin ID:', adminId);
      setAdminId(adminId);
    };
    socket.on("admin-info", handleAdminInfo);
    return () => {
      socket.off("admin-info", handleAdminInfo);
    };
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
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        // console.log('[Student] Got local audio stream:', stream, stream.getAudioTracks());
        // console.log('[Student] Creating Peer for voice, initiator: true, with stream:', stream);
        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream,
          config: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:global.stun.twilio.com:3478" },
            ],
          },
        });
        voicePeerRef.current = peer;
        setVoiceConnected(true);
        peer.on("signal", (signal) => {
          // console.log('[Student] Sending voice-signal to', from, signal);
          socket.emit("voice-signal", { target: from, signalData: signal });
        });
        peer.on("stream", (remoteStream) => {
          // console.log('[Student] Received remote audio stream:', remoteStream);
          // console.log('[Student] Audio tracks:', remoteStream.getAudioTracks());
          const audio = new window.Audio();
          audio.srcObject = remoteStream;
          audio.autoplay = true;
          audio
            .play()
            .then(() => {
              // console.log('[Student] Audio playback started');
            })
            .catch((e) => {
              console.error("[Student] Audio playback failed:", e);
            });
        });
        peer.on("connect", () => {
          // console.log('[Student] Peer connection established for voice!');
          setVoiceConnected(true);
          toast.success("Voice connection established");
        });
        peer.on("close", () => {
          setVoiceConnected(false);
          voicePeerRef.current = null;
        });
        peer.on("error", (err) => {
          console.error("[Student] Peer connection error:", err);
          setVoiceConnected(false);
          voicePeerRef.current = null;
        });
      } catch {
        setVoiceConnected(false);
        voicePeerRef.current = null;
      }
    };
    socket.on("voice-connect-request", handleVoiceConnectRequest);
    return () => {
      socket.off("voice-connect-request", handleVoiceConnectRequest);
    };
  }, []);

  // Handle incoming voice-signal from admin
  useEffect(() => {
    const handleVoiceSignal = ({
      signalData,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
      sender,
    }: {
      sender: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      signalData: any;
    }) => {
      // console.log('[Student] Received voice-signal from', sender, signalData);
      if (voicePeerRef.current) {
        try {
          voicePeerRef.current.signal(signalData);
        } catch {
          // ignore
        }
      }
    };
    socket.on("voice-signal", handleVoiceSignal);
    return () => {
      socket.off("voice-signal", handleVoiceSignal);
    };
  }, []);

  useEffect(() => {
    const handleRequestMediaStatus = () => {
      if (streamRef.current) {
        socket.emit("media-status", {
          examId,
          webcam: streamRef.current.getVideoTracks().length > 0,
          mic: streamRef.current.getAudioTracks().length > 0,
        });
      }
    };
    socket.on("request-media-status", handleRequestMediaStatus);
    return () => {
      socket.off("request-media-status", handleRequestMediaStatus);
    };
  }, [examId]);

  useEffect(() => {
    const handleVoiceDisconnect = () => {
      if (voicePeerRef.current) {
        voicePeerRef.current.destroy();
        voicePeerRef.current = null;
      }
      setVoiceConnected(false);
    };
    socket.on("voice-disconnect", handleVoiceDisconnect);
    return () => {
      socket.off("voice-disconnect", handleVoiceDisconnect);
    };
  }, []);

  // Add online/offline state
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

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
      case "mcq":
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

      case "multiSelect":
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

      case "structured":
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

  return (
    <div ref={mainContainerRef} className="relative">
      {/* Online/Offline Indicator */}
      <div className="fixed top-4 right-4 z-[9999] flex items-center gap-2">
        {isOnline ? (
          <div className="flex items-center gap-1 bg-green-100 border border-green-400 text-green-700 px-3 py-1 rounded-full shadow">
            <Wifi className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">Online</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 bg-red-100 border border-red-400 text-red-700 px-3 py-1 rounded-full shadow">
            <WifiOff className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium">Offline</span>
          </div>
        )}
      </div>
      {/* Fullscreen Warning */}
      {showFullscreenWarning && !finalFullscreenLockout && (
        <div className="fixed top-0 left-0 w-full z-[9999] bg-yellow-500 text-white px-4 py-3 text-center text-lg font-bold shadow-lg">
          Please do not exit fullscreen mode during the exam.
          <br />
          {`You have ${MAX_FULLSCREEN_EXITS - fullscreenExitCount
            } attempt(s) remaining before the exam is auto-submitted.`}
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

      {/* Face Detection Warnings */}
      {faceDetectionError && (
        <div className="fixed top-20 left-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg shadow-lg">
          Face Detection Error: {faceDetectionError}
        </div>
      )}

      {talkingDetected && (
        <div className="fixed top-20 right-4 z-50 bg-orange-100 border border-orange-400 text-orange-700 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4" />
          <span>🎤 Audio/Talking Detected</span>
        </div>
      )}

      {faceData && faceData.length === 0 && faceDetectionActive && (
        <div className="fixed top-32 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4" />
          <span>👤 No Face Detected</span>
        </div>
      )}

      {faceData && faceData.length >= 2 && faceDetectionActive && (
        <div className="fixed top-44 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4" />
          <span>👥 Multiple Faces Detected ({faceData.length} faces)</span>
        </div>
      )}

      {faceData &&
        faceData.some(
          (face) => face.headPose && isLookingAwayFromScreen(face.headPose)
        ) && (
          <div className="fixed top-56 right-4 z-50 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>👀 Looking Away Detected</span>
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
              <button
                className="bg-black/50 hover:bg-black/60 cursor-pointer text-white rounded-full p-2 shadow-lg transition-colors"
                title="Voice Chat Active"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => {
                socket.emit("student-help-request", {
                  from: socket.id,
                  examId,
                });
                toast.info("Help request sent. Please wait for assistance.");
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
          <span className="text-sm">
            Please ensure you are actively taking the exam
          </span>
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
        onSend={(msg) => {
          socket.emit("private-message", {
            to: adminId,
            from: socket.id,
            message: msg,
            participantId: socket.id ?? "",
          });
          setMessages((prev) => [
            ...prev,
            {
              from: socket.id ?? "",
              message: msg,
              studentName: studentName,
              studentId: studentId,
            },
          ]);
          updateActivity();
        }}
        participantName={studentName}
        participantId={studentId}
        isProctor={false}
        selfId={socket.id}
      />

      {/* Question Content */}
      <div className="mt-16">{renderQuestion()}</div>
    </div>
  );
}

export default QuestionComponent;
