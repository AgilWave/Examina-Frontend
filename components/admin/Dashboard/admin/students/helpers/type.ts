export type User = {
    id: number;
    name: string;
    email: string;
    student: {
        batch: {
            batchCode: string;
        };
    };
    isBlacklisted: boolean;
  };
  