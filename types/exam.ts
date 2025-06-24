export interface AnswerOption {
  id: number;
  text: string;
  clarification: string | null;
  isCorrect: boolean;
  mark: number | null;
}

export interface ExamQuestion {
  id: number;
  type: string;
  category: string;
  text: string;
  attachment: string | null;
  answerOptions: AnswerOption[];
  createdBy: string;
}

// Full Exam interface matching the backend entity
export interface Exam {
  id: number;
  faculty: {
    id: number;
    name: string;
  };
  course: {
    id: number;
    name: string;
  };
  batch: {
    id: number;
    name: string;
    batchCode: string;
  };
  module: {
    id: number;
    name: string;
  };
  examName: string;
  examCode: string;
  description: string;
  lecture: {
    id: number;
    name: string;
  };
  examDate: string;
  startTime: string;
  endTime: string;
  examMode: string;
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
  status: string;
  createdBy: string;
  createdAt: string;
  isDeleted: boolean;
  examParticipants: any[];
  examResources: any[];
  examAnswers: any[];
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
