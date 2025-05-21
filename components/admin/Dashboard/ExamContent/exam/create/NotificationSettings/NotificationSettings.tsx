
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Bell, Clock, Mail } from "lucide-react";

export default function NotificationSettings() {
  const [emailNotif, setEmailNotif] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [remindTime, setRemindTime] = useState("24");

  return (
    <div className="p-4 md:p-6 border rounded-xl md:rounded-2xl shadow-md bg-white dark:bg-card dark:border-black/20 w-full space-y-4 md:space-y-6">
      {/* Heading */}
      <div className="flex items-center gap-2 md:gap-3">
        <Bell
          className="text-teal-600 bg-teal-500/20 p-1.5 md:p-2 rounded-full"
          size={40}
        />
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-black dark:text-white">
            Notification Settings
          </h2>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            Configure notification settings for the exam
          </p>
        </div>
      </div>

      {/* Toggle Cards */}
      <div className="space-y-3 md:space-y-4">
        {/* Email Notification Card */}
        <div
          className={`flex flex-row items-center justify-between px-3 md:px-4 py-3 md:py-4 rounded-lg md:rounded-xl shadow-sm border ${
            emailNotif ? "border-teal-600" : "border-gray-200 dark:border-gray-700"
          } bg-gray-50 dark:bg-card`}
        >
          <div className="flex items-start gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 rounded-full bg-teal-100 dark:bg-teal-500/10 flex-shrink-0">
              <Mail
                size={18}
                className={
                  emailNotif
                    ? "text-teal-600 dark:text-teal-600"
                    : "text-gray-400 dark:text-gray-500"
                }
              />
            </div>
            <div className="flex-1">
              <Label className="text-xs sm:text-sm font-medium text-black dark:text-white">
                Send Email Notification to Students
              </Label>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 pr-2">
                Students will receive an email with exam details and instructions.
              </p>
            </div>
          </div>
          <div className="flex items-center ml-2 self-center">
            <Switch
              checked={emailNotif}
              onCheckedChange={setEmailNotif}
              className="data-[state=checked]:bg-teal-600"
            />
          </div>
        </div>

        {/* Reminder Notification Card */}
        <div
          className={`flex flex-col px-3 md:px-4 py-3 md:py-4 rounded-lg md:rounded-xl shadow-sm border ${
            reminder ? "border-teal-600" : "border-gray-200 dark:border-gray-700"
          } bg-gray-50 dark:bg-card space-y-3`}
        >
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-start gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 rounded-full bg-teal-100 dark:bg-teal-500/10 flex-shrink-0">
                <Clock
                  size={18}
                  className={
                    reminder
                      ? "text-teal-600 dark:text-teal-600"
                      : "text-gray-400 dark:text-gray-500"
                  }
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs sm:text-sm font-medium text-black dark:text-white">
                  Send Reminder Before Exam
                </Label>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 pr-2">
                  Automatically remind students via email before the exam begins.
                </p>
              </div>
            </div>
            <div className="flex items-center ml-2 self-center">
              <Switch
                checked={reminder}
                onCheckedChange={setReminder}
                className="data-[state=checked]:bg-teal-600"
              />
            </div>
          </div>

          {reminder && (
            <div className="flex items-center gap-3 pl-8 md:pl-10">
              <Label htmlFor="remindTime" className="text-xs sm:text-sm text-teal-700 dark:text-teal-300">
                Remind
              </Label>
              <Input
                id="remindTime"
                type="number"
                min="1"
                className="w-24 h-8 text-xs sm:text-sm rounded-md border border-teal-600 shadow-sm focus:ring-2 focus:ring-teal-300 dark:bg-card dark:border-gray-600"
                value={remindTime}
                onChange={(e) => setRemindTime(e.target.value)}
              />
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                hours before the exam
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}