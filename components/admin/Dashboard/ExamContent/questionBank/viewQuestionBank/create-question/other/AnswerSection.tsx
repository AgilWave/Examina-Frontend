"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AnswerSectionProps {
    correctAnswers: string[];
    wrongAnswers: string[];
    correctAnswerClarifications: string[];
    wrongAnswerClarifications: string[];
    onCorrectAnswerChange: (value: string | string[]) => void;
    onCorrectClarificationChange: (value: string | string[]) => void;
    onWrongAnswerChange: (index: number, value: string) => void;
    onWrongClarificationChange: (index: number, value: string) => void;
    errorCorrect?: string;
    errorWrong?: string;
    questionType: string;
}

const AnswerSection: React.FC<AnswerSectionProps> = ({
    correctAnswers,
    wrongAnswers,
    correctAnswerClarifications,
    wrongAnswerClarifications,
    onCorrectAnswerChange,
    onCorrectClarificationChange,
    onWrongAnswerChange,
    onWrongClarificationChange,
    errorCorrect,
    errorWrong,
    questionType,
}) => {
    const isMultipleChoice = questionType === "Multiple Choice";

    const handleRemoveCorrectAnswer = (index: number) => {
        if (correctAnswers.length > 1) {
            const newAnswers = correctAnswers.filter((_, i) => i !== index);
            const newClarifications = correctAnswerClarifications.filter((_, i) => i !== index);
            onCorrectAnswerChange(newAnswers);
            onCorrectClarificationChange(newClarifications);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <Label className="text-base font-medium">Correct Answer{isMultipleChoice ? "s" : ""}</Label>
                {isMultipleChoice ? (
                    <div className="space-y-4">
                        {correctAnswers.map((answer, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder={`Correct Answer ${index + 1}`}
                                        value={answer}
                                        onChange={(e) => {
                                            const newAnswers = [...correctAnswers];
                                            newAnswers[index] = e.target.value;
                                            onCorrectAnswerChange(newAnswers);
                                        }}
                                        className="dark:bg-gray-800 dark:border-gray-700 flex-1"
                                    />
                                    {correctAnswers.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveCorrectAnswer(index)}
                                            className="h-10 w-10 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                <Textarea
                                    placeholder={`Clarification for Answer ${index + 1}`}
                                    value={correctAnswerClarifications[index] || ""}
                                    onChange={(e) => {
                                        const newClarifications = [...correctAnswerClarifications];
                                        newClarifications[index] = e.target.value;
                                        onCorrectClarificationChange(newClarifications);
                                    }}
                                    className="dark:bg-gray-800 dark:border-gray-700"
                                />
                            </div>
                        ))}
                        <button
                            onClick={() => onCorrectAnswerChange([...correctAnswers, ""])}
                            className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300"
                        >
                            + Add Another Correct Answer
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Input
                            placeholder="Correct Answer"
                            value={correctAnswers[0] || ""}
                            onChange={(e) => onCorrectAnswerChange([e.target.value])}
                            className="dark:bg-gray-800 dark:border-gray-700"
                        />
                        <Textarea
                            placeholder="Clarification"
                            value={correctAnswerClarifications[0] || ""}
                            onChange={(e) => onCorrectClarificationChange([e.target.value])}
                            className="dark:bg-gray-800 dark:border-gray-700"
                        />
                    </div>
                )}
                {errorCorrect && (
                    toast.error(errorCorrect)
                )}
            </div>

            {/* Wrong Answers Section */}
            <div className="space-y-4">
                <Label className="text-base font-medium">Other Options</Label>
                <div className="space-y-4">
                    {wrongAnswers.map((answer, index) => (
                        <div key={index} className="space-y-2">
                            <Input
                                placeholder={`Option ${index + 1}`}
                                value={answer}
                                onChange={(e) => onWrongAnswerChange(index, e.target.value)}
                                className="dark:bg-gray-800 dark:border-gray-700"
                            />
                            <Textarea
                                placeholder={`Clarification for Option ${index + 1}`}
                                value={wrongAnswerClarifications[index] || ""}
                                onChange={(e) => onWrongClarificationChange(index, e.target.value)}
                                className="dark:bg-gray-800 dark:border-gray-700"
                            />
                        </div>
                    ))}
                </div>
                {errorWrong && (
                    toast.error(errorWrong)
                )}
            </div>
        </div>
    );
};

export default AnswerSection; 