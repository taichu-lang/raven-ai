export const ApiCodeOK = 0;
export const ApiCodeInput = 1;
export const ApiCodeUserAbsent = 10;
export const ApiCodeCredential = 11;
export const ApiCodeTooManyRequest = 12;
export const ApiCodeSystem = 99;

export interface EmptyPayload {
  _reversed: number;
}

export interface ApiResponse<T> {
  code: number;
  message?: string;
  data: T;
}
