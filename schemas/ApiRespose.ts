export default interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  count: number;
  currentPage: number;
  pageCount: number;
}
