'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { EventHallDetail } from '@/features/event-halls/types';
import { updateReservationAction } from '@/features/reservations/actions';
import { type UpdateReservationRequest, updateReservationSchema } from '@/features/reservations/schemas';
import type { ReservationDetail } from '@/features/reservations/types';

interface Props {
  reservation: ReservationDetail;
  eventHall: EventHallDetail;
}

export function UpdateReservationForm({ reservation, eventHall }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>(reservation.services.map((s) => s.id));

  const form = useForm<UpdateReservationRequest>({
    resolver: zodResolver(updateReservationSchema),
    defaultValues: {
      eventHallId: eventHall.id,
      reservationDate: reservation.reservationDate.split('T')[0],
      startTime: reservation.startTime.substring(0, 5),
      endTime: reservation.endTime.substring(0, 5),
      notes: reservation.notes || '',
      servicesIds: reservation.services.map((s) => s.id),
      tasks: reservation.tasks.map((t) => ({
        id: t.id,
        description: t.description,
        isCompleted: t.isCompleted,
      })),
    },
  });

  const {
    fields: taskFields,
    append: appendTask,
    remove: removeTask,
  } = useFieldArray({
    control: form.control,
    name: 'tasks',
  });

  const toggleService = (serviceId: string) => {
    const newServices = selectedServices.includes(serviceId)
      ? selectedServices.filter((id) => id !== serviceId)
      : [...selectedServices, serviceId];

    setSelectedServices(newServices);
    form.setValue('servicesIds', newServices);
  };

  const calculateTotal = () => {
    const servicesTotal = eventHall.services
      .filter((s) => selectedServices.includes(s.id))
      .reduce((acc, s) => acc + s.additionalCost, 0);
    return eventHall.basePrice + servicesTotal;
  };

  const onSubmit = async (data: UpdateReservationRequest) => {
    setIsLoading(true);

    const result = await updateReservationAction(reservation.id, {
      ...data,
      servicesIds: selectedServices,
    });

    if (result.success) {
      toast.success('Reserva actualizada exitosamente');
      router.push('/cliente/mis-reservas');
    } else {
      toast.error(result.error.detail);
      setIsLoading(false);
    }
  };

  const formattedTotal = new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
  }).format(calculateTotal());

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Date and Time */}
        <Card className="p-5">
          <h2 className="mb-4 font-semibold">Fecha y horario</h2>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="reservationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha del evento</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" min={new Date().toISOString().split('T')[0]} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de inicio</FormLabel>
                    <FormControl>
                      <Input {...field} type="time" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de fin</FormLabel>
                    <FormControl>
                      <Input {...field} type="time" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Card>

        {/* Services */}
        {eventHall.services.length > 0 && (
          <Card className="p-5">
            <h2 className="mb-4 font-semibold">Servicios adicionales</h2>
            <div className="space-y-3">
              {eventHall.services.map((service) => (
                // biome-ignore lint/a11y/noLabelWithoutControl: Checkbox inside handles the control
                <label
                  key={service.id}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-lg border p-4 text-left transition-colors ${
                    selectedServices.includes(service.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={() => toggleService(service.id)}
                      disabled={isLoading}
                    />
                    <div>
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-muted-foreground text-xs">{service.description}</p>
                    </div>
                  </div>
                  {service.additionalCost > 0 && (
                    <span className="shrink-0 font-medium text-sm">
                      +{' '}
                      {new Intl.NumberFormat('es-BO', {
                        style: 'currency',
                        currency: 'BOB',
                      }).format(service.additionalCost)}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </Card>
        )}

        {/* Tasks */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Tareas para el evento</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendTask({ description: '', isCompleted: false })}
              disabled={isLoading}
            >
              <Plus className="mr-1 h-4 w-4" />
              Agregar
            </Button>
          </div>

          {taskFields.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm">
              No hay tareas. Agrega tareas para organizar tu evento.
            </p>
          ) : (
            <div className="space-y-3">
              {taskFields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-3">
                  <FormField
                    control={form.control}
                    name={`tasks.${index}.isCompleted`}
                    render={({ field: checkboxField }) => (
                      <FormItem className="flex items-center pt-2">
                        <FormControl>
                          <Checkbox
                            checked={checkboxField.value}
                            onCheckedChange={checkboxField.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`tasks.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Descripción de la tarea"
                            disabled={isLoading}
                            className={form.watch(`tasks.${index}.isCompleted`) ? 'line-through opacity-60' : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTask(index)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Notes */}
        <Card className="p-5">
          <h2 className="mb-4 font-semibold">Notas adicionales</h2>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Escribe cualquier nota o requerimiento especial para tu evento..."
                    rows={4}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>

        {/* Summary and Submit */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total estimado</p>
              <p className="font-bold text-2xl text-primary">{formattedTotal}</p>
            </div>
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Actualizando...' : 'Actualizar reserva'}
            </Button>
          </div>
        </Card>

        <Separator />

        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
