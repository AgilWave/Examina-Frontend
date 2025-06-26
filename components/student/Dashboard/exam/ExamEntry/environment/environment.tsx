"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import { Loader2, CheckCircle, Smartphone } from "lucide-react";
import socket from '@/lib/socket';
import { useSearchParams } from "next/navigation";


interface EnvironmentCheckupProps {
  onNext: () => void;
  onPrev: () => void;
}

export function EnvironmentCheckup({ onNext }: EnvironmentCheckupProps) {
  const searchParams = useSearchParams();
  const examId = searchParams.get("examId");
  const studentId = searchParams.get("studentId");
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  
  // Mobile URL that includes the environment check page
  const mobileUrl = `${window.location.origin}/exams/enviorment-check?examId=${examId}&studentId=${studentId}`;

  useEffect(() => {
    // Handler functions
    const handleConnect = () => {
      console.log('Connected to WebSocket');
      setConnectionStatus('connected');
      // Join the environment check room
      socket.emit('join-environment-check', {
        examId,
        studentId,
      });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleJoined = (data: any) => {
      console.log('Joined environment check room:', data);
      setProgressStatus('Waiting for mobile device...');
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleProgress = (data: any) => {
      console.log('Progress update:', data);
      setProgressStatus(`Mobile status: ${data.status}`);
      if (data.status === 'uploading') {
        setProgressStatus('Mobile is uploading video...');
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDone = (data: any) => {
      console.log('Environment check completed:', data);
      setIsLoading(false);
      setIsCompleted(true);
      setProgressStatus('Environment check completed successfully!');
      setTimeout(() => {
        onNext();
      }, 2000);
    };
    const handleError = (error: unknown) => {
      console.error('WebSocket connection error:', error);
      setConnectionStatus('error');
    };

    socket.on('connect', handleConnect);
    socket.on('joined-environment-check', handleJoined);
    socket.on('environment-check-progress', handleProgress);
    socket.on('environment-check-done', handleDone);
    socket.on('connect_error', handleError);

    // If already connected, trigger join
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('joined-environment-check', handleJoined);
      socket.off('environment-check-progress', handleProgress);
      socket.off('environment-check-done', handleDone);
      socket.off('connect_error', handleError);
    };
  }, [examId, studentId, onNext]);

  const handleSkipToWebcam = () => {
    // If user wants to use desktop webcam instead
    setIsLoading(false);
    // You can add webcam functionality here or redirect to a different component
  };

  return (
    <div className="text-center space-y-8 w-full max-w-6xl mx-auto px-4">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold dark:text-white text-gray-900">
          Environment Checkup
        </h1>
        <p className="dark:text-gray-400 text-gray-600 text-lg">
          Scan this QR code with your mobile device to complete the environment verification
        </p>
      </div>

      {/* Connection Status */}
      {/* <div className="flex justify-center items-center space-x-2">
        {connectionStatus === 'connecting' && (
          <div className="flex items-center space-x-2 text-yellow-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Connecting...</span>
          </div>
        )}
        {connectionStatus === 'connected' && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Connected</span>
          </div>
        )}
        {connectionStatus === 'error' && (
          <div className="flex items-center space-x-2 text-red-600">
            <span className="text-sm">Connection Error</span>
          </div>
        )}
      </div> */}

      {/* QR Code */}
      <div className="flex flex-col items-center w-full">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <QRCode 
            value={mobileUrl} 
            size={200} 
            className="mx-auto" 
          />
        </div>
        
        <div className="mt-4 flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <Smartphone className="w-5 h-5" />
          <span className="text-sm">Scan with your mobile camera</span>
        </div>
      </div>

      {/* Progress Status */}
      {progressStatus && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-200 font-medium">
            {progressStatus}
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !isCompleted && (
        <div className="flex justify-center items-center space-y-4 flex-col">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">
            Waiting for mobile environment check completion...
          </p>
        </div>
      )}

      {/* Completed State */}
      {isCompleted && (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <CheckCircle className="w-8 h-8" />
            <span className="text-xl font-semibold">Environment Check Complete!</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Proceeding to next step...
          </p>
        </div>
      )}

      {/* Alternative Option */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Don&apos;t have a mobile device?
        </p>
        <Button
          variant="outline"
          onClick={handleSkipToWebcam}
          className="text-sm"
        >
          Use Desktop Camera Instead
        </Button>
      </div>
    </div>
  );
}