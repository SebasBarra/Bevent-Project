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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { updateEventHallAction } from '@/features/event-halls/actions';
import { type UpdateEventHallRequest, updateEventHallSchema } from '@/features/event-halls/schemas';
import type { EventHallDetail } from '@/features/event-halls/types';

const DAYS_OF_WEEK = [
  { value: '0', label: 'Lunes' },
  { value: '1', label: 'Martes' },
  { value: '2', label: 'Miércoles' },
  { value: '3', label: 'Jueves' },
  { value: '4', label: 'Viernes' },
  { value: '5', label: 'Sábado' },
  { value: '6', label: 'Domingo' },
];

interface Props {
  eventHall: EventHallDetail;
}

export function UpdateEventHallForm({ eventHall }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateEventHallRequest>({
    resolver: zodResolver(updateEventHallSchema),
    defaultValues: {
      name: eventHall.name,
      description: eventHall.description,
      maxCapacity: eventHall.maxCapacity,
      basePrice: eventHall.basePrice,
      location: eventHall.location,
      services: eventHall.services.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        additionalCost: s.additionalCost,
      })),
      availableSchedules: eventHall.availableSchedules.map((s) => ({
        id: s.id,
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime.substring(0, 5), // Ensure HH:MM format
        endTime: s.endTime.substring(0, 5), // Ensure HH:MM format
      })),
    },
  });

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({
    control: form.control,
    name: 'services',
  });

  const {
    fields: scheduleFields,
    append: appendSchedule,
    remove: removeSchedule,
  } = useFieldArray({
    control: form.control,
    name: 'availableSchedules',
  });

  const onSubmit = async (data: UpdateEventHallRequest) => {
    setIsLoading(true);

    const result = await updateEventHallAction(eventHall.id, data);

    if (result.success) {
      toast.success('Salón actualizado exitosamente');
      router.push('/admin/salones');
    } else {
      toast.error(result.error.detail);
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card className="p-5">
          <h2 className="mb-4 font-semibold">Información básica</h2>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del salón</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: Salón Imperial" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe tu salón, ambiente, características especiales..."
                      rows={3}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="maxCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidad máxima</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio base (BOB)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        step="0.01"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Dirección completa del salón" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        {/* Services */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Servicios</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendService({ name: '', description: '', additionalCost: 0 })}
              disabled={isLoading}
            >
              <Plus className="mr-1 h-4 w-4" />
              Agregar
            </Button>
          </div>

          {serviceFields.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm">No hay servicios agregados</p>
          ) : (
            <div className="space-y-4">
              {serviceFields.map((field, index) => (
                <div key={field.id} className="relative rounded-lg border p-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 text-destructive"
                    onClick={() => removeService(index)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="space-y-3 pr-10">
                    <FormField
                      control={form.control}
                      name={`services.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del servicio</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ej: Decoración" disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`services.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Describe el servicio" disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`services.${index}.additionalCost`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Costo adicional (BOB)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={0}
                              step="0.01"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Schedules */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Horarios disponibles</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendSchedule({ dayOfWeek: 0, startTime: '09:00', endTime: '18:00' })}
              disabled={isLoading}
            >
              <Plus className="mr-1 h-4 w-4" />
              Agregar
            </Button>
          </div>

          {scheduleFields.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm">No hay horarios configurados</p>
          ) : (
            <div className="space-y-3">
              {scheduleFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-3">
                  <FormField
                    control={form.control}
                    name={`availableSchedules.${index}.dayOfWeek`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Día</FormLabel>
                        <Select
                          value={String(field.value)}
                          onValueChange={(value) => field.onChange(Number(value))}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DAYS_OF_WEEK.map((day) => (
                              <SelectItem key={day.value} value={day.value}>
                                {day.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`availableSchedules.${index}.startTime`}
                    render={({ field }) => (
                      <FormItem className="w-28">
                        <FormLabel>Inicio</FormLabel>
                        <FormControl>
                          <Input {...field} type="time" disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`availableSchedules.${index}.endTime`}
                    render={({ field }) => (
                      <FormItem className="w-28">
                        <FormLabel>Fin</FormLabel>
                        <FormControl>
                          <Input {...field} type="time" disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mb-0.5 h-9 w-9 text-destructive"
                    onClick={() => removeSchedule(index)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
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
                Guardando...
              </>
            ) : (
              'Guardar cambios'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
