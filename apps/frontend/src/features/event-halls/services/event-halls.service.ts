import type { CreateEventHallFormData, UpdateEventHallFormData } from '@/features/event-halls/schemas';
import type {
  EventHallAdminDetail,
  EventHallDetail,
  EventHallId,
  EventHallListItem,
} from '@/features/event-halls/types';
import { ApiError } from '@/lib/api-client';
import { apiClient } from '@/lib/api-client';
import { env } from '@/lib/env/server';

async function fetchMultipart<T>(url: string, method: 'POST' | 'PUT', token: string, formData: FormData): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      // No Content-Type header: browser/Node sets it automatically with the boundary for multipart
    },
    body: formData,
  });

  if (!response.ok) {
    let errorData: { title?: string; detail?: string } = {};
    try {
      errorData = await response.json();
    } catch {
      // ignore
    }
    throw new ApiError(
      response.status,
      errorData.title ?? response.statusText,
      errorData.detail ?? 'Ocurrió un error inesperado',
    );
  }

  return response.json() as Promise<T>;
}

// Only Admin
export async function createEventHall(token: string, data: CreateEventHallFormData): Promise<EventHallId> {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('maxCapacity', String(data.maxCapacity));
  formData.append('basePrice', String(data.basePrice));
  formData.append('location', data.location);

  if (data.services && data.services.length > 0) {
    formData.append('services', JSON.stringify(data.services));
  }

  if (data.availableSchedules && data.availableSchedules.length > 0) {
    const schedulesWithSeconds = data.availableSchedules.map((s) => ({
      ...s,
      startTime: s.startTime.length === 5 ? `${s.startTime}:00` : s.startTime,
      endTime: s.endTime.length === 5 ? `${s.endTime}:00` : s.endTime,
    }));
    formData.append('availableSchedules', JSON.stringify(schedulesWithSeconds));
  }

  if (data.images) {
    for (const image of data.images) {
      formData.append('images', image);
    }
  }

  const url = `${env.API_URL}/api/event-halls`;
  return fetchMultipart<EventHallId>(url, 'POST', token, formData);
}

// Only Admin
export async function updateEventHall(
  token: string,
  eventHallId: string,
  data: UpdateEventHallFormData,
): Promise<EventHallId> {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('maxCapacity', String(data.maxCapacity));
  formData.append('basePrice', String(data.basePrice));
  formData.append('location', data.location);

  if (data.services && data.services.length > 0) {
    formData.append('services', JSON.stringify(data.services));
  }

  if (data.availableSchedules && data.availableSchedules.length > 0) {
    const schedulesWithSeconds = data.availableSchedules.map((s) => ({
      ...s,
      startTime: s.startTime.length === 5 ? `${s.startTime}:00` : s.startTime,
      endTime: s.endTime.length === 5 ? `${s.endTime}:00` : s.endTime,
    }));
    formData.append('availableSchedules', JSON.stringify(schedulesWithSeconds));
  }

  if (data.images) {
    for (const image of data.images) {
      formData.append('images', image);
    }
  }

  const url = `${env.API_URL}/api/event-halls/${eventHallId}`;
  return fetchMultipart<EventHallId>(url, 'PUT', token, formData);
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
