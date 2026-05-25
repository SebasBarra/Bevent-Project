import Link from 'next/link';
import { CreateEventHallForm } from '@/features/event-halls/components';

export default function CreateEventHallPage() {
  return (
    <div className="custom-container py-10">
      <div className="mb-6">
        <Link href="/admin/salones" className="text-muted-foreground text-sm hover:text-primary">
          ← Volver a mis salones
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="mb-2 font-bold text-2xl">Nuevo Salón</h1>
        <p className="text-muted-foreground">Crea un nuevo salón de eventos para ofrecer a tus clientes.</p>
      </div>

      <div className="mx-auto max-w-2xl">
        <CreateEventHallForm />
      </div>
    </div>
  );
}
