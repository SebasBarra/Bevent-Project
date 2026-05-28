export enum ReservationStatus {
  PENDING = 'Pendiente',
  CONFIRMED = 'Confirmado',
  CANCELLED = 'Cancelado',
  COMPLETED = 'Completado',
}

export type ReservationId = {
  reservationId: string;
};

export type ReservationClient = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export type ReservationEventHall = {
  id: string;
  name: string;
  location: string;
  basePrice: number;
};

export type ReservationService = {
  id: string;
  name: string;
  description: string;
  priceAtReservation: number;
};

export type ReservationTask = {
  id: string;
  description: string;
  isCompleted: boolean;
};

export type ReservationDetail = {
  id: string;
  reservationDate: string; // ISO date string
  startTime: string; // ISO time string
  endTime: string; // ISO time string
  totalCost: number;
  status: ReservationStatus;
  notes: string;
  createdOnUtc: string; // ISO date string
  updatedOnUtc: string | null; // ISO date string
  client: ReservationClient;
  eventHall: ReservationEventHall;
  services: ReservationService[];
  tasks: ReservationTask[];
};

export type ReservationSummary = {
  id: string;
  reservationDate: string; // ISO date string
  startTime: string; // "HH:MM" format
  endTime: string; // "HH:MM" format
  status: ReservationStatus;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  eventHallName: string;
};
