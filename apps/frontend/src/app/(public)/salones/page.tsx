import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/features/auth/actions';
import { REDIRECT_URL } from '@/features/auth/constants';
import { getAllEventHallsAction } from '@/features/event-halls/actions';
import { EventHallList } from '@/features/event-halls/components';

export default async function EventHallsPage() {
  const user = await getCurrentSession();

  if (user) {
    redirect(REDIRECT_URL);
  }

  const result = await getAllEventHallsAction();

  if (!result.success) {
    return (
      <div className="custom-container py-10">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive">{result.error.detail}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-container py-10">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl">Salones de Eventos</h1>
        <p className="text-muted-foreground">
          Explora nuestra selección de salones para tu próximo evento. Inicia sesión para reservar.
        </p>
      </div>

      <EventHallList
        eventHalls={result.data}
        basePath="/salones"
        emptyMessage="No hay salones disponibles en este momento"
      />
    </div>
  );
}
