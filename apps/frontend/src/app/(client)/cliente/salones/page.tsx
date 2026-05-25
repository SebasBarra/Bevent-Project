'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAllEventHallsByClientAction } from '@/features/event-halls/actions';
import { EventHallList } from '@/features/event-halls/components';
import type { EventHallListItem } from '@/features/event-halls/types';

export default function ClientEventHallsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [eventHalls, setEventHalls] = useState<EventHallListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadEventHalls() {
    if (!user?.publicMetadata?.userId) return;

    const result = await getAllEventHallsByClientAction(user.publicMetadata.userId as string);

    if (result.success) {
      setEventHalls(result.data);
    } else {
      setError(result.error.detail);
    }

    setIsLoading(false);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: initial load only
  useEffect(() => {
    loadEventHalls();
  }, [user?.publicMetadata?.userId]);

  const handleReserve = (eventHall: EventHallListItem) => {
    router.push(`/cliente/salones/${eventHall.id}/reservar`);
  };

  if (isLoading) {
    return (
      <div className="custom-container py-10">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="custom-container py-10">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-container py-10">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl">Salones Disponibles</h1>
        <p className="text-muted-foreground">Explora los salones disponibles y reserva el tuyo.</p>
      </div>

      <EventHallList
        eventHalls={eventHalls}
        basePath="/cliente/salones"
        actionLabel="Reservar"
        onAction={handleReserve}
        emptyMessage="No hay salones disponibles para ti en este momento"
      />
    </div>
  );
}
