import { ArrowRight, Building2, Calendar, CheckCircle2, MapPin, Sparkles, Star, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCurrentSession } from '@/features/auth/actions';

export async function HeroSection() {
  const user = await getCurrentSession();

  let redirectUrl = '/auth/registrarse';

  if (user) {
    redirectUrl = user.role === 'Administrador' ? '/admin/salones' : '/cliente/salones';
  }

  return (
    <section className="relative overflow-hidden border-b bg-background py-20 md:py-32">
      {/* Modern Grid Background Pattern */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:32px_32px] opacity-25 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_40%,transparent_100%)]" />

      {/* Dynamic Glowing Ambient Orbs */}
      <div className="-left-10 pointer-events-none absolute top-1/4 z-0 h-80 w-80 animate-pulse-slow rounded-full bg-primary/10 blur-3xl" />
      <div
        className="-right-10 pointer-events-none absolute bottom-1/4 z-0 h-96 w-96 animate-pulse-slow rounded-full bg-secondary/10 blur-3xl"
        style={{ animationDelay: '-3s' }}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/3 z-0 h-64 w-64 animate-pulse-slow rounded-full bg-accent/8 blur-3xl"
        style={{ animationDelay: '-6s' }}
      />

      <div className="custom-container relative z-10">
        {/* Floating Glassmorphic Cards (Placed behind the text using z-0 so they never block readability) */}

        {/* Left Floating Card - Featured Venue */}
        <div className="-translate-y-1/2 pointer-events-none absolute top-[50%] left-0 z-0 hidden w-72 animate-float xl:left-4 xl:block">
          <div className="pointer-events-auto space-y-3 rounded-2xl border border-border/80 bg-background/80 p-4 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105">
            <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-lg bg-linear-to-tr from-primary/30 to-secondary/30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]" />
              <Building2 className="h-10 w-10 animate-pulse text-primary" />
              <div className="absolute top-2 right-2 flex animate-pulse items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 font-bold text-[10px] text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Disponible
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                  Salón Destacado
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  <Star className="h-3 w-3 fill-amber-500" />
                  <span className="font-bold">4.9</span>
                  <span className="text-[10px] text-muted-foreground">(48)</span>
                </div>
              </div>
              <h3 className="font-bold text-foreground text-sm leading-none">Salón Portal del Sol</h3>
              <div className="flex items-center gap-1 pt-0.5 text-muted-foreground text-xs">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">La Paz, Zona Sur</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-2 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 shrink-0 text-secondary" />
                <span>300 pers. máx.</span>
              </div>
              <span className="font-bold text-foreground">Desde $450/hr</span>
            </div>
          </div>
        </div>

        {/* Right Floating Card - Reservation & Analytics */}
        <div className="-translate-y-1/2 pointer-events-none absolute top-[50%] right-0 z-0 hidden w-72 animate-float-reverse xl:right-4 xl:block">
          <div
            className="pointer-events-auto space-y-3 rounded-2xl border border-border/80 bg-background/80 p-4 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105"
            style={{ animationDelay: '-1.5s' }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-xs">Reserva Confirmada</h4>
                  <span className="text-[10px] text-muted-foreground">ID: #REV-2084</span>
                </div>
              </div>
              <div className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 font-bold text-[10px] text-primary">
                Boda
              </div>
            </div>

            <div className="space-y-1.5 py-1 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Cliente:</span>
                <span className="font-medium text-foreground">Andrea & Mateo</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Fecha:</span>
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <Calendar className="h-3 w-3 shrink-0 text-secondary" />
                  18 Oct, 2026
                </span>
              </div>
            </div>

            {/* Sparkline mini-graph */}
            <div className="space-y-2 border-t pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Reservas Activas</span>
                <div className="flex shrink-0 items-center gap-0.5 rounded bg-emerald-500/10 px-1.5 py-0.5 font-bold text-emerald-600 text-xs">
                  <TrendingUp className="h-3 w-3" />
                  <span>+32%</span>
                </div>
              </div>

              <div className="flex h-10 w-full items-end">
                <svg
                  className="h-8 w-full overflow-visible text-primary"
                  viewBox="0 0 100 30"
                  preserveAspectRatio="none"
                >
                  <title>Reservas Activas en el Último Mes</title>
                  <defs>
                    <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0,25 Q 15,18 30,22 T 60,10 T 90,8 T 100,5 L 100,30 L 0,30 Z" fill="url(#chart-grad)" />
                  <path
                    d="M 0,25 Q 15,18 30,22 T 60,10 T 90,8 T 100,5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="5" r="2.5" fill="var(--color-primary)" />
                  <circle
                    cx="100"
                    cy="5"
                    r="4.5"
                    fill="var(--color-primary)"
                    className="animate-ping"
                    style={{ transformOrigin: '100px 5px' }}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area (Set to relative z-10 to stay on top of background cards) */}
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Decorative Sparkles vectors around the text content */}
          <Sparkles className="-left-6 absolute top-0 hidden h-6 w-6 animate-pulse text-primary/40 md:block" />
          <Sparkles
            className="-right-8 absolute bottom-12 hidden h-8 w-8 animate-float text-secondary/30 md:block"
            style={{ animationDelay: '-2s' }}
          />
          <Badge className="relative mb-6 animate-slide-up border border-primary bg-primary/80 text-primary-foreground backdrop-blur-xs transition-all duration-300 hover:bg-primary/90">
            <Sparkles className="mr-2 h-4 w-4 animate-spin" style={{ animationDuration: '6s' }} />
            Plataforma Digital para Eventos Sociales
          </Badge>
          <h1 className="mb-6 animate-slide-up font-bold text-4xl text-foreground leading-tight tracking-tight md:text-6xl">
            Organiza Eventos{' '}
            <span className="relative inline-block px-1">
              <span className="relative z-10 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text font-extrabold text-primary text-transparent">
                Inolvidables
              </span>
              {/* Dynamic underlines */}
              <svg
                className="-bottom-2 absolute left-0 h-2 w-full text-secondary/50"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Decorative underline for "Inolvidables"</title>
                <path d="M0,5 C30,8 70,2 100,5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>{' '}
            con Facilidad
          </h1>

          <p className="mx-auto mb-10 max-w-2xl animate-slide-up text-lg text-muted-foreground leading-relaxed md:text-xl">
            La solución completa para organizadores de eventos y clientes. Gestiona salones, reservas, cotizaciones y
            análisis en un solo lugar. Diseñada para emprendimientos en Bolivia.
          </p>

          <div className="relative z-30 flex animate-slide-up flex-col items-center justify-center gap-4 sm:flex-row">
            {!user ? (
              <Button
                size="lg"
                asChild
                className="hover:-translate-y-0.5 w-full shadow-lg shadow-primary/10 transition-all duration-300 hover:shadow-primary/20 sm:w-auto"
              >
                <Link href="/auth/registrarse">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                asChild
                className="hover:-translate-y-0.5 w-full transition-all duration-300 hover:bg-accent/5 sm:w-auto"
              >
                <Link href={redirectUrl}>Explorar Salones</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
