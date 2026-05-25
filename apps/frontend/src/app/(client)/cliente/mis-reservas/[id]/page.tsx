import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getReservationDetailAction } from '@/features/reservations/actions';
import { ReservationDetailView } from '@/features/reservations/components';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ClientReservationDetailPage({ params }: Props) {
  const { id } = await params;
  const result = await getReservationDetailAction(id);

  if (!result.success) {
    notFound();
  }

  return (
    <div className="custom-container py-10">
      <div className="mb-6">
        <Link href="/cliente/mis-reservas" className="text-muted-foreground text-sm hover:text-primary">
          ← Volver a mis reservas
        </Link>
      </div>

      <ReservationDetailView reservation={result.data} />
    </div>
  );
}
