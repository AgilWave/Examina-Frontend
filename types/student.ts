export interface StudentInteract {
    viewStudent: {
      id: number;
      email: string;
      name: string;
      batchCode: string;
      course : string;
      faculty : string;
      createdAt: string;
      updatedAt: string;
      createdBy: string;
      updatedBy: string;
      isBlacklisted: boolean;
      blackelistedReason: string;
    };
    editBlocked: boolean;
  }
  