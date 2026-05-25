import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b bg-linear-to-br from-secondary/20 via-background to-accent/10 py-20 md:py-32">
      <div className="custom-container">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-6 animate-slide-up">
            <Sparkles className="mr-2 h-4 w-4" />
            Plataforma Digital para Eventos Sociales
          </Badge>

          <h1 className="mb-6 animate-slide-up font-bold text-4xl leading-tight md:text-6xl">
            Organiza Eventos{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">Inolvidables</span>
            </span>{' '}
            con Facilidad
          </h1>

          <p className="mb-10 animate-slide-up text-lg text-muted-foreground md:text-xl">
            La solución completa para organizadores de eventos y clientes. Gestiona salones, reservas, cotizaciones y
            análisis en un solo lugar. Diseñada para emprendimientos en Bolivia.
          </p>

          <div className="flex animate-slide-up flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/auth/registrarse">
                Comenzar Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/eventos">Explorar Salones</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="-right-20 -top-20 absolute h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="-bottom-20 -left-20 absolute h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
    </section>
  );
}
