export interface StudentInteract {
    viewStudent: {
      id: number;
      email: string;
      name: string;
      student: {
        facultyId: number;
        courseId: number;
        batchId: number;
      };
      createdAt: string;
      updatedAt: string;
      createdBy: string;
      updatedBy: string;
      isBlacklisted: boolean;
      blackelistedReason: string;
    };
    editBlocked: boolean;
  }
  