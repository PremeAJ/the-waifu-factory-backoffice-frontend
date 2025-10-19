export interface PageOptions {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export const defaultPageOptions: PageOptions = {
  page: 1,
  perPage: 10,
  total: 0,
  totalPages: 0,
}