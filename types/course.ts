export interface CourseInteract {
    editBlocked: any;
    createCourse: {
      courseName: string;
      status: string;
    };
    viewCourse: {
      id: number;
      courseName: string;
      status: string;
      module: any[]; // You can define a proper Module type later
      createdAt: string;
      updatedAt: string;
      createdBy: string;
      updatedBy: string;
    };
    courseEditBlocked: boolean;
  
    // Pagination fields
    page: number;
    totalPages: number;
    nextPage: number;
    prevPage: number;
  }
  