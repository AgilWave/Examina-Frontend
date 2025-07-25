"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Mic, MicOff, Expand } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from "lucide-react";

interface MicCameraSetupProps {
  onNext: () => void;
}

interface MediaDevice {
    deviceId: string;
    label: string;
}

export function MicCameraSetup({ onNext }: MicCameraSetupProps) {
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [hasPermissions, setHasPermissions] = useState({
    camera: false,
    mic: false,
  });
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Device selection states
  const [videoDevices, setVideoDevices] = useState<MediaDevice[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDevice[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | undefined>(undefined);
  const [selectedAudio, setSelectedAudio] = useState<string | undefined>(undefined);

  // Audio visualization states
  const [audioLevel, setAudioLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Mic level threshold for allowing continue
  const MIC_LEVEL_THRESHOLD = 0.2; // Adjust as needed

  // Track if user has passed the audio check
  const [hasPassedAudioCheck, setHasPassedAudioCheck] = useState(false);

  // Derived state for enabling continue
  const canContinue = hasPassedAudioCheck;

  // Get available devices
  const getDevices = useCallback(async () => {
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
    } catch (err: unknown) {
      const error = err as Error;
      toast.error('Could not enumerate devices: ' + error.message);
    }
  }, [selectedVideo, selectedAudio]);

  // Get stream with specific devices
  const getStream = useCallback(async (videoId?: string, audioId?: string) => {
    const constraints: MediaStreamConstraints = {
      video: videoId ? { deviceId: { exact: videoId } } : { width: 640, height: 480 },
      audio: audioId ? { deviceId: { exact: audioId } } : true,
    };
    return navigator.mediaDevices.getUserMedia(constraints);
  }, []);

  // Function to request and handle media permissions
  const requestMediaPermissions = async () => {
    try {
      setPermissionError(null);

      // Get devices first
      await getDevices();

      // Request camera and microphone access with selected devices
      const mediaStream = await getStream(selectedVideo, selectedAudio);

      setStream(mediaStream);
      setHasPermissions({ camera: true, mic: true });

      // Set video stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Ensure video plays when ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current
            ?.play()
            .catch((e) => console.error("Error playing video:", e));
        };
      }

      // Initialize audio analyzer
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;

        const source =
          audioContextRef.current.createMediaStreamSource(mediaStream);
        source.connect(analyserRef.current);
      }

      // Initially enable camera but mute microphone
      setIsCameraEnabled(true);
      setIsMicEnabled(false);

      // Enable/disable tracks based on initial state
      mediaStream.getVideoTracks().forEach((track) => {
        track.enabled = true;
      });

      mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Error accessing media devices:", err);

      // Set more specific error message
      if (err.name === "NotAllowedError") {
        setPermissionError(
          "Camera or microphone permission denied. Please allow access in your browser settings."
        );
      } else if (err.name === "NotFoundError") {
        setPermissionError("No camera or microphone found on your device.");
      } else {
        setPermissionError(
          `Error accessing media devices: ${err.message || err.name}`
        );
      }

      setHasPermissions({
        camera: false,
        mic: false,
      });
    }
  };

  // Function to analyze audio levels
  const analyzeAudio = () => {
    if (!analyserRef.current || !isMicEnabled) {
      setAudioLevel(0);
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
      return;
    }

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average volume level
    const average =
      dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const normalizedLevel = Math.min(average / 128, 1); // Normalize to 0-1 range
    setAudioLevel(normalizedLevel);

    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  };

  // Handle camera toggle
  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !isCameraEnabled;
      });
      setIsCameraEnabled(!isCameraEnabled);
    }
  };

  // Handle microphone toggle
  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !isMicEnabled;
      });

      const newMicState = !isMicEnabled;
      setIsMicEnabled(newMicState);

      // Start audio analysis if mic is enabled
      if (newMicState && !animationFrameRef.current && analyserRef.current) {
        analyzeAudio();
      }
    }
  };

  // Handle device changes
  const handleVideoChange = async (value: string) => {
    setSelectedVideo(value || undefined);
    if (stream) {
      try {
        const newStream = await getStream(value || undefined, selectedAudio);
        
        // Update video element
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }

        // Stop old stream
        stream.getTracks().forEach(track => track.stop());
        setStream(newStream);

        // Reinitialize audio analyzer with new stream
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        
        audioContextRef.current = new (window.AudioContext ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;

        const source = audioContextRef.current.createMediaStreamSource(newStream);
        source.connect(analyserRef.current);

        toast.success('Camera device updated');
      } catch (err: unknown) {
        const error = err as Error;
        toast.error('Failed to update camera: ' + error.message);
      }
    }
  };

  const handleAudioChange = async (value: string) => {
    setSelectedAudio(value || undefined);
    if (stream) {
      try {
        const newStream = await getStream(selectedVideo, value || undefined);
        
        // Update video element
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }

        // Stop old stream
        stream.getTracks().forEach(track => track.stop());
        setStream(newStream);

        // Reinitialize audio analyzer with new stream
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        
        audioContextRef.current = new (window.AudioContext ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;

        const source = audioContextRef.current.createMediaStreamSource(newStream);
        source.connect(analyserRef.current);

        toast.success('Microphone device updated');
      } catch (err: unknown) {
        const error = err as Error;
        toast.error('Failed to update microphone: ' + error.message);
      }
    }
  };

  // Check permission status
  const checkPermissionStatus = async () => {
    try {
      // Check if permissions API is available
      if (navigator.permissions && navigator.permissions.query) {
        const cameraStatus = await navigator.permissions.query({
          name: "camera" as PermissionName,
        });
        const micStatus = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });

        // If permissions are already granted, initialize immediately
        if (cameraStatus.state === "granted" && micStatus.state === "granted") {
          requestMediaPermissions();
        }
      } else {
        // For browsers that don't support permissions API, just try to access media
        requestMediaPermissions();
      }
    } catch (error) {
      console.error("Error checking permissions:", error);
      // Fall back to requesting permissions directly
      requestMediaPermissions();
    }
  };

  // Clean up function to stop all tracks when component unmounts
  useEffect(() => {
    // Request permissions when component mounts
    checkPermissionStatus();

    // Clean up on component unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      // Clean up audio analysis
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    analyzeAudio();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMicEnabled]);

  // Add effect to set hasPassedAudioCheck when requirements are met
  useEffect(() => {
    if (
      !hasPassedAudioCheck &&
      isCameraEnabled &&
      isMicEnabled &&
      audioLevel > MIC_LEVEL_THRESHOLD
    ) {
      setHasPassedAudioCheck(true);
    }
  }, [audioLevel, isCameraEnabled, isMicEnabled, hasPassedAudioCheck]);

  return (
    <div className="text-center space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Mic & Camera Setting
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Please turn on your mic and camera
        </p>
      </div>

      {/* Device Selection */}
      {hasPermissions.camera && hasPermissions.mic && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Camera Device:
              </label>
              <Select value={selectedVideo || ''} onValueChange={handleVideoChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select camera" />
                </SelectTrigger>
                <SelectContent>
                  {videoDevices.map(device => (
                    <SelectItem key={device.deviceId} value={device.deviceId}>
                      {device.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Microphone Device:
              </label>
              <Select value={selectedAudio || ''} onValueChange={handleAudioChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select microphone" />
                </SelectTrigger>
                <SelectContent>
                  {audioDevices.map(device => (
                    <SelectItem key={device.deviceId} value={device.deviceId}>
                      {device.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="relative bg-white dark:bg-card rounded-2xl overflow-hidden shadow-2xl">
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center relative">
              {!hasPermissions.camera && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-black dark:text-white space-y-4 bg-white dark:bg-card">
                  <Camera className="w-16 h-16 text-gray-600 dark:text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-300">
                    {permissionError || "Camera permission required"}
                  </p>
                  <button
                    onClick={requestMediaPermissions}
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    Allow camera & mic
                  </button>
                </div>
              )}

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={cn(
                  "w-full h-full object-cover",
                  !isCameraEnabled && "hidden"
                )}
              />

              {isCameraEnabled === false && hasPermissions.camera && (
                <div className="absolute inset-0 bg-white dark:bg-card bg-opacity-80 flex items-center justify-center">
                  <Camera className="w-16 h-16 text-gray-600 dark:text-gray-400" />
                </div>
              )}
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <div className="flex items-center space-x-4 mb-2">
              <button
                onClick={toggleCamera}
                disabled={!hasPermissions.camera}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110",
                  isCameraEnabled
                    ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25"
                    : "bg-red-500 text-white shadow-lg shadow-red-500/25",
                  !hasPermissions.camera && "opacity-50 cursor-not-allowed"
                )}
              >
                <Camera className="w-6 h-6" />
              </button>

              <button
                onClick={toggleMic}
                disabled={!hasPermissions.mic}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110",
                  isMicEnabled
                    ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25"
                    : "bg-red-500 text-white shadow-lg shadow-red-500/25",
                  !hasPermissions.mic && "opacity-50 cursor-not-allowed"
                )}
              >
                {isMicEnabled ? (
                  <Mic className="w-6 h-6" />
                ) : (
                  <MicOff className="w-6 h-6" />
                )}
              </button>

              <button className="w-12 h-12 rounded-full bg-gray-800 dark:bg-black text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-gray-900 dark:hover:bg-black">
                <Expand className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Sound Level Visualization */}
      {hasPermissions.mic && (
        <div className="w-full max-w-sm mx-auto mb-4">
          <div className="flex items-center space-x-3 mb-2">
            {isMicEnabled ? (
              <Mic className="w-4 h-4 text-teal-500" />
            ) : (
              <MicOff className="w-4 h-4 text-gray-400" />
            )}
            <div className="h-1.5 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  isMicEnabled
                    ? audioLevel < 0.3
                      ? "bg-teal-500"
                      : audioLevel < 0.6
                      ? "bg-blue-500"
                      : "bg-purple-500"
                    : "bg-gray-400 dark:bg-gray-600"
                )}
                style={{ width: `${isMicEnabled ? audioLevel * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      )}
      <div className="pt-4">
        {canContinue ? (
          <Button onClick={onNext} size="lg" className="transition-all">
            Continue
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        ) : (
          <div className="flex flex-col items-center text-yellow-500 text-sm mt-2">
            {!isCameraEnabled && !isMicEnabled && (
              <span className="">Please turn on your mic and camera</span>
            )}
            {!isCameraEnabled && isMicEnabled && (
              <span className="">Please turn on your camera</span>
            )}
            {isCameraEnabled && !isMicEnabled && (
              <span className="">Please turn on your mic and make a sound to continue</span>
            )}

            {isCameraEnabled && isMicEnabled && !hasPassedAudioCheck && (
              <>
                <Loader2 className="w-10 h-10 animate-spin mb-2" />
                <span className="m">Please make a sound to continue</span>
              </>
            )}
          </div>
        )}

        {/* {hasPermissions.camera && !isCameraEnabled && (
          <p className="text-yellow-500 text-sm mt-2">
            Consider enabling your camera for a better exam experience
          </p>
        )} */}
      </div>
    </div>
  );
}

/* Add a simple spinner style at the bottom of the file */
<style jsx global>{`
  .loader2 {
    border: 4px solid #e5e7eb;
    border-top: 4px solid #14b8a6;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`}</style>
