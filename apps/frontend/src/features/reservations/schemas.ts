import z from 'zod';

export const createReservationTaskSchema = z.object({
  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .max(200, 'La descripción no puede exceder los 200 caracteres'),
});

export type CreateReservationTask = z.infer<typeof createReservationTaskSchema>;

export const createReservationSchema = z.object({
  eventHallId: z.uuid('El ID del salón de eventos es inválido'),
  reservationDate: z
    .string()
    .refine((date) => !Number.isNaN(Date.parse(date)), { message: 'La fecha de la reserva es inválida' }),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora de inicio es inválida (formato HH:MM en 24 horas)',
  }),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora de fin es inválida (formato HH:MM en 24 horas)',
  }),
  notes: z.string().max(500, 'Las notas no pueden exceder los 500 caracteres').optional(),
  servicesIds: z.array(z.uuid('El ID del servicio es inválido')).optional(),
  tasks: z.array(createReservationTaskSchema).optional(),
});

export type CreateReservationRequest = z.infer<typeof createReservationSchema>;

export const updateReservationTaskSchema = createReservationTaskSchema.extend({
  id: z.uuid('El ID de la tarea es inválido').optional(),
  isCompleted: z.boolean({
    error: 'El estado de completitud de la tarea es inválido',
  }),
});

export type UpdateReservationTask = z.infer<typeof updateReservationTaskSchema>;

export const updateReservationSchema = createReservationSchema.extend({
  reservationDate: z
    .string()
    .refine((date) => !Number.isNaN(Date.parse(date)), { message: 'La fecha de la reserva es inválida' }),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora de inicio es inválida (formato HH:MM en 24 horas)',
  }),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora de fin es inválida (formato HH:MM en 24 horas)',
  }),
  notes: z.string().max(500, 'Las notas no pueden exceder los 500 caracteres').optional(),
  servicesIds: z.array(z.uuid('El ID del servicio es inválido')).optional(),
  tasks: z.array(updateReservationTaskSchema).optional(),
});

export type UpdateReservationRequest = z.infer<typeof updateReservationSchema>;
