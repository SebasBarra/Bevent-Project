import type { ReservationSummary } from '@/features/reservations/types';

export type EventHallId = {
  eventHallId: string;
};

export type EventHallImage = {
  id: string;
  imageUrl: string;
  imagePublicId: string;
  description: string;
};

export type EventHallListItem = {
  id: string;
  name: string;
  description: string;
  maxCapacity: number;
  basePrice: number;
  location: string;
  eventHallImages: EventHallImage[];
};

export type Service = {
  id: string;
  name: string;
  description: string;
  additionalCost: number;
};

export type AvailableSchedule = {
  id: string;
  dayOfWeek: number; // 0 (Monday) to 6 (Sunday)
  startTime: string; // "HH:MM" format
  endTime: string; // "HH:MM" format
};

export type EventHallDetail = EventHallListItem & {
  createdOnUtc: string; // ISO date string
  updatedOnUtc: string | null; // ISO date string or null
  services: Service[];
  availableSchedules: AvailableSchedule[];
};

export type EventHallAdminDetail = EventHallDetail & {
  pendingReservations: ReservationSummary[];
};
