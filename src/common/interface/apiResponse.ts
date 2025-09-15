export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  error?: string; 
  data?: T;       
}
