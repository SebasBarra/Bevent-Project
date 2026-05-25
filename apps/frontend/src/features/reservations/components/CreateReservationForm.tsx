'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { EventHallDetail } from '@/features/event-halls/types';
import { createReservationAction } from '@/features/reservations/actions';
import { type CreateReservationRequest, createReservationSchema } from '@/features/reservations/schemas';

interface Props {
  eventHall: EventHallDetail;
}

export function CreateReservationForm({ eventHall }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const form = useForm<CreateReservationRequest>({
    resolver: zodResolver(createReservationSchema),
    defaultValues: {
      eventHallId: eventHall.id,
      reservationDate: '',
      startTime: '',
      endTime: '',
      notes: '',
      servicesIds: [],
      tasks: [],
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

  const onSubmit = async (data: CreateReservationRequest) => {
    setIsLoading(true);

    const result = await createReservationAction({
      ...data,
      servicesIds: selectedServices,
    });

    if (result.success) {
      toast.success('Reserva creada exitosamente');
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
                <label
                  key={service.id}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
                    selectedServices.includes(service.id) ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.id)}
                      onChange={() => toggleService(service.id)}
                      className="h-4 w-4 rounded border-gray-300"
                      disabled={isLoading}
                    />
                    <div>
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-muted-foreground text-xs">{service.description}</p>
                    </div>
                  </div>
                  {service.additionalCost > 0 && (
                    <span className="font-medium text-sm">
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
            <h2 className="font-semibold">Tareas (opcional)</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendTask({ description: '' })}
              disabled={isLoading}
            >
              <Plus className="mr-1 h-4 w-4" />
              Agregar
            </Button>
          </div>

          {taskFields.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm">No hay tareas agregadas</p>
          ) : (
            <div className="space-y-3">
              {taskFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`tasks.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} placeholder="Descripción de la tarea" disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-destructive"
                    onClick={() => removeTask(index)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Notes */}
        <Card className="p-5">
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas adicionales (opcional)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Información adicional sobre tu evento..."
                    rows={3}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>

        {/* Total */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Total estimado</p>
              <p className="text-muted-foreground text-xs">Precio base + servicios seleccionados</p>
            </div>
            <p className="font-bold text-2xl text-primary">{formattedTotal}</p>
          </div>
        </Card>

        <Separator />

        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando reserva...
              </>
            ) : (
              'Confirmar reserva'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
