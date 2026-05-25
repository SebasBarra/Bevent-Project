import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventHallByIdAction } from '@/features/event-halls/actions';
import { CreateReservationForm } from '@/features/reservations/components';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CreateReservationPage({ params }: Props) {
  const { id } = await params;
  const result = await getEventHallByIdAction(id);

  if (!result.success) {
    notFound();
  }

  return (
    <div className="custom-container py-10">
      <div className="mb-6">
        <Link href={`/cliente/salones/${id}`} className="text-muted-foreground text-sm hover:text-primary">
          ← Volver al salón
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="mb-2 font-bold text-2xl">Reservar: {result.data.name}</h1>
        <p className="text-muted-foreground">Completa los detalles de tu reserva</p>
      </div>

      <div className="mx-auto max-w-2xl">
        <CreateReservationForm eventHall={result.data} />
      </div>
    </div>
  );
}
