export interface EmptyPayload {
  _reversed: number;
}

export interface ApiResponse<T> {
  code: number;
  message?: string;
  data: T;
}
