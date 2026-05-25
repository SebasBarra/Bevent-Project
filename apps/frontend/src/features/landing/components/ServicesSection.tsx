import { ArrowRight, Building2, UserCog } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function ServicesSection() {
  return (
    <section className="border-b py-20">
      <div className="custom-container">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-bold text-3xl md:text-4xl">¿Cómo Funciona?</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Dos formas de usar nuestra plataforma según tus necesidades
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Para Clientes */}
          <Card className="bg-linear-to-br from-secondary/20 to-background p-8">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-secondary/20">
              <Building2 className="h-7 w-7 text-secondary-foreground" />
            </div>

            <Badge className="mb-4">Para Clientes</Badge>

            <h3 className="mb-4 font-semibold text-2xl">Encuentra el Salón Perfecto</h3>

            <ul className="mb-6 space-y-3 text-muted-foreground text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                <span>Explora salones disponibles para bodas, cumpleaños, quinceaños y más</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                <span>Verifica disponibilidad en tiempo real y haz reservas instantáneas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                <span>Recibe cotizaciones personalizadas y compara opciones</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                <span>Gestiona toda la comunicación en un solo lugar</span>
              </li>
            </ul>

            <Button asChild className="w-full">
              <Link href="/eventos">
                Explorar Salones
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Card>

          {/* Para Organizadores */}
          <Card className="bg-linear-to-br from-accent/20 to-background p-8">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-accent/20">
              <UserCog className="h-7 w-7 text-accent-foreground" />
            </div>

            <Badge className="mb-4" variant="secondary">
              Para Organizadores
            </Badge>

            <h3 className="mb-4 font-semibold text-2xl">Publica y Gestiona tus Salones</h3>

            <ul className="mb-6 space-y-3 text-muted-foreground text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>Registra tus salones con fotos, capacidad y servicios incluidos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>Administra reservas, calendario y disponibilidad desde un panel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>Genera cotizaciones automáticas y gestiona proveedores</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>Accede a reportes y análisis para tomar mejores decisiones</span>
              </li>
            </ul>

            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/registrarse?tipo=organizador">
                Registrarme como Organizador
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}
