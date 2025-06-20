export interface AdminInteract {
    viewResult: {
        module: string;
        examCode: string;
        examDate: string;
        result: string;
        points: string;
        credits: string;
        updatedBy: string;
    };
    page: number;
    totalPages: number;
    nextPage: number;
    prevPage: number;
    editBlocked: boolean;
}