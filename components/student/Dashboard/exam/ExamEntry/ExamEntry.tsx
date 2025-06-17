// // 'use client'

// // import { useState } from "react"
// // import { MicCameraStep } from "./MicCameraStep/MicCameraStep"
// // import { ConnectionStep } from "./ConnectionStep/ConnectionStep"

// // export default function EntryExamPage() {
// //   const [step, setStep] = useState(1)

// //   const nextStep = () => setStep((prev) => prev + 1)

// //   return (
// //     <>
// //       {step === 1 && <MicCameraStep onContinue={nextStep} />}
// //       {step === 2 && <ConnectionStep onContinue={nextStep} />}
// //       {/* Step 3, 4, 5 will go here */}
// //     </>
// //   )
// // }

// // 'use client'

// // import React, { useState, useRef, useEffect } from 'react';
// // import { Camera, Mic, MicOff, Video, VideoOff, Maximize2 } from 'lucide-react';
// // import { Button } from '@/components/ui/button';
// // import { Alert, AlertDescription } from '@/components/ui/alert';

// // const ExamCameraSetup = () => {
// //   const [currentStep, setCurrentStep] = useState(1);
// //   const [isCameraOn, setIsCameraOn] = useState(false);
// //   const [isMicOn, setIsMicOn] = useState(false);
// //   const [stream, setStream] = useState<MediaStream | null>(null);
// //   const [error, setError] = useState<string>('');
// //   const [isFullscreen, setIsFullscreen] = useState(false);
// //   const videoRef = useRef<HTMLVideoElement>(null);
// //   const containerRef = useRef<HTMLDivElement>(null);

// //   const totalSteps = 5;

// //   useEffect(() => {
// //     // Auto-start camera and mic when component mounts
// //     startMediaDevices();

// //     return () => {
// //       // Cleanup when component unmounts
// //       if (stream) {
// //         stream.getTracks().forEach(track => track.stop());
// //       }
// //     };
// //   }, []);

// //   const startMediaDevices = async () => {
// //     try {
// //       setError('');
// //       const mediaStream = await navigator.mediaDevices.getUserMedia({
// //         video: {
// //           width: { ideal: 1280 },
// //           height: { ideal: 720 },
// //           facingMode: 'user'
// //         },
// //         audio: true
// //       });

// //       setStream(mediaStream);
// //       setIsCameraOn(true);
// //       setIsMicOn(true);

// //       if (videoRef.current) {
// //         videoRef.current.srcObject = mediaStream;
// //       }
// //     } catch (err: any) {
// //       console.error('Error accessing media devices:', err);
// //       setError('Unable to access camera and microphone. Please ensure you have granted permissions and try again.');
// //     }
// //   };

// //   const toggleCamera = async () => {
// //     if (!stream) return;

// //     const videoTrack = stream.getVideoTracks()[0];
// //     if (videoTrack) {
// //       if (isCameraOn) {
// //         videoTrack.stop();
// //         setIsCameraOn(false);
// //       } else {
// //         try {
// //           const newStream = await navigator.mediaDevices.getUserMedia({
// //             video: {
// //               width: { ideal: 1280 },
// //               height: { ideal: 720 },
// //               facingMode: 'user'
// //             },
// //             audio: isMicOn
// //           });

// //           const newVideoTrack = newStream.getVideoTracks()[0];
// //           stream.removeTrack(videoTrack);
// //           stream.addTrack(newVideoTrack);

// //           if (videoRef.current) {
// //             videoRef.current.srcObject = stream;
// //           }
// //           setIsCameraOn(true);
// //         } catch (err) {
// //           setError('Failed to restart camera');
// //         }
// //       }
// //     }
// //   };

// //   const toggleMic = () => {
// //     if (!stream) return;

// //     const audioTrack = stream.getAudioTracks()[0];
// //     if (audioTrack) {
// //       audioTrack.enabled = !audioTrack.enabled;
// //       setIsMicOn(audioTrack.enabled);
// //     }
// //   };

// //   const toggleFullscreen = () => {
// //     if (!document.fullscreenElement) {
// //       containerRef.current?.requestFullscreen();
// //       setIsFullscreen(true);
// //     } else {
// //       document.exitFullscreen();
// //       setIsFullscreen(false);
// //     }
// //   };

// //   const handleContinue = () => {
// //     if (currentStep < totalSteps) {
// //       setCurrentStep(currentStep + 1);
// //     }
// //   };

// //   const renderStepIndicators = () => {
// //     return (
// //       <div className="flex items-center justify-center space-x-3 mb-8">
// //         {Array.from({ length: totalSteps }, (_, index) => (
// //           <div
// //             key={index + 1}
// //             className={`w-3 h-3 rounded-full ${
// //               index + 1 === currentStep
// //                 ? 'bg-teal-500'
// //                 : index + 1 < currentStep
// //                 ? 'bg-teal-300'
// //                 : 'bg-gray-600'
// //             }`}
// //           />
// //         ))}
// //       </div>
// //     );
// //   };

// //   return (
// //     <div
// //       ref={containerRef}
// //       className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6"
// //     >
// //       {renderStepIndicators()}

// //       <div className="text-center mb-8">
// //         <h1 className="text-2xl font-semibold mb-2">Mic & Camera Setting</h1>
// //         <p className="text-gray-400">Please turn on your mic and camera</p>
// //       </div>

// //       {error && (
// //         <Alert className="mb-6 max-w-md bg-red-900 border-red-700">
// //           <AlertDescription className="text-red-200">
// //             {error}
// //           </AlertDescription>
// //         </Alert>
// //       )}

// //       <div className="relative bg-gray-800 rounded-lg overflow-hidden mb-6 w-full max-w-2xl aspect-video">
// //         {isCameraOn && stream ? (
// //           <video
// //             ref={videoRef}
// //             autoPlay
// //             playsInline
// //             muted
// //             className="w-full h-full object-cover"
// //           />
// //         ) : (
// //           <div className="w-full h-full flex items-center justify-center bg-gray-700">
// //             <div className="text-center">
// //               <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
// //               <p className="text-gray-400">Camera is off</p>
// //             </div>
// //           </div>
// //         )}

// //         {/* Audio level indicator */}
// //         {isMicOn && (
// //           <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black bg-opacity-50 rounded-full px-3 py-1">
// //             <Mic className="w-4 h-4 text-green-400" />
// //             <div className="w-12 h-2 bg-gray-600 rounded-full overflow-hidden">
// //               <div className="h-full bg-green-400 rounded-full animate-pulse" style={{ width: '60%' }}></div>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* Control buttons */}
// //       <div className="flex items-center space-x-4 mb-8">
// //         <Button
// //           onClick={toggleCamera}
// //           variant="outline"
// //           size="lg"
// //           className={`rounded-full p-4 border-2 ${
// //             isCameraOn
// //               ? 'border-teal-500 bg-teal-500 hover:bg-teal-600'
// //               : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
// //           }`}
// //         >
// //           {isCameraOn ? (
// //             <Video className="w-6 h-6" />
// //           ) : (
// //             <VideoOff className="w-6 h-6" />
// //           )}
// //         </Button>

// //         <Button
// //           onClick={toggleMic}
// //           variant="outline"
// //           size="lg"
// //           className={`rounded-full p-4 border-2 ${
// //             isMicOn
// //               ? 'border-teal-500 bg-teal-500 hover:bg-teal-600'
// //               : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
// //           }`}
// //         >
// //           {isMicOn ? (
// //             <Mic className="w-6 h-6" />
// //           ) : (
// //             <MicOff className="w-6 h-6" />
// //           )}
// //         </Button>

// //         <Button
// //           onClick={toggleFullscreen}
// //           variant="outline"
// //           size="lg"
// //           className="rounded-full p-4 border-2 border-gray-600 bg-gray-700 hover:bg-gray-600"
// //         >
// //           <Maximize2 className="w-6 h-6" />
// //         </Button>
// //       </div>

// //       {/* Continue button */}
// //       <Button
// //         onClick={handleContinue}
// //         disabled={!isCameraOn || !isMicOn}
// //         className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
// //       >
// //         Continue →
// //       </Button>

// //       {(!isCameraOn || !isMicOn) && (
// //         <p className="text-sm text-gray-400 mt-4 text-center max-w-md">
// //           Please enable both camera and microphone to continue with the exam setup.
// //         </p>
// //       )}
// //     </div>
// //   );
// // };

// // export default ExamCameraSetup;

// // app/entry-exam/page.tsx
// "use client";

// import { useState } from 'react';
// import { Mic, Video, Check } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';

// export default function EntryExam() {
//   const [step, setStep] = useState(1);
//   const [micEnabled, setMicEnabled] = useState(false);
//   const [cameraEnabled, setCameraEnabled] = useState(false);

//   const toggleMic = () => setMicEnabled(!micEnabled);
//   const toggleCamera = () => setCameraEnabled(!cameraEnabled);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center p-4">
//       <Card className="w-full max-w-md shadow-lg rounded-2xl border-teal-200">
//         <CardHeader className="border-b border-teal-100">
//           <CardTitle className="text-teal-700 flex items-center gap-2">
//             {step === 1 ? (
//               <>
//                 <Mic className="w-5 h-5" /> Mic & Camera Setting
//               </>
//             ) : (
//               <>
//                 <Video className="w-5 h-5" /> Connection Setup
//               </>
//             )}
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="p-6">
//           {step === 1 ? (
//             <div className="space-y-8">
//               <div className="text-center py-4">
//                 <p className="text-gray-600 mb-8">
//                   Please turn on your mic and camera
//                 </p>

//                 <div className="flex justify-center gap-10">
//                   <DeviceButton
//                     enabled={micEnabled}
//                     onClick={toggleMic}
//                     icon={Mic}
//                     label="Microphone"
//                   />
//                   <DeviceButton
//                     enabled={cameraEnabled}
//                     onClick={toggleCamera}
//                     icon={Video}
//                     label="Camera"
//                   />
//                 </div>
//               </div>

//               <Button
//                 className="w-full bg-teal-600 hover:bg-teal-700 py-6 text-lg"
//                 onClick={() => setStep(2)}
//                 disabled={!micEnabled || !cameraEnabled}
//               >
//                 Continue
//               </Button>
//             </div>
//           ) : (
//             <ConnectionStep onContinue={() => console.log("Proceeding to next step...")} />
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// // Device Button Component
// const DeviceButton = ({
//   enabled,
//   onClick,
//   icon: Icon,
//   label
// }: {
//   enabled: boolean;
//   onClick: () => void;
//   icon: React.ComponentType<{ className?: string }>;
//   label: string;
// }) => (
//   <button
//     onClick={onClick}
//     className={`flex flex-col items-center justify-center p-4 rounded-full w-24 h-24 transition-all ${
//       enabled
//         ? 'bg-teal-100 border-2 border-teal-500 text-teal-700'
//         : 'bg-gray-100 border-2 border-gray-300 text-gray-500'
//     }`}
//   >
//     <div className="relative">
//       <Icon className="w-10 h-10 mb-2" />
//       {enabled && (
//         <Check className="absolute -top-1 -right-1 bg-teal-500 text-white rounded-full p-1 w-5 h-5" />
//       )}
//     </div>
//     <span className="text-sm mt-1">{label}</span>
//   </button>
// );

// // Connection Step Component
// const ConnectionStep = ({ onContinue }: { onContinue: () => void }) => {
//   const [connectionStatus, setConnectionStatus] = useState<'checking' | 'success'>('checking');

//   // Simulate connection check
//   setTimeout(() => {
//     setConnectionStatus('success');
//   }, 2000);

//   return (
//     <div className="space-y-8">
//       <div className="text-center py-4">
//         <div className="flex justify-center mb-6">
//           <div className="relative">
//             <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
//               {connectionStatus === 'checking' ? (
//                 <div className="w-8 h-8 border-t-2 border-teal-600 rounded-full animate-spin"></div>
//               ) : (
//                 <Check className="w-10 h-10 text-teal-600" />
//               )}
//             </div>
//           </div>
//         </div>

//         <p className="text-gray-600 mb-2">
//           {connectionStatus === 'checking'
//             ? "Checking your Internet connection..."
//             : "Connection verified successfully!"}
//         </p>
//         <p className="text-sm text-gray-500">
//           {connectionStatus === 'checking'
//             ? "This may take a few seconds"
//             : "Your connection is stable and secure"}
//         </p>
//       </div>

//       <Button
//         className="w-full bg-teal-600 hover:bg-teal-700 py-6 text-lg flex justify-between items-center"
//         onClick={onContinue}
//         disabled={connectionStatus === 'checking'}
//       >
//         Continue
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//           <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//         </svg>
//       </Button>
//     </div>
//   );
// };

"use client";

import { useState } from "react";
import { StepIndicator } from "./Stepper/Stepper";
import { MicCameraSetup } from "./MicCameraStep/MicCameraStep";
import { ConnectionStep } from "./ConnectionStep/ConnectionStep";
import { SystemCheckup } from "./systemcheck/system";
import { EnvironmentCheckup } from "./environment/environment";
import { DataManagement } from "./welcome/welcome";

export default function ExamSetupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <MicCameraSetup onNext={handleNextStep} />;
      case 2:
        return (
          <ConnectionStep onNext={handleNextStep} onPrev={handlePrevStep} />
        );
      case 3:
        return (
          <SystemCheckup onNext={handleNextStep} onPrev={handlePrevStep} />
        );
      case 4:
        return (
          <EnvironmentCheckup onNext={handleNextStep} onPrev={handlePrevStep} />
        );
      case 5:
        return (
          <DataManagement
            onPrev={() => console.log("Back clicked")}
          />
        );
      default:
        return (
          <div className="text-center text-white">
            Step {currentStep} - Coming Soon
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        <div className="mt-12">{renderCurrentStep()}</div>
      </div>
    </div>
  );
}
