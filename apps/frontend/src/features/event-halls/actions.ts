'use server';

import { getCurrentToken } from '@/features/auth/actions';
import {
  type CreateEventHallFormData,
  createEventHallSchema,
  type UpdateEventHallFormData,
  updateEventHallSchema,
} from '@/features/event-halls/schemas';
import {
  createEventHall,
  deleteEventHall,
  getAllEventHalls,
  getEventHallAdminDetail,
  getEventHallById,
  updateEventHall,
} from '@/features/event-halls/services/event-halls.service';
import type {
  EventHallAdminDetail,
  EventHallDetail,
  EventHallId,
  EventHallListItem,
} from '@/features/event-halls/types';
import { type ActionResult, safeAction } from '@/lib/safe-action';

function parseFormDataToCreateDto(formData: FormData): CreateEventHallFormData {
  const raw = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    maxCapacity: Number(formData.get('maxCapacity')),
    basePrice: Number(formData.get('basePrice')),
    location: formData.get('location') as string,
    services: formData.get('services') ? JSON.parse(formData.get('services') as string) : undefined,
    availableSchedules: formData.get('availableSchedules')
      ? JSON.parse(formData.get('availableSchedules') as string)
      : undefined,
  };

  const validated = createEventHallSchema.parse(raw);

  const images = formData.getAll('images').filter((f): f is File => f instanceof File && f.size > 0);

  return {
    ...validated,
    images: images.length > 0 ? images : undefined,
  };
}

function parseFormDataToUpdateDto(formData: FormData): UpdateEventHallFormData {
  const raw = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    maxCapacity: Number(formData.get('maxCapacity')),
    basePrice: Number(formData.get('basePrice')),
    location: formData.get('location') as string,
    services: formData.get('services') ? JSON.parse(formData.get('services') as string) : undefined,
    availableSchedules: formData.get('availableSchedules')
      ? JSON.parse(formData.get('availableSchedules') as string)
      : undefined,
  };

  const validated = updateEventHallSchema.parse(raw);

  const images = formData.getAll('images').filter((f): f is File => f instanceof File && f.size > 0);

  return {
    ...validated,
    images: images.length > 0 ? images : undefined,
  };
}

// Only Admin
export async function createEventHallAction(formData: FormData): Promise<ActionResult<EventHallId>> {
  const token = await getCurrentToken({ redirectIfNotFound: true });
  const data = parseFormDataToCreateDto(formData);

  return await safeAction(() => createEventHall(token, data));
}

// Only Admin
export async function updateEventHallAction(
  eventHallId: string,
  formData: FormData,
): Promise<ActionResult<EventHallId>> {
  const token = await getCurrentToken({ redirectIfNotFound: true });
  const data = parseFormDataToUpdateDto(formData);

  return await safeAction(() => updateEventHall(token, eventHallId, data));
}

// Only Admin
export async function deleteEventHallAction(eventHallId: string): Promise<ActionResult<void>> {
  const token = await getCurrentToken({ redirectIfNotFound: true });

  return await safeAction(() => deleteEventHall(token, eventHallId));
}

// Public
export async function getAllEventHallsAction(): Promise<ActionResult<EventHallListItem[]>> {
  return await safeAction(() => getAllEventHalls());
}

// Public
export async function getAllEventHallsByAdminAction(adminId: string): Promise<ActionResult<EventHallListItem[]>> {
  return await safeAction(() => getAllEventHalls(adminId, null));
}

// Public
export async function getAllEventHallsByClientAction(clientId: string): Promise<ActionResult<EventHallListItem[]>> {
  return await safeAction(() => getAllEventHalls(null, clientId));
}

// Public
export async function getEventHallByIdAction(eventHallId: string): Promise<ActionResult<EventHallDetail>> {
  const action = await safeAction(() => getEventHallById(eventHallId));

  return action;
}

// Only Admin
export async function getEventHallAdminDetailAction(eventHallId: string): Promise<ActionResult<EventHallAdminDetail>> {
  const token = await getCurrentToken({ redirectIfNotFound: true });

  const action = await safeAction(() => getEventHallAdminDetail(token, eventHallId));

  return action;
}
