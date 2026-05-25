import { z } from 'zod';

export const onboardingFormSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'El número de teléfono es requerido')
    .regex(/^(\+?591)?[2-7]\d{7}$/, 'Ingresa un número válido (ej: 71234567, +59171234567)'),
});

export type OnboardingFormData = z.infer<typeof onboardingFormSchema>;
