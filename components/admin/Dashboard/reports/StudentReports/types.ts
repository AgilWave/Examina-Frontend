export interface StudentExamReport {
  id: number;
  examName: string;
  examCode: string;
  moduleName: string;
  courseName: string;
  examDate: string;
  startTime: string;
  endTime: string;
  status: 'completed' | 'missed' | 'pending';
  score?: number;
  totalMarks?: number;
  percentage?: number;
  timeSpent?: string;
  submissionTime?: string;
  rank?: number;
  totalParticipants?: number;
}

export interface StudentDetails {
  id: number;
  name: string;
  email: string;
  studentId: string;
  faculty: string;
  course: string;
  batch: string;
  enrollmentDate: string;
  isActive: boolean;
}
