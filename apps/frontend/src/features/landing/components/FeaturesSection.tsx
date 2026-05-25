import { BarChart3, Calendar, Clock, FileText, Shield, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: Calendar,
    title: 'Gestión de Eventos',
    description:
      'Organiza y administra todos tus eventos en un calendario digital centralizado. Evita duplicaciones y errores.',
  },
  {
    icon: Users,
    title: 'Comunicación Unificada',
    description: 'Centraliza todas las interacciones con clientes en un solo lugar. No más información dispersa.',
  },
  {
    icon: FileText,
    title: 'Cotizaciones Automáticas',
    description: 'Genera presupuestos precisos y personalizados en minutos. Reduce errores de cálculo manual.',
  },
  {
    icon: BarChart3,
    title: 'Business Intelligence',
    description: 'Analiza tendencias, patrones estacionales y preferencias de clientes con dashboards intuitivos.',
  },
  {
    icon: Clock,
    title: 'Reservas en Tiempo Real',
    description: 'Verifica disponibilidad instantáneamente y confirma reservas sin demoras ni confusiones.',
  },
  {
    icon: Shield,
    title: 'Datos Seguros',
    description: 'Protege información crítica de clientes y eventos. Elimina el riesgo de pérdida de datos.',
  },
];

export function FeaturesSection() {
  return (
    <section className="border-b bg-muted/30 py-20">
      <div className="custom-container">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-bold text-3xl md:text-4xl">Soluciones para Cada Desafío</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Diseñada específicamente para resolver los problemas que enfrentan los organizadores de eventos sociales en
            Bolivia
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="group p-6 transition-all hover:shadow-lg"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-transform group-hover:scale-110">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-xl">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
