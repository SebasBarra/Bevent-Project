'use client';

import { ChevronLeft, ChevronRight, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { EventHallListItem } from '@/features/event-halls/types';

interface Props {
  eventHall: EventHallListItem;
  href: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EventHallCard({ eventHall, href, actionLabel, onAction }: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const formattedPrice = new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
  }).format(eventHall.basePrice);

  const images =
    eventHall.eventHallImages && eventHall.eventHallImages.length > 0
      ? eventHall.eventHallImages
      : [
          {
            id: 'default',
            imageUrl: 'https://res.cloudinary.com/dhbpvtom7/image/upload/v1779945310/DefaultImage_pbb47u.jpg',
          },
        ];

  const currentImageUrl = images[activeImageIndex]?.imageUrl;

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Card className="group flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentImageUrl}
          alt={eventHall.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="-translate-y-1/2 absolute top-1/2 left-2 rounded-full bg-black/40 p-1.5 text-white opacity-0 transition-all hover:bg-black/60 group-hover:opacity-100"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="-translate-y-1/2 absolute top-1/2 right-2 rounded-full bg-black/40 p-1.5 text-white opacity-0 transition-all hover:bg-black/60 group-hover:opacity-100"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Expanding Dot Indicators */}
            <div className="-translate-x-1/2 absolute bottom-2.5 left-1/2 z-10 flex gap-1.5">
              {images.map((_, index) => (
                <button
                  key={images[index].id || index}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeImageIndex ? 'w-3 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Ver imagen ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="font-semibold text-lg leading-tight">{eventHall.name}</h3>
          <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary text-sm">
            {formattedPrice}
          </span>
        </div>

        <p className="mb-4 line-clamp-2 flex-1 text-muted-foreground text-sm">{eventHall.description}</p>

        <div className="mb-4 flex flex-wrap gap-3 text-muted-foreground text-sm">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>Hasta {eventHall.maxCapacity} personas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{eventHall.location}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={href}>Ver detalles</Link>
          </Button>
          {actionLabel && onAction && (
            <Button size="sm" className="flex-1" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
