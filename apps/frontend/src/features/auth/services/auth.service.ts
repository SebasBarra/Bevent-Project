import type { RegisterUserRequest, UserId } from '@/features/auth/types';
import { apiClient } from '@/lib/api-client';

export async function registerUser(data: RegisterUserRequest): Promise<UserId> {
  return await apiClient.post<UserId>('/auth/register', data);
}
