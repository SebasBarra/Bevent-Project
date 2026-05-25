import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getEventHallByIdAction } from '@/features/event-halls/actions';
import { getReservationDetailAction } from '@/features/reservations/actions';
import { UpdateReservationForm } from '@/features/reservations/components';
import { ReservationStatus } from '@/features/reservations/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditReservationPage({ params }: Props) {
  const { id } = await params;
  const reservationResult = await getReservationDetailAction(id);

  if (!reservationResult.success) {
    notFound();
  }

  const reservation = reservationResult.data;

  // Solo se pueden editar reservas pendientes
  if (reservation.status !== ReservationStatus.PENDING) {
    redirect('/cliente/mis-reservas');
  }

  const eventHallResult = await getEventHallByIdAction(reservation.eventHall.id);

  if (!eventHallResult.success) {
    notFound();
  }

  return (
    <div className="custom-container py-10">
      <div className="mb-6">
        <Link href={`/cliente/mis-reservas/${id}`} className="text-muted-foreground text-sm hover:text-primary">
          ← Volver a detalles de reserva
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="mb-2 font-bold text-2xl">Editar Reserva</h1>
        <p className="text-muted-foreground">Modifica los detalles de tu reserva en {eventHallResult.data.name}</p>
      </div>

      <div className="mx-auto max-w-2xl">
        <UpdateReservationForm reservation={reservation} eventHall={eventHallResult.data} />
      </div>
    </div>
  );
}
