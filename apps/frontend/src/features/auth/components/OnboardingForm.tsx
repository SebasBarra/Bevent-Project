'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { completeOnboardingAction } from '@/features/auth/actions';
import { type OnboardingFormData, onboardingFormSchema } from '@/features/auth/schemas';
import type { UserRole, UserSession } from '@/features/auth/types';

interface Props {
  user: UserSession;
  role: UserRole;
}

export function OnboardingForm({ user, role }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  const onSubmit = async (data: OnboardingFormData) => {
    setIsLoading(true);

    const result = await completeOnboardingAction({
      clerkId: user.clerkId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: data.phoneNumber,
      role,
    });

    if (result.success) {
      toast.success('¡Registro completado exitosamente!');
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 500);
    } else {
      setIsLoading(false);
      toast.error(result.error.detail);
    }
  };

  const roleText = role === 'Administrador' ? 'Organizador' : 'Cliente';

  return (
    <div className="custom-container max-w-md">
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="mb-2 font-semibold text-2xl">Completa tu perfil</h2>
          <p className="text-muted-foreground text-sm">
            Estás registrándote como <span className="font-medium text-foreground">{roleText}</span>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Información del usuario (solo lectura) */}
            <div className="space-y-3 rounded-lg bg-muted/50 p-4">
              <div>
                <p className="text-muted-foreground text-xs">Nombre completo</p>
                <p className="font-medium text-sm">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Correo electrónico</p>
                <p className="font-medium text-sm">{user.email}</p>
              </div>
            </div>

            {/* Campo de teléfono */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de teléfono</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" placeholder="+591 12345678" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completando registro...
                </>
              ) : (
                <>
                  Completar registro
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
