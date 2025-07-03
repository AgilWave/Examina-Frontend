export type Batch = {
    id: number;
    batchCode: string;
    year: string;
    courseName: string;
    isBlacklisted: boolean;
  };

export type ExamHistory = {
    examId: number;
    examName: string;
    examCode: string;
    examDate: string;
    startTime: string;
    endTime: string;
    status: "completed" | "ongoing" | "upcoming";
    faculty: string;
    course: string;
    module: string;
    lecture: string;
    hasParticipated: boolean;
    joinedAt?: string;
    isSubmitted: boolean;
    submittedAt?: string;
    isConnected: boolean;
    disconnectedAt?: string;
  };
  