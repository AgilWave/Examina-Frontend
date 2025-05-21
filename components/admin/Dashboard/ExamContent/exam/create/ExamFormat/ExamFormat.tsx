
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { LetterText, Clock } from "lucide-react";

const examModes = ["Multiple Choice", "Essay", "Mixed", "Viva"];

export default function ExamFormat() {
  const [selectedMode, setSelectedMode] = useState("Multiple Choice");
  const [randomQuestions, setRandomQuestions] = useState(false);
  const [randomAnswers, setRandomAnswers] = useState(false);
  const [backtracking, setBacktracking] = useState(true);
  const [allowLateEntry, setAllowLateEntry] = useState(true);
  const [lateEntryTime, setLateEntryTime] = useState(10);

  const isMCQorMixed =
    selectedMode === "Multiple Choice" || selectedMode === "Mixed";

  return (
    <div className="p-6 border rounded-2xl shadow-md w-full bg-white dark:bg-card dark:border-black/20">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <LetterText
            className="text-teal-500 bg-teal-500/20 p-2 rounded-full"
            size={40}
          />
          <div>
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Exam Format
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Configure the format and rules of your exam
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-black dark:text-white font-bold">
            Exam Mode
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {examModes.map((mode) => (
              <Button
                key={mode}
                variant={selectedMode === mode ? "default" : "outline"}
                className={cn(
                  "rounded-lg",
                  selectedMode === mode ? " text-white" : ""
                )}
                onClick={() => setSelectedMode(mode)}
              >
                {mode}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-b border-black/60 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Switch
                  checked={randomQuestions && isMCQorMixed}
                  onCheckedChange={() =>
                    isMCQorMixed && setRandomQuestions(!randomQuestions)
                  }
                  disabled={!isMCQorMixed}
                  className="data-[state=checked]:bg-teal-500"
                />
                <Label className="text-sm font-medium text-gray-700 dark:text-white">
                  Randomize Questions?
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  checked={randomAnswers && isMCQorMixed}
                  onCheckedChange={() =>
                    isMCQorMixed && setRandomAnswers(!randomAnswers)
                  }
                  disabled={!isMCQorMixed}
                  className="data-[state=checked]:bg-teal-500"
                />
                <Label className="text-sm font-medium text-gray-700 dark:text-white">
                  Randomize Answers? (MCQ only)
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  checked={backtracking}
                  onCheckedChange={() => setBacktracking(!backtracking)}
                  className="data-[state=checked]:bg-teal-500"
                />
                <Label className="text-sm font-medium text-gray-700 dark:text-white">
                  Allow Backtracking?
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-3">
              <Switch
                checked={allowLateEntry}
                onCheckedChange={() => setAllowLateEntry(!allowLateEntry)}
                className="data-[state=checked]:bg-teal-500"
              />
              <Label className="text-sm font-medium text-gray-700 dark:text-white">
                Late Entry Allowance
              </Label>
            </div>

            {allowLateEntry && (
              <div className="pl-8 space-y-3">
                <Label className="text-sm text-black dark:text-white font-medium">
                  {" "}
                  <Clock className="text-teal-500 w-4 h-4" />
                  Late Entry Time: {lateEntryTime} minutes
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={lateEntryTime}
                    onChange={(e) => setLateEntryTime(Number(e.target.value))}
                    className="w-20 border-teal-300 focus-visible:ring-teal-500"
                  />
                  <Slider
                    value={[lateEntryTime]}
                    min={0}
                    max={30}
                    step={1}
                    onValueChange={(value) => setLateEntryTime(value[0])}
                    className="w-full"
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 italic">
                  Students can join the exam up to{" "}
                  <span className="font-semibold text-teal-700">
                    {lateEntryTime}
                  </span>{" "}
                  minutes after the start time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
