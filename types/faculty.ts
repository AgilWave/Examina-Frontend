export interface FacultyInteract {
    editBlocked: boolean;
    createFaculty: {
      facultyName: string;
      status: string;
      moduleIds: number[];
    };
    viewFaculty: {
      setIsActive: undefined;
      id: number;
      courseName: string;
      status: string;
      module: any[]; // You can define a proper Module type later
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
  