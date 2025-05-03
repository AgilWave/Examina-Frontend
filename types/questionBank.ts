interface QuestionData {
  category: string;
  type: string;
  text: string;
  attachment: string | null;
  answerOptions: [
    {
      text: string;
      clarification: string;
      isCorrect: boolean;
    }
  ] | null;
}

export interface QuestionBankInteract {
  editBlocked: boolean;
  createQuestionBank: {
    moduleId: number;
    questions: QuestionData[];
  };
  viewQuestionBank: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
  };
  // Pagination fields
  page: number;
  totalPages: number;
  nextPage: number;
  prevPage: number;
}