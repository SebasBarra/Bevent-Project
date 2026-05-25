'use client';

import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { EventHallDetail } from '@/features/event-halls/types';

interface Props {
  eventHall: EventHallDetail;
  children?: React.ReactNode;
}

const DAYS_OF_WEEK = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export function EventHallDetailView({ eventHall, children }: Props) {
  const formattedPrice = new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
  }).format(eventHall.basePrice);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-2 font-bold text-2xl">{eventHall.name}</h1>
          <div className="flex flex-wrap gap-3 text-muted-foreground text-sm">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{eventHall.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>Hasta {eventHall.maxCapacity} personas</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground text-sm">Precio base</p>
          <p className="font-bold text-2xl text-primary">{formattedPrice}</p>
        </div>
      </div>

      {/* Description */}
      <Card className="p-5">
        <h2 className="mb-3 font-semibold">Descripción</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">{eventHall.description}</p>
      </Card>

      {/* Services */}
      {eventHall.services.length > 0 && (
        <Card className="p-5">
          <h2 className="mb-4 font-semibold">Servicios incluidos</h2>
          <div className="space-y-3">
            {eventHall.services.map((service) => (
              <div key={service.id} className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium text-sm">{service.name}</p>
                  <p className="text-muted-foreground text-xs">{service.description}</p>
                </div>
                {service.additionalCost > 0 && (
                  <Badge variant="secondary" className="shrink-0">
                    +{' '}
                    {new Intl.NumberFormat('es-BO', {
                      style: 'currency',
                      currency: 'BOB',
                    }).format(service.additionalCost)}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Available Schedules */}
      {eventHall.availableSchedules.length > 0 && (
        <Card className="p-5">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <Calendar className="h-4 w-4" />
            Horarios disponibles
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {eventHall.availableSchedules.map((schedule) => (
              <div key={schedule.id} className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
                <span className="font-medium text-sm">{DAYS_OF_WEEK[schedule.dayOfWeek]}</span>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    {schedule.startTime} - {schedule.endTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Actions slot */}
      {children}
    </div>
  );
}
