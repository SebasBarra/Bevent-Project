'use client';

import { Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ReservationStatus, type ReservationSummary } from '@/features/reservations/types';

interface Props {
  reservation: ReservationSummary;
  onViewDetails?: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  onComplete?: () => void;
  isAdmin?: boolean;
}

const STATUS_VARIANTS: Record<ReservationStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  [ReservationStatus.PENDING]: 'secondary',
  [ReservationStatus.CONFIRMED]: 'default',
  [ReservationStatus.CANCELLED]: 'destructive',
  [ReservationStatus.COMPLETED]: 'outline',
};

export function ReservationCard({
  reservation,
  onViewDetails,
  onEdit,
  onCancel,
  onConfirm,
  onComplete,
  isAdmin = false,
}: Props) {
  const formattedDate = new Date(reservation.reservationDate).toLocaleDateString('es-BO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const canEdit = reservation.status === ReservationStatus.PENDING && !isAdmin;
  const canCancel = reservation.status === ReservationStatus.PENDING && !isAdmin;
  const canConfirm = reservation.status === ReservationStatus.PENDING && isAdmin;
  const canComplete = reservation.status === ReservationStatus.CONFIRMED && isAdmin;

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="mb-1 font-semibold">{reservation.eventHallName}</h3>
          <p className="text-muted-foreground text-sm">{isAdmin ? reservation.clientName : ''}</p>
        </div>
        <Badge variant={STATUS_VARIANTS[reservation.status]}>{reservation.status}</Badge>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 text-muted-foreground text-sm">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span className="capitalize">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>
            {reservation.startTime} - {reservation.endTime}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {onViewDetails && (
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            Ver detalles
          </Button>
        )}
        {canEdit && onEdit && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            Editar
          </Button>
        )}
        {canCancel && onCancel && (
          <Button variant="destructive" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        {canConfirm && onConfirm && (
          <Button size="sm" onClick={onConfirm}>
            Confirmar
          </Button>
        )}
        {canComplete && onComplete && (
          <Button size="sm" onClick={onComplete}>
            Completar
          </Button>
        )}
      </div>
    </Card>
  );
}
