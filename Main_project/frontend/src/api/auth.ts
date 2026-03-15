import apiClient from './axios';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: { id: number; username: string; email: string };
}

export async function registerUser(username: string, email: string, password: string): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>('/auth/register', { username, email, password });
  return res.data;
}

export async function loginUser(username: string, password: string): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>('/auth/login', { username, password });
  return res.data;
}
