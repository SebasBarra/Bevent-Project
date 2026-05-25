'use client';

import { useUser } from '@clerk/nextjs';
import { Plus } from 'lucide-react';
import Link from 'next/link';
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
import { Button } from '@/components/ui/button';
import { deleteEventHallAction, getAllEventHallsByAdminAction } from '@/features/event-halls/actions';
import { EventHallList } from '@/features/event-halls/components';
import type { EventHallListItem } from '@/features/event-halls/types';

export default function AdminEventHallsPage() {
  const { user } = useUser();
  const [eventHalls, setEventHalls] = useState<EventHallListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventHallToDelete, setEventHallToDelete] = useState<EventHallListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadEventHalls = async () => {
    if (!user?.publicMetadata?.userId) return;

    const result = await getAllEventHallsByAdminAction(user.publicMetadata.userId as string);

    if (result.success) {
      setEventHalls(result.data);
    } else {
      setError(result.error.detail);
    }

    setIsLoading(false);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: initial load only
  useEffect(() => {
    loadEventHalls();
  }, [user?.publicMetadata?.userId]);

  const handleDelete = (eventHall: EventHallListItem) => {
    setEventHallToDelete(eventHall);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventHallToDelete) return;

    setIsDeleting(true);
    const result = await deleteEventHallAction(eventHallToDelete.id);

    if (result.success) {
      toast.success('Salón eliminado exitosamente');
      loadEventHalls();
    } else {
      toast.error(result.error.detail);
    }

    setIsDeleting(false);
    setDeleteDialogOpen(false);
    setEventHallToDelete(null);
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 font-bold text-3xl">Mis Salones</h1>
          <p className="text-muted-foreground">Gestiona tus salones de eventos y sus reservas.</p>
        </div>
        <Button asChild>
          <Link href="/admin/salones/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Salón
          </Link>
        </Button>
      </div>

      <EventHallList
        eventHalls={eventHalls}
        basePath="/admin/salones"
        actionLabel="Eliminar"
        onAction={handleDelete}
        emptyMessage="No tienes salones registrados. ¡Crea tu primer salón!"
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar salón?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el salón &quot;{eventHallToDelete?.name}
              &quot; y todas sus reservas asociadas.
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
