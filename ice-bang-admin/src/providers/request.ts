export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string;
  status: string;
};

export async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const result: ApiResponse<T> = await response.json();

  if (!result.success) {
    throw new Error(result.message ?? "API Error");
  }

  return result.data;
}

export interface PageResult<T> {
  data: T[];
  total: number;
  current: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
