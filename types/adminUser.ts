export interface AdminInteract {
    createUser: {
      email: string;
      username: string;
      name: string;
      role: string;        
    };
    viewUser: {
      id: number;
      email: string;
      username: string;
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
  