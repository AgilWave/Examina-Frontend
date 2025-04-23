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
  lectures: {
    totalPages: number;
    page: number;
    nextPage: number;
    prevPage: number;
  };
  batch: {
    totalPages: number;
    page: number;
    nextPage: number;
    prevPage: number;
  };
  course: {
    totalPages: number;
    page: number;
    nextPage: number;
    prevPage: number;
  };
  module: {
    totalPages: number;
    page: number;
    nextPage: number;
    prevPage: number;
  };
  faculty: {
    totalPages: number;
    page: number;
    nextPage: number;
    prevPage: number;
  };
}
