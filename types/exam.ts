export interface AnswerOption {
  text: string;
  clarification: string | null;
  isCorrect: boolean;
  mark: number;
}

export interface ExamQuestion {
  type: "MCQ" | string; 
  category: string;
  text: string;
  attachment: string | null;
  answerOptions: AnswerOption[];
}

export interface ExamInteract {
  createExam: {
    facultyId: number;
    courseId: number;
    batchId: number;
    moduleId: number;
    examName: string;
    examCode: string;
    description: string;
    lectureId: number;
    examDate: string;
    startTime: string;
    endTime: string;
    examMode: "online" | string;
    randomizeQuestions: boolean;
    randomizeAnswers: boolean;
    allowBackTracking: boolean;
    lateEntry: boolean;
    lateEntryTime: number;
    webcamRequired: boolean;
    micRequired: boolean;
    networkStrengthTest: boolean;
    lockdownBrowser: boolean;
    surroundingEnvironmentCheck: boolean;
    examQuestions: ExamQuestion[];
    notifyStudents: boolean;
    sendReminders: boolean;
    reminderTime: number;
  };
}
