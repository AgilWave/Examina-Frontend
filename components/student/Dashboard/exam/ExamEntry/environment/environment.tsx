"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Video } from "lucide-react";
import { useTheme } from "next-themes";

interface EnvironmentCheckupProps {
  onNext: () => void;
  onPrev: () => void;
}

export function EnvironmentCheckup({
  onNext,
  onPrev,
}: EnvironmentCheckupProps) {
  const { theme } = useTheme();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      alert(`File uploaded: ${file.name}`);
    }
  };

  const handleRecord = () => {
    alert('Recording started... (mock)');
  };
  return (
    <div className="text-center space-y-8 w-full max-w-6xl mx-auto px-4">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold dark:text-white text-gray-900">Environment Checkup</h1>
        <p className="dark:text-gray-400 text-gray-600 text-lg">Checking your Environment</p>
      </div>

      {/* Upload and Record Cards - Centered and Responsive */}
      <div className="flex justify-center w-full">
        <div className="w-full max-w-2xl dark:bg-zinc-900 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Upload */}
            <label
              htmlFor="upload"
              className="w-full dark:bg-zinc-800 bg-white dark:hover:bg-zinc-700 hover:bg-gray-50 
                        cursor-pointer rounded-lg flex flex-col items-center justify-center p-4 sm:p-6 space-y-2 
                        transition border dark:border-zinc-700 border-gray-200"
            >
              <Upload className="w-8 h-8 text-teal-400" />
              <span className="dark:text-white text-gray-900 font-semibold">Upload</span>
              <span className="text-sm dark:text-gray-400 text-gray-600 text-center">
                Upload your environment snapshots here
              </span>
              <input
                id="upload"
                type="file"
                className="hidden"
                onChange={handleUpload}
              />
            </label>

            {/* Record */}
            <div
              onClick={handleRecord}
              className="w-full dark:bg-zinc-800 bg-white dark:hover:bg-zinc-700 hover:bg-gray-50 
                      cursor-pointer rounded-lg flex flex-col items-center justify-center p-4 sm:p-6 space-y-2 
                      transition border dark:border-zinc-700 border-gray-200"
            >
              <Video className="w-8 h-8 text-teal-400" />
              <span className="dark:text-white text-gray-900 font-semibold">Record</span>
              <span className="text-sm dark:text-gray-400 text-gray-600 text-center">
                Record your environment here
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="pt-4">
        <Button
          onClick={onNext}
          size="lg"
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 sm:px-8 py-2 sm:py-3 
                   rounded-xl font-medium transition-all duration-300 hover:scale-105 
                   shadow-lg shadow-teal-500/25"
        >
          Continue
          <svg
            className="w-5 h-5 ml-2"
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
