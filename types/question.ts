export interface QuestionInteract {
    editBlocked: boolean;
    createQuestion: {
      lectureName: string;
      questionType: string;
      questionText: string;
      options: string[]; // Assuming question options are stored as strings
      correctAnswer: string;
    };
    viewQuestion: {
      id: number;
      lectureName: string;
      questionType: string;
      questionText: string;
      options: string[];
      correctAnswer: string;
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
  