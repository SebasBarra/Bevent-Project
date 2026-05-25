'use server';

import { getCurrentToken } from '@/features/auth/actions';
import type { CreateReservationRequest, UpdateReservationRequest } from '@/features/reservations/schemas';
import {
  cancelReservation,
  completeReservation,
  confirmReservation,
  createReservation,
  getMyReservations,
  getReservationDetail,
  updateReservation,
} from '@/features/reservations/services/reservations.service';
import type { ReservationDetail, ReservationId, ReservationSummary } from '@/features/reservations/types';
import { type ActionResult, safeAction } from '@/lib/safe-action';

// Only Client
export async function createReservationAction(request: CreateReservationRequest): Promise<ActionResult<ReservationId>> {
  const token = await getCurrentToken({ redirectIfNotFound: true });

  return await safeAction(() => createReservation(token, request));
}

// Only Client
export async function updateReservationAction(
  reservationId: string,
  request: UpdateReservationRequest,
): Promise<ActionResult<ReservationId>> {
  const token = await getCurrentToken({ redirectIfNotFound: true });

  return await safeAction(() => updateReservation(token, reservationId, request));
}

// Only Client
export async function cancelReservationAction(reservationId: string): Promise<ActionResult<void>> {
  const token = await getCurrentToken({ redirectIfNotFound: true });

  return await safeAction(() => cancelReservation(token, reservationId));
}

// Only Admin
export async function confirmReservationAction(reservationId: string): Promise<ActionResult<void>> {
  const token = await getCurrentToken({ redirectIfNotFound: true });

  return await safeAction(() => confirmReservation(token, reservationId));
}

// Only Admin
export async function completeReservationAction(reservationId: string): Promise<ActionResult<void>> {
  const token = await getCurrentToken({ redirectIfNotFound: true });

  return await safeAction(() => completeReservation(token, reservationId));
}

// Any Authenticated User
export async function getReservationDetailAction(reservationId: string): Promise<ActionResult<ReservationDetail>> {
  const token = await getCurrentToken({ redirectIfNotFound: true });

  return await safeAction(() => getReservationDetail(token, reservationId));
}

// Only Client
export async function getMyReservationsAction(): Promise<ActionResult<ReservationSummary[]>> {
  const token = await getCurrentToken({ redirectIfNotFound: true });

  return await safeAction(() => getMyReservations(token));
}
