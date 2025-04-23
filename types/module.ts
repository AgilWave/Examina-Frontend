export interface ModuleInteract {
    editBlocked: any;
    createModule: {
      moduleName: string;
      facultyName: string;
      status: string;
    };
    viewModule: {
      setIsActive: undefined;
      id: number;
      moduleName: string;
      facultyName: string;
      status: string;
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