export interface BaseResponse {
  message: string;
  statusCode: number;
  success: boolean;
  timestamp: string;
}

export interface ResponseGetAllMetaData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BaseGetAllFilter {
  page?: string;
  limit?: string;
  getAll?: "true" | "false" | undefined;
}
