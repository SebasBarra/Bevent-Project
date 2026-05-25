'use client';

import { MapPin, Users } from 'lucide-react';
import Link from 'next/link';
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
  const formattedPrice = new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
  }).format(eventHall.basePrice);

  return (
    <Card className="group flex flex-col overflow-hidden transition-all hover:shadow-lg">
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
