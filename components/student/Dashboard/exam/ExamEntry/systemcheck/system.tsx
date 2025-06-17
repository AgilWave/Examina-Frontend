"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SystemCheckupProps {
  onNext: () => void;
  onPrev: () => void;
}

interface CheckItem {
  id: string;
  label: string;
  status: "pending" | "checking" | "completed" | "failed";
  details?: string;
}

// List of browsers we consider fully supported
const SUPPORTED_BROWSERS = ["chrome", "firefox", "safari", "edge"];
// const REQUIRED_FEATURES = ['localStorage', 'sessionStorage', 'indexedDB', 'Blob'];

export function SystemCheckup({ onNext, onPrev }: SystemCheckupProps) {
  const [checks, setChecks] = useState<CheckItem[]>([
    {
      id: "browser",
      label: "Checking Your Browser",
      status: "pending",
    },
    {
      id: "support",
      label: "Checking if Your Web browser Fully Supported",
      status: "pending",
    },
  ]);

  const [allCompleted, setAllCompleted] = useState(false);
  const [browserName, setBrowserName] = useState<string>("");
  const [browserVersion, setBrowserVersion] = useState<string>("");

  // Detect browser name and version
  const detectBrowser = (): { name: string; version: string } => {
    const userAgent = navigator.userAgent;
    let name = "unknown";
    let version = "unknown";

    // Chrome
    if (userAgent.indexOf("Chrome") > -1) {
      name = "chrome";
      const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
      version = match ? match[1] : "";
    }
    // Safari
    else if (userAgent.indexOf("Safari") > -1) {
      name = "safari";
      const match = userAgent.match(/Version\/(\d+\.\d+)/);
      version = match ? match[1] : "";
    }
    // Firefox
    else if (userAgent.indexOf("Firefox") > -1) {
      name = "firefox";
      const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
      version = match ? match[1] : "";
    }
    // Edge
    else if (userAgent.indexOf("Edg") > -1) {
      name = "edge";
      const match = userAgent.match(/Edg\/(\d+\.\d+)/);
      version = match ? match[1] : "";
    }
    // Internet Explorer
    else if (
      userAgent.indexOf("MSIE") > -1 ||
      userAgent.indexOf("Trident/") > -1
    ) {
      name = "ie";
      const match = userAgent.match(/(?:MSIE |rv:)(\d+\.\d+)/);
      version = match ? match[1] : "";
    }

    return { name, version };
  };

  // Check required browser features
  const checkBrowserFeatures = (): {
    supported: boolean;
    missingFeatures: string[];
  } => {
    const missingFeatures: string[] = [];

    if (!window.localStorage) {
      missingFeatures.push("localStorage");
    }

    if (!window.sessionStorage) {
      missingFeatures.push("sessionStorage");
    }

    if (!window.indexedDB) {
      missingFeatures.push("indexedDB");
    }

    if (!window.Blob) {
      missingFeatures.push("Blob");
    }

    // Add additional checks for camera/microphone if needed
    // if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    //   missingFeatures.push('Camera/Microphone Access');
    // }

    return {
      supported: missingFeatures.length === 0,
      missingFeatures,
    };
  };

  useEffect(() => {
    // Start the checking process
    const startChecking = async () => {
      // Check browser first
      setChecks((prev) =>
        prev.map((check) =>
          check.id === "browser" ? { ...check, status: "checking" } : check
        )
      );

      // Small delay to show the checking animation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Actually detect the browser
      const { name, version } = detectBrowser();
      setBrowserName(name);
      setBrowserVersion(version);

      const formattedBrowserName = name.charAt(0).toUpperCase() + name.slice(1);

      setChecks((prev) =>
        prev.map((check) =>
          check.id === "browser"
            ? {
                ...check,
                status: "completed",
                details: `${formattedBrowserName} ${version}`,
              }
            : check
        )
      );

      // Then check browser features and compatibility
      setChecks((prev) =>
        prev.map((check) =>
          check.id === "support" ? { ...check, status: "checking" } : check
        )
      );

      // Small delay to show the checking animation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check browser features
      const { supported, missingFeatures } = checkBrowserFeatures();
      const isSupportedBrowser = SUPPORTED_BROWSERS.includes(name);

      let supportStatus: "completed" | "failed" = "completed";
      let supportDetails = "Your browser is fully supported";

      if (!isSupportedBrowser) {
        supportStatus = "failed";
        supportDetails = `${formattedBrowserName} is not on our list of fully supported browsers. We recommend using Chrome, Firefox, Edge, or Safari for the best experience.`;
      } else if (!supported) {
        supportStatus = "failed";
        supportDetails = `Missing required features: ${missingFeatures.join(
          ", "
        )}`;
      }

      setChecks((prev) =>
        prev.map((check) =>
          check.id === "support"
            ? {
                ...check,
                status: supportStatus,
                details: supportDetails,
              }
            : check
        )
      );

      // Set all completed to true regardless of failed checks so user can proceed
      setAllCompleted(true);
    };

    startChecking();
  }, []);

  return (
    <div className="text-center space-y-8 bg-white dark:bg-black px-4 sm:px-6 py-6 sm:py-8 rounded-xl">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-black dark:text-white">System Checkup</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Checking Your Browser's Settings
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-12 sm:space-y-14 py-4">
        {checks.map((check, index) => (
          <div key={check.id} className="flex items-center space-x-4 relative">
            <div className="flex-shrink-0">
              {check.status === "completed" ? (
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-500 rounded-full flex items-center justify-center shadow-md shadow-teal-500/30">
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              ) : check.status === "checking" ? (
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-500 rounded-full flex items-center justify-center shadow-md shadow-teal-500/30">
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-spin" />
                </div>
              ) : check.status === "failed" ? (
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-md shadow-amber-500/30">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center shadow-md">
                  <div className="w-3 h-3 bg-gray-400 rounded-full" />
                </div>
              )}
            </div>
            
            {/* Improved connecting line with animation */}
            {index < checks.length - 1 && (
              <div className="absolute left-4 sm:left-5 top-[calc(100%+0.25rem)] h-[calc(12px+2.5rem)] w-0.5 bg-gray-300 dark:bg-gray-600 overflow-hidden">
                <div
                  className={cn(
                    "h-full w-full bg-gradient-to-b from-teal-400 to-teal-500 -translate-y-full transition-transform duration-700 ease-out",
                    check.status === "completed" && "translate-y-0"
                  )}
                  style={{
                    transitionDelay: check.status === "completed" ? "300ms" : "0ms"
                  }}
                />
              </div>
            )}

            <div className="flex-1 text-left ml-3 sm:ml-5">
              <p
                className={cn(
                  "text-base sm:text-lg font-medium transition-colors duration-300",
                  check.status === "completed"
                    ? "text-black dark:text-white"
                    : check.status === "checking"
                    ? "text-teal-600 dark:text-teal-400"
                    : check.status === "failed"
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-gray-600 dark:text-gray-400"
                )}
              >
                {check.label}
                {check.details && (
                  <span className="block text-sm mt-2 text-gray-600 dark:text-gray-400">{check.details}</span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <div className="pt-8">
        <Button
          onClick={onNext}
          disabled={!allCompleted}
          size="lg"
          className={cn(
            "px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 shadow-lg",
            allCompleted
              ? "bg-teal-500 hover:bg-teal-600 text-white hover:scale-105 shadow-teal-500/25"
              : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          )}
        >
          Continue
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 ml-2"
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
      </div>
    </div>
  );
}
