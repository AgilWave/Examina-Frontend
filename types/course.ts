interface Module {
  id: number;
  name: string;
}
export interface CourseInteract {
    editBlocked: boolean;
    createCourse: {
      courseName: string;
      moduleIds: number[];
      facultyId : number;
    };
    viewCourse: {
      id: number;
      name: string;
      facultyId: number;
      modules: Module[];
      moduleIds: number[];
      createdAt: string;
      updatedAt: string;
      createdBy: string;
      updatedBy: string;
      isActive: boolean;
    };
    page: number;
    totalPages: number;
    nextPage: number;
    prevPage: number;
  }
  