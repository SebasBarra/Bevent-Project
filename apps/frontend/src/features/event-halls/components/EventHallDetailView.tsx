'use client';

import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { EventHallDetail } from '@/features/event-halls/types';

interface Props {
  eventHall: EventHallDetail;
  children?: React.ReactNode;
}

const DAYS_OF_WEEK = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DEFAULT_IMAGE = 'https://res.cloudinary.com/dhbpvtom7/image/upload/v1779945310/DefaultImage_pbb47u.jpg';

export function EventHallDetailView({ eventHall, children }: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const formattedPrice = new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
  }).format(eventHall.basePrice);

  const images = eventHall.eventHallImages || [];
  const mainImageUrl = images.length > 0 ? images[activeImageIndex].imageUrl : DEFAULT_IMAGE;

  return (
    <div className="space-y-6">
      {/* Gallery Section */}
      <div className="space-y-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mainImageUrl}
            alt={eventHall.name}
            className="h-full w-full object-cover transition-all duration-300"
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                className="-translate-y-1/2 absolute top-1/2 left-3 rounded-full bg-black/40 p-2 text-white transition-all hover:bg-black/60"
                aria-label="Imagen anterior"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                className="-translate-y-1/2 absolute top-1/2 right-3 rounded-full bg-black/40 p-2 text-white transition-all hover:bg-black/60"
                aria-label="Siguiente imagen"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="absolute right-3 bottom-3 rounded-full bg-black/60 px-2.5 py-0.5 font-medium text-white text-xs">
                {activeImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="scrollbar-thin flex gap-1.5 overflow-x-auto pb-1">
            {images.map((img, index) => (
              <button
                key={img.id}
                type="button"
                className={`relative aspect-video w-14 shrink-0 overflow-hidden rounded-md border transition-all ${
                  index === activeImageIndex
                    ? 'border-primary opacity-100 ring-2 ring-primary ring-offset-1'
                    : 'opacity-50 hover:opacity-75'
                }`}
                onClick={() => setActiveImageIndex(index)}
                aria-label={`Ver imagen ${index + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.imageUrl} alt={img.description || 'Miniatura'} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

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
