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
