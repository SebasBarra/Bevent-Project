import type { CreateReservationRequest, UpdateReservationRequest } from '@/features/reservations/schemas';
import type { ReservationDetail, ReservationId, ReservationSummary } from '@/features/reservations/types';
import { apiClient } from '@/lib/api-client';

// Only Client
export async function createReservation(token: string, request: CreateReservationRequest): Promise<ReservationId> {
  return await apiClient.post<ReservationId>('/reservations', request, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Only Client
export async function updateReservation(
  token: string,
  reservationId: string,
  request: UpdateReservationRequest,
): Promise<ReservationId> {
  return await apiClient.put<ReservationId>(`/reservations/${reservationId}`, request, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Only Client
export async function cancelReservation(token: string, reservationId: string): Promise<void> {
  return await apiClient.delete<void>(`/reservations/${reservationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Only Admin
export async function confirmReservation(token: string, reservationId: string): Promise<void> {
  return await apiClient.post<void>(`/reservations/${reservationId}/confirm`, undefined, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Only Admin
export async function completeReservation(token: string, reservationId: string): Promise<void> {
  return await apiClient.post<void>(`/reservations/${reservationId}/complete`, undefined, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Any Authenticated User
export async function getReservationDetail(token: string, reservationId: string): Promise<ReservationDetail> {
  return await apiClient.get<ReservationDetail>(`/reservations/${reservationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Only Client
export async function getMyReservations(token: string): Promise<ReservationSummary[]> {
  return await apiClient.get<ReservationSummary[]>('/reservations/my-reservations', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
