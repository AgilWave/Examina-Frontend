
'use client'
import React, { useRef, useEffect, useState, useCallback } from "react";
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as blazeface from '@tensorflow-models/blazeface';

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

const TensorFlowFaceDetection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [faceData, setFaceData] = useState<FaceDetection[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [suspiciousActivity, setSuspiciousActivity] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [model, setModel] = useState<blazeface.BlazeFaceModel | null>(null);
  const [mouthHistory, setMouthHistory] = useState<number[]>([]);
  const [talkingDetected, setTalkingDetected] = useState(false);

  // Initialize TensorFlow.js and load BlazeFace model
  useEffect(() => {
    const initializeTensorFlow = async () => {
      try {
        setIsLoading(true);
        
        // Initialize TensorFlow.js backend
        await tf.ready();
        console.log('TensorFlow.js initialized');
        
        // Load BlazeFace model
        const blazeFaceModel = await blazeface.load();
        setModel(blazeFaceModel);
        setModelLoaded(true);
        
        console.log('BlazeFace model loaded successfully');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to load TensorFlow model: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTensorFlow();
  }, []);

  // Calculate head pose from facial landmarks
  const calculateHeadPose = useCallback((landmarks: Array<{ x: number; y: number }>) => {
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
      y: (rightEye.y + leftEye.y) / 2
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
  }, []);

  // Calculate mouth movement from facial landmarks
  const calculateMouthMovement = useCallback((landmarks: Array<{ x: number; y: number }>, previousHistory: number[]) => {
    if (!landmarks || landmarks.length < 6) {
      return { isOpen: false, openness: 0, isTalking: false };
    }

    // BlazeFace landmarks: 3 is mouth center, we need to estimate mouth corners and height
    const mouth = landmarks[3];
    const rightEye = landmarks[0];
    const leftEye = landmarks[1];
    const noseTip = landmarks[2];

    // Calculate mouth openness based on relative positioning
    // Estimate mouth height based on the distance from nose to mouth compared to eye distance
    const eyeDistance = Math.abs(rightEye.x - leftEye.x);
    const noseMouthDistance = Math.abs(mouth.y - noseTip.y);
    
    // Normalize mouth openness (0-1 scale)
    const mouthOpenness = Math.min(1, Math.max(0, (noseMouthDistance / eyeDistance) - 0.3) * 5);
    
    // Update mouth history (keep last 10 measurements)
    const newHistory = [...previousHistory, mouthOpenness].slice(-10);
    
    // Detect talking based on mouth movement patterns
    let isTalking = false;
    if (newHistory.length >= 6) {
      // Calculate variance in mouth openness
      const avg = newHistory.reduce((sum, val) => sum + val, 0) / newHistory.length;
      const variance = newHistory.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / newHistory.length;
      
      // Check for rapid changes (talking pattern)
      const rapidChanges = newHistory.slice(1).filter((val, idx) => 
        Math.abs(val - newHistory[idx]) > 0.1
      ).length;
      
      // Talking detected if there's sufficient variance and rapid changes
      isTalking = variance > 0.02 && rapidChanges >= 3;
    }

    return {
      isOpen: mouthOpenness > 0.3,
      openness: mouthOpenness,
      isTalking,
      history: newHistory
    };
  }, []);

  // TensorFlow.js face detection
  const detectFacesWithTensorFlow = useCallback(async (video: HTMLVideoElement): Promise<FaceDetection[]> => {
    if (!model || !modelLoaded) {
      throw new Error('Model not loaded yet');
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
                y: landmark[1]
              }))
            : [] // Handle Tensor2D case
          : [];

        // Calculate head pose from landmarks
        const headPose = landmarks.length > 0 
          ? calculateHeadPose(landmarks)
          : undefined;

        // Calculate mouth movement from landmarks
        const mouthMovement = landmarks.length > 0 
          ? calculateMouthMovement(landmarks, mouthHistory)
          : undefined;

        // Update mouth history if mouth movement was calculated
        if (mouthMovement?.history) {
          setMouthHistory(mouthMovement.history);
        }

        // Handle probability
        let confidence = 0.9;
        if (prediction.probability) {
          if (typeof prediction.probability === 'number') {
            confidence = prediction.probability;
          } else if (Array.isArray(prediction.probability)) {
            confidence = prediction.probability[0] || 0.9;
          }
        }

        return {
          boundingBox: { x, y, width, height },
          landmarks,
          headPose,
          mouthMovement: mouthMovement ? {
            isOpen: mouthMovement.isOpen,
            openness: mouthMovement.openness,
            isTalking: mouthMovement.isTalking
          } : undefined,
          confidence
        };
      });

      return faces;
    } catch (err) {
      console.error('TensorFlow face detection error:', err);
      throw err;
    }
  }, [model, modelLoaded, calculateHeadPose, calculateMouthMovement, mouthHistory]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || isLoading || !modelLoaded || !model) return;

    setIsLoading(true);
    setError(null);

    try {
      const video = videoRef.current;
      const faces = await detectFacesWithTensorFlow(video);
      setFaceData(faces);
      
      // Check for suspicious activity
      if (faces.length === 0) {
        setSuspiciousActivity(true);
        setTalkingDetected(false);
      } else {
        const isLookingAway = faces.some(face => 
          face.headPose && isLookingAwayFromScreen(face.headPose)
        );
        
        const isTalkingDetected = faces.some(face => 
          face.mouthMovement && face.mouthMovement.isTalking
        );
        
        setSuspiciousActivity(isLookingAway || isTalkingDetected);
        setTalkingDetected(isTalkingDetected);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError("Analysis failed: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, modelLoaded, model, detectFacesWithTensorFlow]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cameraActive && modelLoaded) {
      // Analyze frame every 1.5 seconds for better real-time performance
      interval = setInterval(() => {
        captureAndAnalyze();
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [cameraActive, modelLoaded, captureAndAnalyze]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError("Failed to access camera: " + errorMessage);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  const getHeadPoseDescription = (headPose?: { pitch: number; roll: number; yaw: number }) => {
    if (!headPose) return "Unknown";

    const { pitch, roll, yaw } = headPose;
    let description = "";

    // More accurate thresholds for description
    // Pitch: up/down movement
    if (pitch > 10) description += "Looking up ";
    else if (pitch < -10) description += "Looking down ";
    else description += "Level ";

    // Yaw: left/right movement  
    if (yaw > 10) description += "& turned right ";
    else if (yaw < -10) description += "& turned left ";
    else description += "& facing forward ";

    // Roll: tilting
    if (roll > 10) description += "(tilted right)";
    else if (roll < -10) description += "(tilted left)";
    else description += "(upright)";

    return description;
  };

  const isLookingAwayFromScreen = (headPose?: { pitch: number; yaw: number }) => {
    if (!headPose) return false;
    const { pitch, yaw } = headPose;
    
    // More lenient thresholds - only flag as looking away if significantly turned
    // Increased thresholds to reduce false positives
    return Math.abs(pitch) > 20 || Math.abs(yaw) > 25;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        TensorFlow.js Face Detection & Head Pose Analysis
      </h1>

      {!modelLoaded && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
            <span>Loading TensorFlow.js BlazeFace model...</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Section */}
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-64 object-cover"
            />
            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}
            
            {/* Draw face detection overlay */}
            {faceData && faceData.length > 0 && videoRef.current && (
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ mixBlendMode: 'multiply' }}
              />
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={captureAndAnalyze}
              disabled={!cameraActive || isLoading || !modelLoaded}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
            >
              {isLoading ? "Analyzing..." : "Analyze Now"}
            </button>
            <button
              onClick={cameraActive ? stopCamera : startCamera}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              {cameraActive ? "Stop" : "Start"} Camera
            </button>
          </div>

          <div className="text-sm text-gray-600 text-center">
            {!modelLoaded 
              ? "Model loading..." 
              : cameraActive 
                ? "Auto-analyzing every 1.5 seconds with TensorFlow.js" 
                : "Camera stopped"
            }
          </div>

          {suspiciousActivity && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
              ⚠️ Suspicious Activity Detected!
              {talkingDetected && (
                <div className="text-sm mt-1">🗣️ Talking/Mouth Movement Detected</div>
              )}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Analysis Results
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {faceData ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Faces Detected: {faceData.length}
                </h3>
                {modelLoaded && (
                  <div className="text-sm text-green-600">
                    ✅ TensorFlow.js BlazeFace Model Active
                  </div>
                )}
              </div>

              {faceData.length > 0 ? (
                <div className="space-y-3">
                  {faceData.map((face, index) => {
                    const headPose = face.headPose;
                    const mouthMovement = face.mouthMovement;
                    const lookingAway = isLookingAwayFromScreen(headPose);

                    return (
                      <div
                        key={`face-${index}`}
                        className="bg-gray-50 p-4 rounded-lg border"
                      >
                        <h4 className="font-medium text-gray-800 mb-2">
                          Face {index + 1}
                        </h4>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Position:</span>
                            <div className="text-gray-600">
                              X: {face.boundingBox.x.toFixed(0)}
                              <br />
                              Y: {face.boundingBox.y.toFixed(0)}
                              <br />
                              Size: {face.boundingBox.width.toFixed(0)}×
                              {face.boundingBox.height.toFixed(0)}
                            </div>
                          </div>

                          {headPose && (
                            <div>
                              <span className="font-medium">Head Pose:</span>
                              <div className="text-gray-600">
                                Pitch: {headPose.pitch.toFixed(1)}°<br />
                                Yaw: {headPose.yaw.toFixed(1)}°<br />
                                Roll: {headPose.roll.toFixed(1)}°
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Movement: </span>
                            {getHeadPoseDescription(headPose)}
                          </div>

                          <div className="text-sm">
                            <span className="font-medium">Confidence: </span>
                            {(face.confidence * 100).toFixed(1)}%
                          </div>

                          {/* Debug information */}
                          {headPose && (
                            <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                              <span className="font-medium">Debug: </span>
                              P:{headPose.pitch.toFixed(1)}° Y:{headPose.yaw.toFixed(1)}° R:{headPose.roll.toFixed(1)}°
                              <br />
                              Thresholds: P:±25° Y:±35° (for &quot;looking away&quot;)
                              {mouthMovement && (
                                <>
                                  <br />
                                  Mouth: {mouthMovement.isOpen ? 'Open' : 'Closed'} 
                                  ({(mouthMovement.openness * 100).toFixed(0)}%)
                                  {mouthMovement.isTalking && ' - 🗣️ TALKING DETECTED'}
                                </>
                              )}
                            </div>
                          )}

                          {face.landmarks && (
                            <div className="text-sm">
                              <span className="font-medium">Landmarks: </span>
                              {face.landmarks.length} facial points detected
                            </div>
                          )}

                          {mouthMovement && (
                            <div className="text-sm">
                              <span className="font-medium">Mouth Status: </span>
                              <span className={mouthMovement.isOpen ? "text-orange-600" : "text-gray-600"}>
                                {mouthMovement.isOpen ? 'Open' : 'Closed'}
                              </span>
                              <span className="text-gray-500 ml-2">
                                ({(mouthMovement.openness * 100).toFixed(0)}%)
                              </span>
                            </div>
                          )}

                          <div
                            className={`text-sm font-medium ${
                              lookingAway ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            {lookingAway
                              ? "🔴 Looking away from screen"
                              : "🟢 Looking at screen"}
                          </div>

                          {mouthMovement?.isTalking && (
                            <div className="text-sm font-medium text-red-600 bg-red-50 p-2 rounded border border-red-200">
                              🗣️ Talking/Speech Detected!
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  No faces detected in the current frame
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              {!modelLoaded 
                ? "Waiting for TensorFlow.js model to load..."
                : "No analysis data yet. Start the camera and wait for automatic analysis."
              }
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-500 text-center space-y-1">
        <div>
          Powered by TensorFlow.js BlazeFace model for accurate face detection
        </div>
        <div className="text-blue-600">
          Status: {cameraActive ? '🟢 Camera Active' : '🔴 Camera Inactive'} | 
          {modelLoaded ? ' 🧠 Model Loaded' : ' ⏳ Loading Model'} |
          {faceData ? ` ${faceData.length} face(s) detected` : ' No faces detected'} |
          {talkingDetected ? ' 🗣️ Talking Detected' : ' 🤐 Silent'}
        </div>
      </div>
    </div>
  );
};

export default TensorFlowFaceDetection;
