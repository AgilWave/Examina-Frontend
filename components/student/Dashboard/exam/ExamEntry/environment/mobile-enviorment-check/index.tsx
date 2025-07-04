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
    const canvasRef = useRef<HTMLCanvasElement>(null);
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

        // Force video to play (fixes some mobile browser issues)
        if (webcamRef.current) {
            webcamRef.current.play();
        }
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

    // Progress bar for recording
    const RecordingProgressBar = ({ duration }: { duration: number }) => (
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
            <div
                className="h-full bg-red-500 dark:bg-red-400 transition-all duration-200"
                style={{ width: `${Math.min((duration / 30) * 100, 100)}%` }}
            />
        </div>
    );

    // Draw video to canvas for live preview workaround
    useEffect(() => {
        let animationFrameId: number;
        const drawToCanvas = () => {
            const video = webcamRef.current;
            const canvas = canvasRef.current;
            if (video && canvas) {
                if (video.readyState === 4) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        // Debug log for drawing
                        console.log('Drawing video frame to canvas');
                    }
                } else {
                    // Debug log for video not ready
                    console.log('Video not ready for drawing, readyState:', video.readyState);
                }
            } else {
                console.log('Video or canvas ref is null');
            }
            animationFrameId = requestAnimationFrame(drawToCanvas);
        };
        // Only draw when not showing recorded video
        if (!recordedVideo && streamRef.current) {
            animationFrameId = requestAnimationFrame(drawToCanvas);
        }
        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [recordedVideo, streamRef.current]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 dark:from-black dark:to-gray-950 flex items-center justify-center p-2 sm:p-4 relative">
            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60">
                    <Loader />
                    <span className="mt-4 text-lg font-semibold text-white animate-pulse">Uploading...</span>
                </div>
            )}
            <Card className="w-full max-w-sm sm:max-w-md mx-auto shadow-xl rounded-2xl  bg-white dark:bg-gray-900 dark:shadow-2xl border-2 border-teal-200 dark:border-teal-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-2xl mb-1 font-bold text-center text-teal-900 dark:text-teal-200">Environment Check</CardTitle>
                    <div className="text-muted-foreground text-sm mb-2 text-center dark:text-gray-300">
                        Record your surroundings for exam verification
                    </div>
                    <div className="mt-2 text-xs bg-teal-100 dark:bg-teal-900/30 rounded-lg px-3 py-2 flex flex-col gap-1 text-teal-800 dark:text-teal-200">
                        <div><span className="font-semibold">Exam:</span> {examId}</div>
                        <div><span className="font-semibold">Student:</span> {studentId}</div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Instructions */}
                    <Alert className="mb-2 bg-teal-50 border-teal-200 dark:bg-teal-900/30 dark:border-teal-800/40">
                        <AlertTitle className="font-semibold text-teal-800 dark:text-teal-200">Recording Instructions</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc list-inside space-y-1 text-xs text-teal-700 dark:text-teal-200">
                                <li>Show your desk and surrounding area</li>
                                <li>Record for at least 30 seconds</li>
                                <li>Ensure good lighting</li>
                                <li>Keep the camera steady</li>
                            </ul>
                        </AlertDescription>
                    </Alert>
                    {/* Camera Error */}
                    {cameraError && (
                        <Alert variant="destructive" className="mb-2 dark:bg-red-900/40 dark:border-red-800/40">
                            <AlertTitle className="dark:text-red-200">Camera Error</AlertTitle>
                            <AlertDescription className="dark:text-red-100">{cameraError}</AlertDescription>
                        </Alert>
                    )}
                    {/* Video Interface */}
                    <div className="space-y-4">
                        {!recordedVideo ? (
                            <div className="relative rounded-xl overflow-hidden shadow-md border border-teal-200 dark:border-teal-800 bg-white dark:bg-gray-800">
                                <video
                                    ref={webcamRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full aspect-video bg-gray-900 dark:bg-black rounded-xl"
                                    style={{ maxHeight: 220 }}
                                />
                                {/* Recording Indicator */}
                                {isRecording && (
                                    <div className="absolute top-3 left-3 bg-red-600/90 dark:bg-red-700/90 text-white px-3 py-1 rounded-full flex items-center space-x-2 text-xs shadow">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                        <span className="font-medium">REC {formatDuration(recordingDuration)}</span>
                                    </div>
                                )}
                                {/* Progress Bar */}
                                {isRecording && <div className="absolute bottom-0 left-0 right-0 px-2 pb-2"><RecordingProgressBar duration={recordingDuration} /></div>}
                                {/* Duration Warning */}
                                {isRecording && recordingDuration < 30 && (
                                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-lg text-xs shadow text-center">
                                        Record for at least 30 seconds ({30 - recordingDuration}s remaining)
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden shadow-md border border-green-200 dark:border-green-800 bg-white dark:bg-gray-800">
                                <video
                                    key={recordedVideo}
                                    src={recordedVideo}
                                    controls
                                    className="w-full aspect-video bg-gray-900 dark:bg-black rounded-xl border-2 border-green-400 dark:border-green-600 shadow-lg"
                                    style={{ maxHeight: 220 }}
                                />
                                {/* Preview Overlay */}
                                <div className="absolute top-2 right-2 bg-green-500/90 dark:bg-green-700/90 text-white px-2 py-1 rounded-full text-xs shadow">
                                    Preview
                                </div>
                                {/* Upload Status */}
                                {uploadStatus === 'success' && (
                                    <div className="absolute top-3 left-3 bg-green-500 dark:bg-green-700 text-white px-3 py-1 rounded-full flex items-center space-x-2 text-xs shadow">
                                        <span>Uploaded!</span>
                                    </div>
                                )}
                                {uploadStatus === 'error' && (
                                    <div className="absolute top-3 left-3 bg-red-600 dark:bg-red-800 text-white px-3 py-1 rounded-full flex items-center space-x-2 text-xs shadow">
                                        <span>Failed</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 pt-0">
                    {/* Control Buttons */}
                    {!recordedVideo ? (
                        <Button
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={!!cameraError}
                            variant={isRecording ? "secondary" : "destructive"}
                            className="w-full py-3 text-base rounded-xl shadow-md dark:bg-teal-800/80 dark:text-white dark:hover:bg-teal-700/80"
                        >
                            {isRecording ? "Stop Recording" : "Start Recording"}
                        </Button>
                    ) : (
                        <div className="flex gap-3 w-full">
                            <Button
                                onClick={retakeVideo}
                                disabled={isLoading}
                                variant="secondary"
                                className="flex-1 py-3 text-base rounded-xl shadow-md dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                            >
                                Retake
                            </Button>
                            <Button
                                onClick={uploadVideo}
                                disabled={isLoading || uploadStatus === 'success'}
                                loading={isLoading}
                                className="flex-1 py-3 text-base rounded-xl shadow-md bg-green-500 hover:bg-green-600 text-white border-0 dark:bg-green-700 dark:hover:bg-green-600"
                            >
                                {uploadStatus === 'success' ? "Uploaded" : uploadStatus === 'error' ? "Failed" : "Upload"}
                            </Button>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}