import type { CreateEventHallRequest, UpdateEventHallRequest } from '@/features/event-halls/schemas';
import type {
  EventHallAdminDetail,
  EventHallDetail,
  EventHallId,
  EventHallListItem,
} from '@/features/event-halls/types';
import { apiClient } from '@/lib/api-client';

// Only Admin
export async function createEventHall(token: string, request: CreateEventHallRequest): Promise<EventHallId> {
  return await apiClient.post<EventHallId>('/event-halls', request, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Only Admin
export async function updateEventHall(
  token: string,
  eventHallId: string,
  request: UpdateEventHallRequest,
): Promise<EventHallId> {
  return await apiClient.put<EventHallId>(`/event-halls/${eventHallId}`, request, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Only Admin
export async function deleteEventHall(token: string, eventHallId: string): Promise<void> {
  return await apiClient.delete<void>(`/event-halls/${eventHallId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Public
export async function getAllEventHalls(
  adminId: string | null = null,
  clientId: string | null = null,
): Promise<EventHallListItem[]> {
  const params: Record<string, string> = {};

  if (adminId) {
    params.adminId = adminId;
  }

  if (clientId) {
    params.clientId = clientId;
  }

  return await apiClient.get<EventHallListItem[]>('/event-halls', {
    params,
  });
}

// Public
export async function getEventHallById(eventHallId: string): Promise<EventHallDetail> {
  return await apiClient.get<EventHallDetail>(`/event-halls/${eventHallId}`);
}

// Only Admin
export async function getEventHallAdminDetail(token: string, eventHallId: string): Promise<EventHallAdminDetail> {
  return await apiClient.get<EventHallAdminDetail>(`/event-halls/${eventHallId}/admin`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
