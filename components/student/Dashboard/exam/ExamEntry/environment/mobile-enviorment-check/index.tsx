'use client'
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Loader from "@/components/ui/loader";
import socket from '@/lib/socket';
import { BACKEND_URL } from "@/Constants/backend";
import axios from "axios";

export default function MobileEnvironmentCheck() {
    const [examId, setExamId] = useState('');
    const [studentId, setStudentId] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);

    const webcamRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunks = useRef<Blob[]>([]);
    const recordingTimer = useRef<NodeJS.Timeout | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Get URL parameters
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setExamId(urlParams.get('examId') || 'test-exam-123');
        setStudentId(urlParams.get('studentId') || 'STUDENT456');
    }, []);

    // Initialize camera
    const initializeCamera = useCallback(async () => {
        try {
            setCameraError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Use back camera
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: true
            });

            streamRef.current = stream;
            if (webcamRef.current) {
                webcamRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Camera access error:', error);
            setCameraError('Unable to access camera. Please check permissions.');
        }
    }, []);

    useEffect(() => {
        initializeCamera();

        return () => {
            // Cleanup
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [initializeCamera]);

    const startRecording = useCallback(() => {
        if (!streamRef.current) return;

        setIsRecording(true);
        setRecordingDuration(0);
        recordedChunks.current = [];

        // Start timer
        recordingTimer.current = setInterval(() => {
            setRecordingDuration(prev => prev + 1);
        }, 1000);

        mediaRecorderRef.current = new MediaRecorder(streamRef.current, {
            mimeType: "video/webm;codecs=vp8,opus"
        });

        mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
            if (event.data.size > 0) {
                recordedChunks.current.push(event.data);
            }
        });

        mediaRecorderRef.current.addEventListener("stop", () => {
            const blob = new Blob(recordedChunks.current, {
                type: "video/webm"
            });
            const url = URL.createObjectURL(blob);
            setRecordedVideo(url);
            setIsRecording(false);

            // Clear timer
            if (recordingTimer.current) {
                clearInterval(recordingTimer.current);
                recordingTimer.current = null;
            }
        });

        mediaRecorderRef.current.start();
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }

        if (recordingTimer.current) {
            clearInterval(recordingTimer.current);
            recordingTimer.current = null;
        }
    }, []);

    const retakeVideo = () => {
        setRecordedVideo(null);
        setUploadStatus('idle');
        setRecordingDuration(0);
        recordedChunks.current = [];

        if (recordedVideo) {
            URL.revokeObjectURL(recordedVideo);
        }
    };

    const uploadVideo = async () => {
        if (!recordedChunks.current.length) return;

        setIsLoading(true);
        setUploadStatus('uploading');

        try {
            const blob = new Blob(recordedChunks.current, { type: "video/webm" });
            const formData = new FormData();
            formData.append('video', blob, `environment-check-${examId}-${studentId}.webm`);
            formData.append('examId', examId);
            formData.append('studentId', studentId);
            formData.append('timestamp', new Date().toISOString());

            const response = await axios.post(`${BACKEND_URL}/environment-checkup/upload-video`, formData);

            if (!response.data) {
                const errorData = await response.data;
                throw new Error(errorData.message || 'Upload failed');
            }

            const result = await response.data;
            console.log('Upload successful:', result);
            setUploadStatus('success');
            // Emit socket event after successful upload
            socket.emit('environment-check-completed', {
                examId,
                studentId,
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl mb-1">Environment Check</CardTitle>
                    <div className="text-muted-foreground text-sm mb-2">
                        Record your surroundings for exam verification
                    </div>
                    <div className="mt-2 text-xs bg-primary/10 rounded-lg px-3 py-2">
                        <div>Exam: {examId}</div>
                        <div>Student: {studentId}</div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Instructions */}
                    <Alert className="mb-2">
                        <AlertTitle>Recording Instructions</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                <li>Show your desk and surrounding area</li>
                                <li>Record for at least 30 seconds</li>
                                <li>Ensure good lighting</li>
                                <li>Keep the camera steady</li>
                            </ul>
                        </AlertDescription>
                    </Alert>
                    {/* Camera Error */}
                    {cameraError && (
                        <Alert variant="destructive">
                            <AlertTitle>Camera Error</AlertTitle>
                            <AlertDescription>{cameraError}</AlertDescription>
                        </Alert>
                    )}
                    {/* Video Interface */}
                    <div className="space-y-4">
                        {!recordedVideo ? (
                            <div className="relative">
                                <video
                                    ref={webcamRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full rounded-lg bg-gray-900"
                                    style={{ aspectRatio: '16/9' }}
                                />
                                {/* Recording Indicator */}
                                {isRecording && (
                                    <div className="absolute top-3 left-3 bg-destructive text-white px-3 py-1 rounded-full flex items-center space-x-2 text-sm">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                        <span className="font-medium">REC {formatDuration(recordingDuration)}</span>
                                    </div>
                                )}
                                {/* Duration Warning */}
                                {isRecording && recordingDuration < 30 && (
                                    <div className="absolute bottom-3 left-3 right-3 bg-black/70 text-white p-2 rounded-lg text-center text-sm">
                                        Record for at least 30 seconds ({30 - recordingDuration}s remaining)
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="relative">
                                <video
                                    src={recordedVideo}
                                    controls
                                    className="w-full rounded-lg bg-gray-900"
                                    style={{ aspectRatio: '16/9' }}
                                />
                                {/* Upload Status */}
                                {uploadStatus === 'success' && (
                                    <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full flex items-center space-x-2 text-sm">
                                        <span>Uploaded!</span>
                                    </div>
                                )}
                                {uploadStatus === 'error' && (
                                    <div className="absolute top-3 left-3 bg-destructive text-white px-3 py-1 rounded-full flex items-center space-x-2 text-sm">
                                        <span>Failed</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    {/* Control Buttons */}
                    {!recordedVideo ? (
                        <Button
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={!!cameraError}
                            variant={isRecording ? "secondary" : "destructive"}
                            className="w-full"
                        >
                            {isRecording ? "Stop Recording" : "Start Recording"}
                        </Button>
                    ) : (
                        <div className="flex gap-3 w-full">
                            <Button
                                onClick={retakeVideo}
                                disabled={isLoading}
                                variant="secondary"
                                className="flex-1"
                            >
                                Retake
                            </Button>
                            <Button
                                onClick={uploadVideo}
                                disabled={isLoading || uploadStatus === 'success'}
                                loading={isLoading}
                                className="flex-1"
                            >
                                {uploadStatus === 'success' ? "Uploaded" : uploadStatus === 'error' ? "Failed" : "Upload"}
                            </Button>
                        </div>
                    )}
                </CardFooter>
                {isLoading && <Loader />}
            </Card>
        </div>
    );
}