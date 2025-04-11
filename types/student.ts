export interface StudentInteract {
    viewStudent: {
      id: number;
      email: string;
      name: string;
      student: {
        faculty: {
            id: number;
            name: string;
        },
        course: {
            id: number;
            name: string;
        },
        batch: {
            id: number;
            name: string;
        },
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
  