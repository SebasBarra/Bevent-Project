import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="border-b bg-linear-to-r from-primary via-accent to-secondary py-20">
      <div className="custom-container">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-background/95 px-4 py-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm">Comienza Hoy Mismo</span>
          </div>

          <h2 className="mb-6 font-bold text-3xl text-background md:text-4xl">Transforma la Gestión de tus Eventos</h2>

          <p className="mb-10 text-background/90 text-lg">
            Únete a organizadores de eventos en Bolivia que ya están optimizando sus procesos y mejorando la experiencia
            de sus clientes con nuestra plataforma.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="outline" asChild className="w-full bg-background text-foreground sm:w-auto">
              <Link href="/auth/registrarse">
                Crear Cuenta Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              asChild
              className="w-full border-background bg-transparent text-background hover:bg-background/10 sm:w-auto"
            >
              <Link href="/eventos">Ver Salones Disponibles</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
