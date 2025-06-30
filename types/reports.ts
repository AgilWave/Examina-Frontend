export interface Participant {
  id: string;
  name: string;
  email: string;
  status: 'present' | 'absent';
}

export interface QuestionCount {
  type: string;
  count: number;
}

export interface ExamDetails {
  startTime: string;
  endTime: string;
  duration: string;
  participantCount: number;
  participants: Participant[];
  absentCount: number;
  questionCounts: QuestionCount[];
}

export interface Exam {
  id: string;
  examName: string;
  examCode: string;
  date: string;
  faculty: string;
  course: string;
  batch: string;
  details: ExamDetails;
}