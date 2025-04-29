export interface QuestionBankInteract {
    editBlocked: boolean;
    createQuestionBank: {
      name: string;
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