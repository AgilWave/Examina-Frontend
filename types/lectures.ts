export interface LectureInteract {
    viewLecture: {
      id: number;
      email: string;
      username: string;
      batchCode: string;
      course : string;
      faculty: string;
      name: string;
      role: string;
      createdAt: string;
      updatedAt: string;
      createdBy: string;
      updatedBy: string;
      isBlacklisted: boolean;
      blackelistedReason: string;
    };
    editBlocked: boolean;
  }
  