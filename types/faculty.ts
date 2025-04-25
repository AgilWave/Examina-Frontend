export interface FacultyInteract {
    editBlocked: boolean;
    createFaculty: {
      name: string;
    };
    viewFaculty: {
      isActive: boolean;
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
  