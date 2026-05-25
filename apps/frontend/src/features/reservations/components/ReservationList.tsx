import { CalendarX } from 'lucide-react';
import type { ReservationSummary } from '@/features/reservations/types';
import { ReservationCard } from './ReservationCard';

interface Props {
  reservations: ReservationSummary[];
  isAdmin?: boolean;
  onViewDetails?: (reservation: ReservationSummary) => void;
  onEdit?: (reservation: ReservationSummary) => void;
  onCancel?: (reservation: ReservationSummary) => void;
  onConfirm?: (reservation: ReservationSummary) => void;
  onComplete?: (reservation: ReservationSummary) => void;
  emptyMessage?: string;
}

export function ReservationList({
  reservations,
  isAdmin = false,
  onViewDetails,
  onEdit,
  onCancel,
  onConfirm,
  onComplete,
  emptyMessage,
}: Props) {
  if (reservations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
        <CalendarX className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <p className="text-muted-foreground">{emptyMessage || 'No hay reservas'}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {reservations.map((reservation) => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          isAdmin={isAdmin}
          onViewDetails={onViewDetails ? () => onViewDetails(reservation) : undefined}
          onEdit={onEdit ? () => onEdit(reservation) : undefined}
          onCancel={onCancel ? () => onCancel(reservation) : undefined}
          onConfirm={onConfirm ? () => onConfirm(reservation) : undefined}
          onComplete={onComplete ? () => onComplete(reservation) : undefined}
        />
      ))}
    </div>
  );
}
