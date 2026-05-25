import { Calendar } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-muted">
      <div className="custom-container py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">Bevent</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Plataforma digital para la organización y administración de eventos sociales en Bolivia.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 font-semibold text-sm">Plataforma</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/eventos" className="text-muted-foreground transition-colors hover:text-foreground">
                  Explorar Salones
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/registrarse"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Registrarse
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/iniciar-sesion"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Iniciar Sesión
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} Bevent. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
