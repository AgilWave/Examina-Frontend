'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { TimerIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface StructuredQuestionProps {
  question: string;
  currentQuestion: number;
  totalQuestions: number;
  answer: string;
  setAnswer: (value: string) => void;
  onNext: () => void;
  time: string;
  attachment?: string; 
}

export function StructuredQuestion({
  question,
  currentQuestion,
  totalQuestions,
  answer,
  setAnswer,
  onNext,
  time,
  attachment,
}: StructuredQuestionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [playAttempts, setPlayAttempts] = useState<number>(0);
  
  // Safe play function that handles retries and interruptions
  const safePlayVideo = () => {
    if (!videoRef.current || !cameraActive) return;
    
    // Don't try more than 3 times to avoid infinite loops
    if (playAttempts >= 3) {
      console.log("Maximum play attempts reached, user may need to click manually");
      return;
    }
    
    setPlayAttempts(prev => prev + 1);
    
    try {
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log("Video playing successfully after", playAttempts + 1, "attempts");
        }).catch(error => {
          console.error("Play attempt", playAttempts + 1, "failed:", error);
          
          // If interrupted, try again after a delay, but only if still mounted
          if (error.name === "AbortError" || error.message.includes("interrupted")) {
            console.log("Play interrupted, retrying after delay");
            setTimeout(() => {
              if (videoRef.current && document.body.contains(videoRef.current)) {
                safePlayVideo();
              }
            }, 1000);
          }
        });
      }
    } catch (e) {
      console.error("Error invoking play:", e);
    }
  };

  const startCamera = async () => {
    try {
      // Check if MediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Browser doesn't support camera access");
      }
      
      // Stop any existing stream first to avoid conflicts
      if (stream) {
        console.log("Stopping existing stream");
        stream.getTracks().forEach(track => track.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
      }
      
      setCameraError(null);
      setPlayAttempts(0); // Reset play attempts
      console.log("Requesting camera access...");
      
      // First list available devices to ensure camera exists
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        throw new Error("No camera detected on this device");
      }
      
      console.log("Video devices found:", videoDevices.length);
      
      // Request camera access with fallback options
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 320 },
          height: { ideal: 240 }
        },
        audio: false
      });
      
      console.log("Camera access granted");
      // Update the video element with the new stream
      if (videoRef.current) {
        console.log("Setting video source");
        videoRef.current.srcObject = mediaStream;
        
        // Set the stream state first to ensure we have a reference to it
        setStream(mediaStream);
        setCameraActive(true);        
        // Use oncanplay event to call our safe play function
        videoRef.current.oncanplay = () => {
          console.log("Video can play now");
          // Use a slight delay to ensure we're not interfering with React's rendering cycle
          setTimeout(() => {
            if (videoRef.current && document.body.contains(videoRef.current)) {
              safePlayVideo();
              // Dismiss any existing toast notifications first, especially the loading toast
              toast.dismiss("camera-loading");
              toast.dismiss();
              // Then show success message
              toast.success("Camera connected successfully", { duration: 3000 });
            }
          }, 500);
        };
      } else {
        console.error("Video element ref is null");
        throw new Error("Video element not ready");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      setCameraActive(false);
      
      // Provide specific error messages based on the error type
      let errorMessage = 'Unknown camera error';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied. Please allow camera access in your browser settings.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera device found. Please connect a camera and try again.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is in use by another application.';
      } else {
        errorMessage = `Camera error: ${error.message || 'Unknown issue'}`;
      }
      
      setCameraError(errorMessage);
      
      // Dismiss any existing toasts first to avoid toast stacking
      toast.dismiss();
      // Show the error message with auto-dismiss after 5 seconds
      toast.error("Failed to connect to camera", { duration: 5000 });
      
      // Re-throw the error to be caught by the calling function
      throw error;
    }
  };

  // Reset play attempts when camera status changes
  useEffect(() => {
    if (cameraActive) {
      setPlayAttempts(0);
      
      // Handle video play state
      if (videoRef.current) {
        videoRef.current.onplay = () => {
          // Force re-render when video actually plays
          setCameraActive(true);
        };
      }
    }
  }, [cameraActive]);

  useEffect(() => {
    // Check permission status before attempting to start camera
    const checkAndStartCamera = async () => {
      try {
        // Check if permissions API is available
        if (navigator.permissions && navigator.permissions.query) {
          const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
          
          if (permissionStatus.state === 'granted') {
            console.log("Camera permission already granted");
            startCamera();
          } else if (permissionStatus.state === 'prompt') {
            console.log("Will prompt for camera permission");
            startCamera();
          } else {
            console.log("Camera permission denied");
            setCameraError('Camera access denied. Please allow camera access in your browser settings.');
          }
          
          // Listen for permission changes
          permissionStatus.addEventListener('change', () => {
            if (permissionStatus.state === 'granted') {
              startCamera();
            }
          });
        } else {
          // Permissions API not available, try directly
          console.log("Permissions API not available, trying direct camera access");
          startCamera();
        }
      } catch (error) {
        console.error("Error checking permissions:", error);
        // Fall back to direct camera access
        startCamera();
      }
    };
    
    checkAndStartCamera();
    
    // Cleanup function to stop camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setCameraActive(false);
        setStream(null);
      }
    };
  }, []);
  
  return (
    <div className="fixed inset-0 w-full h-screen z-50 flex flex-col items-center p-6 bg-white dark:bg-black text-black dark:text-white">
      {/* Top bar with question progress and timer */}
      <div className="w-[90vw] flex justify-between items-center">
        <div className="flex gap-1">
          {[...Array(totalQuestions)].map((_, idx) => (
            <div
              key={idx}
              className={cn(
                'h-1.5 w-6 rounded-full',
                idx < currentQuestion ? 'bg-teal-600' : 'bg-gray-300 dark:bg-gray-700'
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm border px-3 py-1.5 rounded-full">
          <TimerIcon className="w-4 h-4 text-orange-500" />
          <span>{time}</span>
        </div>
      </div>

      {/* Main content with question and answer area in two columns */}
      <div className="mt-6 w-[90vw] flex-1 flex flex-col md:flex-row gap-6 mb-6">
        {/* Left side - Question with scrollable area */}
        <div className="w-full md:w-2/5 border rounded-lg p-5 shadow-md flex flex-col">
          <h3 className="font-medium text-lg mb-3">Question {currentQuestion}</h3>
          <ScrollArea className="flex-1 pr-4 max-h-[65vh]">
            <div className="text-base">
              {question}
            </div>
            
            {/* Attachment section below the question if present */}
            {attachment && (
              <div className="mt-4 border-t pt-4">
                <h4 className="font-medium text-sm mb-2">Attachment</h4>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  {/* Display attachment - could be an image, PDF link, or other content */}
                  <img 
                    src={attachment} 
                    alt="Question attachment" 
                    className="max-w-full rounded"
                  />
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
        
        {/* Right side - Answer area */}
        <div className="w-full md:w-3/5 border rounded-lg p-5 shadow-md flex flex-col">
          <h3 className="font-medium text-lg mb-3">Your Answer</h3>
          <div className="flex-1">
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-full min-h-[300px] resize-vertical border-gray-300 dark:border-gray-700 focus:border-teal-500 dark:focus:border-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Bottom section with camera preview and navigation button */}
      <div className="w-[90vw] flex justify-end items-end mb-6">
        {/* Navigation button */}
        <Button className="px-8 py-2 text-base" onClick={onNext}>
          Next Question
        </Button>
      </div>
    </div>
  );
}
