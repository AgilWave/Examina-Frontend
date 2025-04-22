export interface BatchInteract {
    editBlocked: boolean;
    createBatch: {
      batchCode: string;
      courseName: string;
      courseId: string;
      status: string;
      year: string;
    };
    viewBatch: {
      setIsActive: undefined;
      id: number;
      batchCode: string;
      courseName: string;
      status: string;
      year: string;
      courseId: string;
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