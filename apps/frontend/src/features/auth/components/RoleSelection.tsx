'use client';

import { ArrowRight, Building2, UserCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserRole } from '@/features/auth/types';
import { cn } from '@/lib/utils';

export function RoleSelection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedRole = searchParams.get('role') as UserRole | null;

  const handleRoleSelection = (role: UserRole) => {
    router.push(`/auth/onboarding?role=${role}`);
  };

  return (
    <div className="custom-container">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Cliente */}
        <Card
          className={cn(
            'group cursor-pointer p-6 transition-all hover:shadow-lg',
            selectedRole === UserRole.CLIENT
              ? 'border-primary bg-primary/5 ring-2 ring-primary'
              : 'hover:border-primary/50',
          )}
          onClick={() => handleRoleSelection(UserRole.CLIENT)}
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
            <UserCircle className="h-6 w-6 text-primary" />
          </div>

          <h3 className="mb-2 font-semibold text-xl">Soy Cliente</h3>

          <p className="mb-4 text-muted-foreground text-sm">
            Quiero buscar y reservar salones para mis eventos (bodas, cumpleaños, quinceaños, etc.)
          </p>

          <ul className="mb-6 space-y-2 text-sm">
            <li className="flex items-start gap-2 text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>Explorar salones disponibles</span>
            </li>
            <li className="flex items-start gap-2 text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>Hacer reservas instantáneas</span>
            </li>
            <li className="flex items-start gap-2 text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>Recibir cotizaciones</span>
            </li>
          </ul>

          <Button className="w-full" variant={selectedRole === UserRole.CLIENT ? 'default' : 'outline'} size="sm">
            Continuar como Cliente
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>

        {/* Administrador */}
        <Card
          className={cn(
            'group cursor-pointer p-6 transition-all hover:shadow-lg',
            selectedRole === UserRole.ADMIN
              ? 'border-primary bg-primary/5 ring-2 ring-primary'
              : 'hover:border-primary/50',
          )}
          onClick={() => handleRoleSelection(UserRole.ADMIN)}
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
            <Building2 className="h-6 w-6 text-primary" />
          </div>

          <h3 className="mb-2 font-semibold text-xl">Soy Organizador</h3>

          <p className="mb-4 text-muted-foreground text-sm">
            Tengo salones de eventos y quiero publicarlos para que los clientes los encuentren
          </p>

          <ul className="mb-6 space-y-2 text-sm">
            <li className="flex items-start gap-2 text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>Publicar mis salones</span>
            </li>
            <li className="flex items-start gap-2 text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>Gestionar reservas y calendario</span>
            </li>
            <li className="flex items-start gap-2 text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>Generar cotizaciones automáticas</span>
            </li>
          </ul>

          <Button className="w-full" variant={selectedRole === UserRole.ADMIN ? 'default' : 'outline'} size="sm">
            Continuar como Organizador
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>
      </div>
    </div>
  );
}
