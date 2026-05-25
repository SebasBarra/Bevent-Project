import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventHallAdminDetailAction } from '@/features/event-halls/actions';
import { UpdateEventHallForm } from '@/features/event-halls/components';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEventHallPage({ params }: Props) {
  const { id } = await params;
  const result = await getEventHallAdminDetailAction(id);

  if (!result.success) {
    notFound();
  }

  return (
    <div className="custom-container py-10">
      <div className="mb-6">
        <Link href={`/admin/salones/${id}`} className="text-muted-foreground text-sm hover:text-primary">
          ← Volver al salón
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="mb-2 font-bold text-2xl">Editar Salón</h1>
        <p className="text-muted-foreground">Modifica la información de {result.data.name}</p>
      </div>

      <div className="mx-auto max-w-2xl">
        <UpdateEventHallForm eventHall={result.data} />
      </div>
    </div>
  );
}
