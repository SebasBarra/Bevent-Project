'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { createEventHallAction } from '@/features/event-halls/actions';
import { type CreateEventHallRequest, createEventHallSchema } from '@/features/event-halls/schemas';

const DAYS_OF_WEEK = [
  { value: '0', label: 'Lunes' },
  { value: '1', label: 'Martes' },
  { value: '2', label: 'Miércoles' },
  { value: '3', label: 'Jueves' },
  { value: '4', label: 'Viernes' },
  { value: '5', label: 'Sábado' },
  { value: '6', label: 'Domingo' },
];

export function CreateEventHallForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const form = useForm<CreateEventHallRequest>({
    resolver: zodResolver(createEventHallSchema),
    defaultValues: {
      name: '',
      description: '',
      maxCapacity: 50,
      basePrice: 0,
      location: '',
      services: [],
      availableSchedules: [],
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

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      previews.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeSelectedImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateEventHallRequest) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('maxCapacity', String(data.maxCapacity));
    formData.append('basePrice', String(data.basePrice));
    formData.append('location', data.location);

    if (data.services) {
      formData.append('services', JSON.stringify(data.services));
    }

    if (data.availableSchedules) {
      formData.append('availableSchedules', JSON.stringify(data.availableSchedules));
    }

    if (images.length > 0) {
      images.forEach((file) => {
        formData.append('images', file);
      });
    }

    const result = await createEventHallAction(formData);

    if (result.success) {
      toast.success('Salón creado exitosamente');
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

        {/* Images */}
        <Card className="p-5">
          <h2 className="mb-4 font-semibold">Imágenes del salón</h2>
          <div className="space-y-4">
            <div className="relative flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center transition-colors hover:bg-muted/50">
              <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="mb-1 font-medium text-sm">Arrastra tus imágenes aquí o haz clic para buscar</p>
              <p className="text-muted-foreground text-xs">PNG, JPG o WEBP (máx. 5MB por imagen)</p>
              <input
                type="file"
                multiple
                accept="image/*"
                className="absolute h-full w-full cursor-pointer opacity-0"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                onChange={handleImageChange}
                disabled={isLoading}
                title=""
              />
              <Button type="button" variant="outline" size="sm" className="pointer-events-none relative z-10 mt-3">
                Seleccionar imágenes
              </Button>
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {previews.map((preview, index) => (
                  <div key={preview} className="group relative aspect-video overflow-hidden rounded-md border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt={`Vista previa ${index + 1}`}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 rounded-full bg-destructive/90 p-1 text-destructive-foreground opacity-0 shadow transition-colors hover:bg-destructive group-hover:opacity-100"
                      onClick={() => removeSelectedImage(index)}
                      disabled={isLoading}
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                Creando...
              </>
            ) : (
              'Crear salón'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
