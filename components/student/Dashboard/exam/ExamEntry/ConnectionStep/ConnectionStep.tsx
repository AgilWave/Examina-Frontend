"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import styles from "./ConnectionStep.module.css";

interface ConnectionStepProps {
  onNext: () => void;
  onPrev: () => void;
}

export function ConnectionStep({ onNext }: ConnectionStepProps) {
  const [connectionStrength, setConnectionStrength] = useState(0);
  const [isChecking, setIsChecking] = useState(true);
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [connectionStatus, setConnectionStatus] = useState("Checking...");

  useEffect(() => {
    // Function to check internet connection speed and reliability
    const checkConnection = async () => {
      setIsChecking(true);

      try {
        // Check if navigator is online
        if (!navigator.onLine) {
          setConnectionStatus("No connection");
          setConnectionStrength(0);
          setIsChecking(false);
          return;
        }

        // Try to fetch a small resource to test connection
        const startTime = new Date().getTime();
        try {
          // Fetch with a cache buster to prevent cached 
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const response = await fetch(
            `https://www.google.com/favicon.ico?nocache=${startTime}`,
            {
              mode: "no-cors",
              cache: "no-store",
            }
          );

          const endTime = new Date().getTime();
          const latency = endTime - startTime;

          // Determine connection strength based on latency
          let strength = 5; // Excellent by default

          if (latency > 1000) {
            strength = 1; // Very poor
            setConnectionStatus("Poor connection");
          } else if (latency > 500) {
            strength = 2; // Poor
            setConnectionStatus("Fair connection");
          } else if (latency > 300) {
            strength = 3; // Fair
            setConnectionStatus("Good connection");
          } else if (latency > 100) {
            strength = 4; // Good
            setConnectionStatus("Very good connection");
          } else {
            strength = 5; // Excellent
            setConnectionStatus("Excellent connection");
          }

          setConnectionStrength(strength);
        } catch (error) {
          console.error("Connection test failed:", error);
          setConnectionStatus("Connection issues detected");
          setConnectionStrength(1);
        }
      } catch (e) {
        console.error("Error checking connection:", e);
        setConnectionStatus("Unable to check connection");
        setConnectionStrength(0);
      } finally {
        setIsChecking(false);
      }
    };

    // Initial check
    checkConnection();

    // Periodically check connection
    const intervalCheck = setInterval(checkConnection, 10000);

    // Also check when online/offline status changes
    window.addEventListener("online", checkConnection);
    window.addEventListener("offline", checkConnection);

    return () => {
      clearInterval(intervalCheck);
      window.removeEventListener("online", checkConnection);
      window.removeEventListener("offline", checkConnection);
    };  }, []); 
  
  // Network scanning animation with computer nodes
  const NetworkAnimation = () => {
    // Colors based on connection strength
    const getStrengthColor = () => {
      if (connectionStrength >= 5) return "teal";
      if (connectionStrength >= 4) return "emerald";
      if (connectionStrength >= 3) return "yellow";
      if (connectionStrength >= 2) return "amber";
      if (connectionStrength >= 1) return "orange";
      return "red";
    };

    const color = getStrengthColor();

    return (
      <div className="relative h-full w-full flex items-center justify-center">
        {isChecking ? (
          // Scanning Animation - Only visible during checking
          <motion.div
            className="relative w-full h-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Central computer node */}
            <div className="relative z-30">
              <div className="w-16 h-12 bg-white dark:bg-card rounded-md border-t-2 border-bg-gray-200 dark:border-bg-card"></div>
              <div className="w-20 h-2 bg-gray-200 dark:bg-card mx-auto mt-1 rounded-b-md"></div>

              {/* Computer screen with pulse */}
              <div className="w-14 h-8 bg-gray-100 dark:bg-card rounded-sm mx-auto mt-[-10px] border border-gray-200 dark:border-bg-card overflow-hidden flex items-center justify-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full opacity-50",
                    styles.computerNode
                  )}
                >
                  <div className="w-full h-full bg-gradient-radial from-teal-500/30 to-transparent"></div>
                </div>
              </div>
            </div>

            {/* Circular scanner */}
            <div
              className={cn(
                "absolute w-44 h-44 rounded-full border-2 border-gray-300 dark:border-gray-700",
                styles.scanningAnimation
              )}
            >
              <div className="absolute top-[50%] left-[50%] w-full h-[1px] bg-transparent">
                <div className="absolute top-0 right-0 w-8 h-1 bg-teal-500 rounded-full blur-[2px]"></div>
              </div>
            </div>

            {/* Radar circles */}
            <div className="absolute w-60 h-60 rounded-full border border-gray-300 dark:border-gray-800"></div>
            <div className="absolute w-44 h-44 rounded-full border border-gray-300 dark:border-gray-800"></div>
            <div className="absolute w-28 h-28 rounded-full border border-gray-300 dark:border-gray-800"></div>

            {/* Radar waves */}
            <div
              className={cn(
                "absolute w-60 h-60 rounded-full border border-teal-500/30",
                styles.radarAnimation
              )}
            ></div>

            {/* Network nodes */}
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (Math.PI * 2 * i) / 6;
              const distance = 60 + Math.random() * 30;
              const size = 4 + Math.random() * 4;
              const delay = i * 0.5;

              return (
                <motion.div
                  key={i}
                  className={cn(
                    "absolute w-3 h-3 rounded-full z-10",
                    styles.floatingNode
                  )}
                  style={{
                    top: `calc(50% - ${Math.sin(angle) * distance}px)`,
                    left: `calc(50% - ${Math.cos(angle) * distance}px)`,
                    width: `${size}px`,
                    height: `${size}px`,
                    background: `rgb(45, 212, 191, ${
                      0.3 + Math.random() * 0.5
                    })`,
                    boxShadow: "0 0 8px rgba(45, 212, 191, 0.5)",
                    animationDelay: `${delay}s`,
                  }}
                />
              );
            })}

            {/* Data transmission indicators */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (Math.PI * 2 * i) / 8;
              const length = 20 + Math.random() * 30;
              const width = 1 + Math.random() * 1;
              const delay = i * 0.2;

              return (
                <div
                  key={`data-${i}`}
                  className={cn(
                    "absolute bg-teal-500/50 rounded-full",
                    styles.dataPulse
                  )}
                  style={{
                    height: "2px",
                    width: `${length}px`,
                    transform: `rotate(${(angle * 180) / Math.PI}deg)`,
                    transformOrigin: "center left",
                    left: "50%",
                    top: "50%",
                    animationDelay: `${delay}s`,
                  }}
                />
              );
            })}
          </motion.div>
        ) : (
          // Network Graph - Shows after checking is complete
          <motion.div
            className="relative w-full h-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Central computer node */}
            <div className="relative z-20">
              <div className="w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded-md border-t-2 border-gray-300 dark:border-gray-600"></div>
              <div className="w-20 h-2 bg-gray-300 dark:bg-gray-800 mx-auto mt-1 rounded-b-md"></div>

              {/* Computer screen with strength indicator */}
              <div className="w-14 h-8 bg-gray-100 dark:bg-gray-900 rounded-sm mx-auto mt-[-10px] border border-gray-300 dark:border-gray-800 overflow-hidden flex items-center justify-center">
                <div
                  className={`w-8 h-8 rounded-full bg-${color}-500/80 animate-pulse`}
                ></div>
              </div>
            </div>

            {/* Network nodes with strength visualization */}
            {Array.from({ length: connectionStrength }).map((_, i) => {
              const angle = (Math.PI * 2 * i) / 5;
              const distance = 50;

              return (
                <div key={i} className="absolute">
                  {/* Node */}
                  <motion.div
                    className={`absolute w-5 h-5 rounded-full bg-${color}-500/80 z-10`}
                    style={{
                      top: `${Math.sin(angle) * distance}px`,
                      left: `${Math.cos(angle) * distance}px`,
                      boxShadow: `0 0 10px ${
                        color === "teal"
                          ? "rgba(20, 184, 166, 0.7)"
                          : color === "emerald"
                          ? "rgba(16, 185, 129, 0.7)"
                          : color === "yellow"
                          ? "rgba(234, 179, 8, 0.7)"
                          : color === "amber"
                          ? "rgba(245, 158, 11, 0.7)"
                          : color === "orange"
                          ? "rgba(249, 115, 22, 0.7)"
                          : "rgba(239, 68, 68, 0.7)"
                      }`,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: i * 0.1,
                      duration: 0.3,
                      type: "spring",
                    }}
                  />

                  {/* Connection line */}
                  <motion.div
                    className={`absolute h-[2px] bg-gradient-to-r from-${color}-500/80 to-transparent z-0`}
                    style={{
                      width: `${distance}px`,
                      transformOrigin: "left center",
                      transform: `rotate(${angle}rad)`,
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                  />
                </div>
              );
            })}

            {/* Strength indicator rings */}
            {Array.from({ length: 3 }).map((_, i) => {
              const size = (i + 1) * 20;
              const isActive = i < Math.ceil(connectionStrength / 2);

              return (
                <motion.div
                  key={`ring-${i}`}
                  className={cn(
                    "absolute rounded-full border-2 z-0 opacity-20",
                    isActive ? `border-${color}-500` : "border-gray-300 dark:border-gray-600"
                  )}
                  style={{
                    width: `${size * 2}px`,
                    height: `${size * 2}px`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: isActive ? 0.2 : 0.1 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                />
              );
            })}

            {/* Data packet animations */}
            {connectionStrength > 0 &&
              Array.from({ length: connectionStrength }).map((_, i) => {
                const angle = (Math.PI * 2 * i) / 5;
                const distance = 50;

                return (
                  <motion.div
                    key={`packet-${i}`}
                    className={`absolute w-2 h-2 rounded-full bg-${color}-500 z-20`}
                    animate={{
                      x: [0, Math.cos(angle) * distance],
                      y: [0, Math.sin(angle) * distance],
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                      delay: i * 0.3,
                      ease: "easeInOut",
                    }}
                  />
                );
              })}
          </motion.div>
        )}

        {/* Connection strength legend */}
        {!isChecking && (
          <div className="absolute bottom-2 right-2 bg-gray-100/50 dark:bg-gray-900/50 px-2 py-1 rounded text-xs flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full bg-${color}-500`}></div>
            <span className={`text-${color}-500`}>{connectionStrength}/5</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="text-center space-y-8">
      {" "}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-black dark:text-white">Network Check</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {isChecking
            ? "Analyzing your computer network..."
            : connectionStrength > 0
            ? "Network check complete"
            : "Network issues detected"}
        </p>
      </motion.div>
      <div className="max-w-md mx-auto">
        {/* Network Animation Container */}
        <motion.div
          className="bg-white dark:bg-card rounded-2xl p-6 shadow-2xl relative h-64"
          initial={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
          animate={{
            boxShadow: isChecking
              ? "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 0 15px rgba(45, 212, 191, 0.3) inset"
              : "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
          }}
          transition={{
            duration: 1,
            repeat: isChecking ? Infinity : 0,
            repeatType: "reverse",
          }}
        >
          <NetworkAnimation />

          {/* Digital grid lines */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(45,212,191,0.05)_1px,transparent_1px)] bg-[size:10px_10px] opacity-20 rounded-2xl"></div>

          {/* Status text overlay */}
          {isChecking && (
            <motion.div
              className="absolute top-2 left-0 right-0 text-center text-xs text-teal-400 font-mono tracking-wider"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              SCANNING NETWORK...
            </motion.div>
          )}
        </motion.div>

        {/* Connection Status */}
        <div className="mt-6 space-y-2">
          {isChecking ? (
            <motion.div
              className="flex items-center justify-center space-x-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="text-sm text-teal-400 font-medium">
                Analyzing connection...
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="flex items-center justify-center space-x-2 text-teal-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm font-medium">
                Connection strength: {connectionStrength}/5
              </span>
            </motion.div>
          )}
        </div>
      </div>{" "}
      {/* Connection Info */}
      <motion.div
        className="max-w-md mx-auto text-sm text-gray-600 dark:text-gray-500 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: !isChecking ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {!isChecking && (
          <>
            <motion.p
              className="mb-3"
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {connectionStrength >= 4
                ? "Your network performance is excellent and ready for the exam."
                : connectionStrength >= 2
                ? "Your network may be sufficient but could experience occasional interruptions."
                : "Your network is unstable. Please check your connection before proceeding."}
            </motion.p>

            <motion.div
              className="grid grid-cols-2 gap-3 p-4 bg-white dark:bg-card backdrop-blur-sm rounded-lg mb-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="text-center p-2 rounded-lg bg-gray-100 dark:bg-black/70">
                <p className="text-black dark:text-white text-xs mb-1">Stability</p>
                <div
                  className={cn(
                    "font-medium text-lg flex items-center justify-center",
                    connectionStrength >= 4
                      ? styles.strengthExcellent
                      : connectionStrength >= 2
                      ? "text-yellow-500"
                      : "text-red-500"
                  )}
                >
                  {connectionStrength >= 4 ? (
                    <>
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Good
                    </>
                  ) : connectionStrength >= 2 ? (
                    <>
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      Fair
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Poor
                    </>
                  )}
                </div>
              </div>

              <div className="text-center p-2 rounded-lg bg-gray-100 dark:bg-black/70">
                <p className="text-black dark:text-white text-xs mb-1">Performance</p>
                <div className="font-medium">
                  <div className="flex items-center justify-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-1.5 h-5 rounded-full",
                          i < connectionStrength
                            ? connectionStrength >= 4
                              ? "bg-teal-500"
                              : connectionStrength >= 2
                              ? "bg-yellow-500"
                              : "bg-red-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        )}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>{" "}
      {/* Continue Button */}
      <motion.div
        className="pt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: !isChecking ? 1 : 0, y: !isChecking ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Button
          onClick={onNext}
          disabled={isChecking || connectionStrength < 1}
          size="lg"
          className={cn(
            "px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg relative overflow-hidden group",
            isChecking || connectionStrength < 1
              ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : "bg-teal-500 hover:bg-teal-600 text-white hover:scale-105 shadow-teal-500/25"
          )}
        >
          {/* Button background animation */}
          {!isChecking && connectionStrength >= 1 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 200, opacity: 1 }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
            />
          )}

          <span className="relative z-10 flex items-center">
            Continue
            <svg
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
          </span>
        </Button>

        {connectionStrength < 1 && !isChecking && (
          <motion.p
            className="text-red-500 text-xs mt-2 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <svg
              className="w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            A working network connection is required to proceed
          </motion.p>
        )}

        {connectionStrength >= 1 && connectionStrength < 3 && !isChecking && (
          <motion.p
            className="text-yellow-500 text-xs mt-2 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <svg
              className="w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Your connection may be unstable during the exam
          </motion.p>
        )}
      </motion.div>
    </div>  );
}