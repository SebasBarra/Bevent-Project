'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
import { cancelReservationAction, getMyReservationsAction } from '@/features/reservations/actions';
import { ReservationList } from '@/features/reservations/components';
import type { ReservationSummary } from '@/features/reservations/types';

export default function ClientEventHallReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<ReservationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const loadReservations = async () => {
    const result = await getMyReservationsAction();

    if (result.success) {
      setReservations(result.data);
    } else {
      setError(result.error.detail);
    }

    setIsLoading(false);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: initial load only
  useEffect(() => {
    loadReservations();
  }, []);

  const handleViewDetails = (reservation: ReservationSummary) => {
    router.push(`/cliente/mis-reservas/${reservation.id}`);
  };

  const handleEdit = (reservation: ReservationSummary) => {
    router.push(`/cliente/mis-reservas/${reservation.id}/editar`);
  };

  const handleCancelClick = (reservation: ReservationSummary) => {
    setReservationToCancel(reservation.id);
    setCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    if (!reservationToCancel) return;

    setIsCancelling(true);
    const result = await cancelReservationAction(reservationToCancel);

    if (result.success) {
      toast.success('Reserva cancelada exitosamente');
      loadReservations();
    } else {
      toast.error(result.error.detail);
    }

    setIsCancelling(false);
    setCancelDialogOpen(false);
    setReservationToCancel(null);
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
        <h1 className="mb-2 font-bold text-3xl">Mis Reservas</h1>
        <p className="text-muted-foreground">Visualiza y gestiona todas tus reservas de salones de eventos.</p>
      </div>

      <ReservationList
        reservations={reservations}
        isAdmin={false}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onCancel={handleCancelClick}
        emptyMessage="No tienes reservas aún. ¡Explora los salones disponibles y haz tu primera reserva!"
      />

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar reserva?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La reserva será cancelada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Volver</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel} disabled={isCancelling}>
              {isCancelling ? 'Cancelando...' : 'Sí, cancelar reserva'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
