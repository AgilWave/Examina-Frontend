"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuestionTextInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

const QuestionTextInput: React.FC<QuestionTextInputProps> = ({
  value,
  onChange,
  disabled = false,
  error,
}) => {
  return (
    <div className="space-y-2 w-full">
      <Label>Question Text</Label>
      <Input
        placeholder="Enter your question here"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${error ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
        disabled={disabled}
      />
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default QuestionTextInput;
