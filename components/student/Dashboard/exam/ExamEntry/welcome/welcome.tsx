'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DataManagementProps {
  onPrev: () => void;
  examStartDelaySeconds?: number; // using seconds instead of minutes
}

export function DataManagement({ onPrev, examStartDelaySeconds = 30 }: DataManagementProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const router = useRouter();  useEffect(() => {
    const delayInMs = examStartDelaySeconds * 1000;
    const examStartTimestamp = new Date().getTime() + delayInMs;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const remaining = Math.max(0, examStartTimestamp - now);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        router.push('/entry/question'); 
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [examStartDelaySeconds, router]);
    // Camera access effect
  useEffect(() => {
    let isMounted = true;
    
    async function setupCamera() {
      // Skip if we already have a stream
      if (stream) return;
      
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        // Only update state if component is still mounted
        if (isMounted) {
          setStream(mediaStream);
        } else {
          // Clean up if component unmounted during async operation
          mediaStream.getTracks().forEach(track => track.stop());
        }
      } catch (error) {
        console.error("Camera access error:", error);
      }
    }

    setupCamera();
    
    // Cleanup function to stop the camera stream when component unmounts
    return () => {
      isMounted = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="text-center space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-white">Welcome to</h1>
        <p className="text-gray-400 text-lg">Data Management Examination</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-gray-300 text-lg">Exam Starts In</p>
          <div className="text-8xl font-bold text-white tracking-tight">
            {formatTime(timeLeft)}
          </div>
        </div>        <div className="max-w-md mx-auto">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-teal-500 h-2 rounded-full transition-all duration-100 ml-auto" 
              style={{
                width: `${(timeLeft / (examStartDelaySeconds * 1000)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Camera Preview */}
      <div className="max-w-xs mx-auto">
        <p className="text-gray-300 mb-2">Camera Preview</p>
        <div className="bg-gray-800 rounded-lg overflow-hidden aspect-video relative">          {stream ? (
            <video
              ref={(videoRef) => {
                // Only set srcObject if it's not already set to prevent blinking
                if (videoRef && stream && videoRef.srcObject !== stream) {
                  videoRef.srcObject = stream;
                  videoRef.play().catch(err => console.error("Error playing video:", err));
                }
              }}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Accessing camera...</p>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">Make sure your face is clearly visible</p>
      </div>

      <div className="pt-4">
        <button
          disabled
          className="bg-gray-500 text-white px-12 py-4 rounded-xl text-lg font-medium shadow-lg shadow-teal-500/25 cursor-not-allowed"
        >
          Waiting for Exam to Start...
        </button>
      </div>
    </div>
  );
}
