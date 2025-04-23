export interface ModuleInteract {
    editBlocked: any;
    createModule: {
      moduleName: string;
      status: string;
      courseId: number;
    };
    viewModule: {
      id: number;
      moduleName: string;
      status: string;
      courseId: number;
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