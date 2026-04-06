import type { ID, Timestamp } from '@/shared/types/common';

export interface User {
  id: ID;
  name: string;
  created_at: Timestamp;
}

export interface AuthResponse {
  token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export enum AuthStatus {
  Unknown = 'unknown',
  Unauthenticated = 'unauthenticated',
  Authenticated = 'authenticated',
}
