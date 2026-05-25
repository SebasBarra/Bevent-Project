import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getEventHallByIdAction } from '@/features/event-halls/actions';
import { EventHallDetailView } from '@/features/event-halls/components';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ClientEventHallDetailPage({ params }: Props) {
  const { id } = await params;
  const result = await getEventHallByIdAction(id);

  if (!result.success) {
    notFound();
  }

  return (
    <div className="custom-container py-10">
      <div className="mb-6">
        <Link href="/cliente/salones" className="text-muted-foreground text-sm hover:text-primary">
          ← Volver a salones
        </Link>
      </div>

      <EventHallDetailView eventHall={result.data}>
        <Button asChild size="lg">
          <Link href={`/cliente/salones/${id}/reservar`}>Reservar este salón</Link>
        </Button>
      </EventHallDetailView>
    </div>
  );
}
