import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Camera,
  Mic,
  Wifi,
  Lock,
  Image,
  ShieldCheck,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setCreateExamWebcamRequired,
  setCreateExamMicRequired,
  setCreateExamNetworkStrengthTest,
  setCreateExamLockdownBrowser,
  setCreateExamSurroundingEnvironmentCheck,
} from "@/redux/features/examSlice";

export default function SecuritySettings() {
  const dispatch = useDispatch();
  const examState = useSelector((state: RootState) => state.exam.createExam);

  const settings = [
    {
      key: "webcam",
      label: "Webcam Required",
      description: "Students must have a working camera to take the exam.",
      Icon: Camera,
      value: examState.webcamRequired,
      action: setCreateExamWebcamRequired,
    },
    {
      key: "mic",
      label: "Microphone Required",
      description: "Students must have a working microphone to take the exam.",
      Icon: Mic,
      value: examState.micRequired,
      action: setCreateExamMicRequired,
    },
    {
      key: "network",
      label: "Network Strength Test",
      description: "Test student's internet connection before starting the exam.",
      Icon: Wifi,
      value: examState.networkStrengthTest,
      action: setCreateExamNetworkStrengthTest,
    },
    {
      key: "lock",
      label: "Lock Browser / Full Screen Mode",
      description: "Prevent students from opening other applications or tabs during the exam.",
      Icon: Lock,
      value: examState.lockdownBrowser,
      action: setCreateExamLockdownBrowser,
    },
    {
      key: "surroundings",
      label: "Surroundings Photo Required",
      description: "Students must take a photo of their surroundings before starting the exam.",
      Icon: Image,
      value: examState.surroundingEnvironmentCheck,
      action: setCreateExamSurroundingEnvironmentCheck,
    },
  ] as const;

  return (
    <div className="p-4 md:p-6 border rounded-xl md:rounded-2xl shadow-md bg-white dark:bg-card dark:border-black/20 w-full space-y-4 md:space-y-6">
      {/* Heading */}
      <div className="flex items-center gap-2 md:gap-3">
        <ShieldCheck
          className="text-teal-600 bg-teal-500/20 p-1.5 md:p-2 rounded-full"
          size={40}
        />
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-black dark:text-white">
            Security Settings
          </h2>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            Set up security measures for the exam
          </p>
        </div>
      </div>

      {/* Toggle Cards */}
      <div className="space-y-3 md:space-y-4">
        {settings.map(({ key, label, description, Icon, value, action }, idx) => (
          <div
            key={key}
            className={`flex flex-row items-center justify-between px-3 md:px-4 py-3 md:py-4 rounded-lg md:rounded-xl shadow-sm border ${
              value ? "border-teal-600" : "border-gray-200 dark:border-gray-700"
            } ${
              idx === 0 ? "bg-gray-50 dark:bg-card" : "bg-gray-50 dark:bg-card"
            }`}
          >
            <div className="flex items-start gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 rounded-full bg-teal-100 dark:bg-teal-500/10 flex-shrink-0">
                <Icon
                  size={18}
                  className={
                    value
                      ? "text-teal-600 dark:text-teal-600"
                      : "text-gray-400 dark:text-gray-500"
                  }
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs sm:text-sm font-medium text-black dark:text-white">
                  {label}
                </Label>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 pr-2">
                  {description}
                </p>
              </div>
            </div>
            <div className="flex items-center ml-2 self-center">
              <Switch
                checked={value}
                onCheckedChange={() => dispatch(action(!value))}
                className="data-[state=checked]:bg-teal-600"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}