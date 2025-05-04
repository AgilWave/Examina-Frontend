"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnswerSectionProps {
    correctAnswers: string[];
    wrongAnswers: string[];
    correctAnswerClarifications: string[];
    wrongAnswerClarifications: string[];
    onCorrectAnswerChange: (value: string | string[]) => void;
    onCorrectClarificationChange: (value: string | string[]) => void;
    onWrongAnswerChange: (index: number, value: string) => void;
    onWrongClarificationChange: (index: number, value: string) => void;
    onRemoveWrongAnswer: (index: number) => void;
    onRemoveCorrectAnswer: (index: number) => void;
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
    onRemoveWrongAnswer,
    onRemoveCorrectAnswer,
    errorCorrect,
    errorWrong,
    questionType,
}) => {
    const isMultipleChoice = questionType === "Multiple Choice";


    return (
        <div className="space-y-8">
            {/* Correct Answers Section */}
            <Card className="border-2 border-green-500/20 bg-green-50/50 dark:bg-green-900/10">
                <CardContent className="pt-6">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Label className="text-base font-medium">Correct Answer{isMultipleChoice ? "s" : ""}</Label>
                            <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
                                Required
                            </Badge>
                        </div>
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
                                                    onClick={() => onRemoveCorrectAnswer(index)}
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
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onCorrectAnswerChange([...correctAnswers, ""])}
                                    className="w-full text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 border-teal-200 dark:border-teal-800"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Another Correct Answer
                                </Button>
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
                </CardContent>
            </Card>

            {/* Wrong Answers Section */}
            <Card className="border-2 border-gray-200 dark:border-gray-800">
                <CardContent className="pt-6">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Label className="text-base font-medium">Other Options</Label>
                            <Badge variant="secondary" className="bg-gray-500/10 text-gray-700 dark:text-gray-400">
                                Required
                            </Badge>
                        </div>
                        <div className="space-y-4">
                            {wrongAnswers.map((answer, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder={`Option ${index + 1}`}
                                            value={answer}
                                            onChange={(e) => onWrongAnswerChange(index, e.target.value)}
                                            className="dark:bg-gray-800 dark:border-gray-700 flex-1"
                                        />
                                        {wrongAnswers.length > 2 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onRemoveWrongAnswer(index)}
                                                className="h-10 w-10 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <Textarea
                                        placeholder={`Clarification for Option ${index + 1}`}
                                        value={wrongAnswerClarifications[index] || ""}
                                        onChange={(e) => onWrongClarificationChange(index, e.target.value)}
                                        className="dark:bg-gray-800 dark:border-gray-700"
                                    />
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onWrongAnswerChange(wrongAnswers.length, "")}
                                className="w-full text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 border-teal-200 dark:border-teal-800"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Another Option
                            </Button>
                        </div>
                        {errorWrong && (
                            toast.error(errorWrong)
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AnswerSection; 