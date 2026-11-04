export type AuthMethod = "wechat" | "password" | "otp";

export interface OTPCredential {
  email: string;
  code: string;
}

export interface EmailCredential {
  email: string;
  password: string;
}

export interface LoginRequest {
  method: AuthMethod;
  credential: OTPCredential | EmailCredential;
}

export interface User {
  name: string;
  email: string;
}

// The raw login response of the backend. Web never exposes the token to the browser (kept in an HttpOnly cookie
// by the next.js route), only desktop receives it.
export interface UserAuth extends User {
  token: string;
  // Unix timestamp in seconds.
  expires_at: number;
}

export function getUserName(u: User) {
  if (u.name) {
    return u.name;
  }

  return u.email.split("@")[0];
}
