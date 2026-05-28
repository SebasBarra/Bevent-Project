'use server';

import { getCurrentToken } from '@/features/auth/actions';
import type { CreateEventHallRequest, UpdateEventHallRequest } from '@/features/event-halls/schemas';
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

// Only Admin
export async function createEventHallAction(data: CreateEventHallRequest): Promise<ActionResult<EventHallId>> {
  const token = await getCurrentToken({ redirectIfNotFound: true });

  return await safeAction(() => createEventHall(token, data));
}

// Only Admin
export async function updateEventHallAction(
  eventHallId: string,
  data: UpdateEventHallRequest,
): Promise<ActionResult<EventHallId>> {
  const token = await getCurrentToken({ redirectIfNotFound: true });

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
