import { Building2 } from 'lucide-react';
import type { EventHallListItem } from '@/features/event-halls/types';
import { EventHallCard } from './EventHallCard';

interface Props {
  eventHalls: EventHallListItem[];
  basePath: string;
  actionLabel?: string;
  onAction?: (eventHall: EventHallListItem) => void;
  emptyMessage?: string;
}

export function EventHallList({ eventHalls, basePath, actionLabel, onAction, emptyMessage }: Props) {
  if (eventHalls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
        <Building2 className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <p className="text-muted-foreground">{emptyMessage || 'No hay salones disponibles'}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {eventHalls.map((eventHall) => (
        <EventHallCard
          key={eventHall.id}
          eventHall={eventHall}
          href={`${basePath}/${eventHall.id}`}
          actionLabel={actionLabel}
          onAction={onAction ? () => onAction(eventHall) : undefined}
        />
      ))}
    </div>
  );
}
