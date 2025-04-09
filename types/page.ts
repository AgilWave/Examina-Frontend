export interface PageState {
  users: {
    totalPages: number;
    page: number;
    nextPage: number;
    prevPage: number;
  };
  students: {
    totalPages: number;
    page: number;
    nextPage: number;
    prevPage: number;
  };
}
