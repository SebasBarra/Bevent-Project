'use client';

import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { deleteEventHallAction, getEventHallAdminDetailAction } from '@/features/event-halls/actions';
import { EventHallDetailView } from '@/features/event-halls/components';
import type { EventHallAdminDetail } from '@/features/event-halls/types';
import { completeReservationAction, confirmReservationAction } from '@/features/reservations/actions';
import { ReservationList } from '@/features/reservations/components';
import type { ReservationSummary } from '@/features/reservations/types';
import { ReservationStatus } from '@/features/reservations/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default function AdminEventHallDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [eventHall, setEventHall] = useState<EventHallAdminDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadEventHall = async () => {
    const result = await getEventHallAdminDetailAction(id);

    if (result.success) {
      setEventHall(result.data);
    } else {
      setError(result.error.detail);
    }

    setIsLoading(false);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: initial load
  useEffect(() => {
    loadEventHall();
  }, [id]);

  const handleConfirm = async (reservation: ReservationSummary) => {
    const result = await confirmReservationAction(reservation.id);

    if (result.success) {
      toast.success('Reserva confirmada exitosamente');
      loadEventHall();
    } else {
      toast.error(result.error.detail);
    }
  };

  const handleComplete = async (reservation: ReservationSummary) => {
    const result = await completeReservationAction(reservation.id);

    if (result.success) {
      toast.success('Reserva completada exitosamente');
      loadEventHall();
    } else {
      toast.error(result.error.detail);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    const result = await deleteEventHallAction(id);

    if (result.success) {
      toast.success('Salón eliminado exitosamente');
      router.push('/admin/salones');
    } else {
      toast.error(result.error.detail);
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
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

  if (error || !eventHall) {
    return (
      <div className="custom-container py-10">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive">{error || 'Salón no encontrado'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-container py-10">
      <div className="mb-6">
        <Link href="/admin/salones" className="text-muted-foreground text-sm hover:text-primary">
          ← Volver a mis salones
        </Link>
      </div>

      <EventHallDetailView eventHall={eventHall}>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href={`/admin/salones/${id}/editar`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </EventHallDetailView>

      <Separator className="my-8" />

      {/* Reservations Section */}
      <Card className="p-5">
        <h2 className="mb-4 font-semibold text-lg">Reservas Pendientes</h2>
        {eventHall.pendingReservations.length === 0 ? (
          <p className="text-center text-muted-foreground">No hay reservas pendientes para este salón.</p>
        ) : (
          <ReservationList
            reservations={eventHall.pendingReservations}
            isAdmin={true}
            onConfirm={(r) => r.status === ReservationStatus.PENDING && handleConfirm(r)}
            onComplete={(r) => r.status === ReservationStatus.CONFIRMED && handleComplete(r)}
            emptyMessage="No hay reservas pendientes"
          />
        )}
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar salón?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el salón &quot;{eventHall.name}&quot; y
              todas sus reservas asociadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
