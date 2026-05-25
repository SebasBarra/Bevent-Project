import z from 'zod';

export const createServiceEventHallSchema = z.object({
  name: z.string().min(1, 'El nombre del servicio es requerido'),
  description: z.string().min(1, 'La descripción del servicio es requerida'),
  additionalCost: z
    .number({ error: 'El costo adicional debe ser un número' })
    .min(0, 'El costo adicional no puede ser negativo'),
});

export type CreateServiceEventHall = z.infer<typeof createServiceEventHallSchema>;

export const updateServiceEventHallSchema = createServiceEventHallSchema.extend({
  id: z.uuid('El ID del servicio es requerido').optional(),
});

export type UpdateServiceEventHall = z.infer<typeof updateServiceEventHallSchema>;

export const createAvailableScheduleEventHallSchema = z.object({
  dayOfWeek: z.number().min(0).max(6, 'El día de la semana debe estar entre 0 (lunes) y 6 (domingo)'),
  startTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'El formato de hora de inicio debe ser HH:MM'),
  endTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'El formato de hora de fin debe ser HH:MM'),
});

export type CreateAvailableScheduleEventHall = z.infer<typeof createAvailableScheduleEventHallSchema>;

export const updateAvailableScheduleEventHallSchema = createAvailableScheduleEventHallSchema.extend({
  id: z.uuid('El ID del horario es requerido').optional(),
});

export type UpdateAvailableScheduleEventHall = z.infer<typeof updateAvailableScheduleEventHallSchema>;

export const createEventHallSchema = z.object({
  name: z.string().min(1, 'El nombre del salón es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  maxCapacity: z
    .number({ error: 'La capacidad máxima debe ser un número' })
    .min(1, 'La capacidad máxima debe ser al menos 1'),
  basePrice: z.number({ error: 'El precio base debe ser un número' }).min(0, 'El precio base no puede ser negativo'),
  location: z.string().min(1, 'La ubicación es requerida'),
  services: z.array(createServiceEventHallSchema).optional(),
  availableSchedules: z.array(createAvailableScheduleEventHallSchema).optional(),
});

export type CreateEventHallRequest = z.infer<typeof createEventHallSchema>;

export const updateEventHallSchema = z.object({
  name: z.string().min(1, 'El nombre del salón es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  maxCapacity: z
    .number({ error: 'La capacidad máxima debe ser un número' })
    .min(1, 'La capacidad máxima debe ser al menos 1'),
  basePrice: z.number({ error: 'El precio base debe ser un número' }).min(0, 'El precio base no puede ser negativo'),
  location: z.string().min(1, 'La ubicación es requerida'),
  services: z.array(updateServiceEventHallSchema).optional(),
  availableSchedules: z.array(updateAvailableScheduleEventHallSchema).optional(),
});

export type UpdateEventHallRequest = z.infer<typeof updateEventHallSchema>;
