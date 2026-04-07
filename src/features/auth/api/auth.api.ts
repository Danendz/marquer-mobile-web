import { authClient } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/api/types';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from '@/features/auth/types/auth.types';

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

export async function loginApi(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
  const { data } = await authClient.post('/login', payload);
  return data;
}

export async function registerApi(payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> {
  const { data } = await authClient.post('/register', payload);
  return data;
}

export async function refreshTokenApi(): Promise<ApiResponse<AuthResponse>> {
  const { data } = await authClient.post('/refresh');
  return data;
}

export async function fetchMeApi(): Promise<ApiResponse<User>> {
  const { data } = await authClient.get('/me');
  return data;
}

export async function logoutApi(): Promise<void> {
  await authClient.post('/logout');
}
