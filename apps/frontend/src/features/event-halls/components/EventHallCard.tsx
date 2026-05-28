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
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentImageUrl}
          alt={eventHall.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="-translate-y-1/2 absolute top-1/2 left-2 rounded-full bg-black/50 p-1.5 text-white transition-all hover:bg-black/70"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="-translate-y-1/2 absolute top-1/2 right-2 rounded-full bg-black/50 p-1.5 text-white transition-all hover:bg-black/70"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute right-2 bottom-2 rounded-full bg-black/60 px-2 py-0.5 text-white text-xs">
              {activeImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="scrollbar-thin flex gap-1 overflow-x-auto bg-muted/50 px-2 py-1.5">
          {images.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveImageIndex(index)}
              className={`relative aspect-video w-12 shrink-0 overflow-hidden rounded-sm border transition-all ${
                index === activeImageIndex
                  ? 'border-primary ring-2 ring-primary ring-offset-1'
                  : 'opacity-60 hover:opacity-80'
              }`}
              aria-label={`Ver imagen ${index + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.imageUrl} alt={`Miniatura ${index + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
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
