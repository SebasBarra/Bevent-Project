'use client';

import { Calendar, Check, Clock, MapPin, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { type ReservationDetail, ReservationStatus } from '@/features/reservations/types';

interface Props {
  reservation: ReservationDetail;
  children?: React.ReactNode;
}

const STATUS_VARIANTS: Record<ReservationStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  [ReservationStatus.PENDING]: 'secondary',
  [ReservationStatus.CONFIRMED]: 'default',
  [ReservationStatus.CANCELLED]: 'destructive',
  [ReservationStatus.COMPLETED]: 'outline',
};

export function ReservationDetailView({ reservation, children }: Props) {
  const formattedDate = new Date(reservation.reservationDate).toLocaleDateString('es-BO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedCost = new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
  }).format(reservation.totalCost);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-2 font-bold text-2xl">{reservation.eventHall.name}</h1>
          <div className="flex items-center gap-2">
            <Badge variant={STATUS_VARIANTS[reservation.status]}>{reservation.status}</Badge>
          </div>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground text-sm">Costo total</p>
          <p className="font-bold text-2xl text-primary">{formattedCost}</p>
        </div>
      </div>

      {/* Event Details */}
      <Card className="p-5">
        <h2 className="mb-4 font-semibold">Detalles del evento</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Fecha</p>
              <p className="font-medium text-sm capitalize">{formattedDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Horario</p>
              <p className="font-medium text-sm">
                {reservation.startTime} - {reservation.endTime}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Ubicación</p>
              <p className="font-medium text-sm">{reservation.eventHall.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Cliente</p>
              <p className="font-medium text-sm">
                {reservation.client.firstName} {reservation.client.lastName}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Client Info */}
      <Card className="p-5">
        <h2 className="mb-4 font-semibold">Información del cliente</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nombre</span>
            <span>
              {reservation.client.firstName} {reservation.client.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{reservation.client.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Teléfono</span>
            <span>{reservation.client.phoneNumber}</span>
          </div>
        </div>
      </Card>

      {/* Services */}
      {reservation.services.length > 0 && (
        <Card className="p-5">
          <h2 className="mb-4 font-semibold">Servicios incluidos</h2>
          <div className="space-y-3">
            {reservation.services.map((service) => (
              <div key={service.id} className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium text-sm">{service.name}</p>
                  <p className="text-muted-foreground text-xs">{service.description}</p>
                </div>
                <span className="shrink-0 font-medium text-sm">
                  {new Intl.NumberFormat('es-BO', {
                    style: 'currency',
                    currency: 'BOB',
                  }).format(service.priceAtReservation)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tasks */}
      {reservation.tasks.length > 0 && (
        <Card className="p-5">
          <h2 className="mb-4 font-semibold">Tareas</h2>
          <div className="space-y-2">
            {reservation.tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${task.isCompleted ? 'bg-primary text-primary-foreground' : 'border-2 border-muted-foreground/30'}`}
                >
                  {task.isCompleted && <Check className="h-3 w-3" />}
                </div>
                <span className={`text-sm ${task.isCompleted ? 'text-muted-foreground line-through' : ''}`}>
                  {task.description}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Notes */}
      {reservation.notes && (
        <Card className="p-5">
          <h2 className="mb-3 font-semibold">Notas</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{reservation.notes}</p>
        </Card>
      )}

      {/* Actions slot */}
      {children}
    </div>
  );
}
