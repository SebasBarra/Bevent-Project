import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getCurrentSession } from '@/features/auth/actions';
import { REDIRECT_URL } from '@/features/auth/constants';
import { getEventHallByIdAction } from '@/features/event-halls/actions';
import { EventHallDetailView } from '@/features/event-halls/components';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EventHallDetailPage({ params }: Props) {
  const user = await getCurrentSession();

  if (user) {
    redirect(REDIRECT_URL);
  }

  const { id } = await params;
  const result = await getEventHallByIdAction(id);

  if (!result.success) {
    notFound();
  }

  return (
    <div className="custom-container py-10">
      <div className="mb-6">
        <Link href="/salones" className="text-muted-foreground text-sm hover:text-primary">
          ← Volver a salones
        </Link>
      </div>

      <EventHallDetailView eventHall={result.data}>
        <div className="flex gap-3">
          <Button asChild size="lg" className="flex-1 sm:flex-none">
            <Link href="/auth/registrarse">Registrarse para reservar</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-none">
            <Link href="/auth/iniciar-sesion">Iniciar sesión</Link>
          </Button>
        </div>
      </EventHallDetailView>
    </div>
  );
}
