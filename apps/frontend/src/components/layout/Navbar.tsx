'use client';

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { shadcn } from '@clerk/themes';
import { Calendar, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { UserSession } from '@/features/auth/types';
import { UserRole } from '@/features/auth/types';
import { cn } from '@/lib/utils';

interface Props {
  user: UserSession | null;
}

interface NavLink {
  href: string;
  label: string;
}

export function Navbar({ user }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Define navigation links based on user role
  const getNavigationLinks = (): NavLink[] => {
    if (!user) {
      // Public navigation
      return [
        { href: '/', label: 'Inicio' },
        { href: '/salones', label: 'Explorar Salones' },
      ];
    }

    // Common links for authenticated users
    const commonLinks: NavLink[] = [{ href: '/', label: 'Inicio' }];

    // Role-specific links
    if (user.role === UserRole.ADMIN) {
      return [
        ...commonLinks,
        { href: '/admin/salones', label: 'Mis Salones' },
        { href: '/admin/reportes', label: 'Reportes' },
      ];
    }

    // CLIENT role
    return [
      ...commonLinks,
      { href: '/cliente/salones', label: 'Explorar Salones' },
      { href: '/cliente/mis-reservas', label: 'Mis Reservas' },
    ];
  };

  const navigationLinks = getNavigationLinks();

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="custom-container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo + Desktop Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-70">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">Bevent</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden items-center gap-1 md:flex">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative rounded-md px-3 py-2 font-medium text-sm transition-colors',
                    isActiveLink(link.href)
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth */}
          <div className="hidden items-center gap-4 md:flex">
            <SignedOut>
              <SignInButton mode="redirect">
                <Button variant="outline">Iniciar Sesión</Button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <Button>Registrarse</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-3">
                {user && (
                  <div className="flex flex-col items-end">
                    <span className="font-medium text-sm">{user.firstName}</span>
                    <span className="text-muted-foreground text-xs">
                      {user.role === UserRole.ADMIN ? 'Organizador' : 'Cliente'}
                    </span>
                  </div>
                )}
                <UserButton
                  appearance={{
                    theme: shadcn,
                  }}
                  afterSwitchSessionUrl="/"
                />
              </div>
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="rounded-md p-2 hover:bg-muted md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t py-4 md:hidden">
            <div className="flex flex-col gap-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-md px-3 py-2 font-medium text-sm transition-colors',
                    isActiveLink(link.href)
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <SignedOut>
                <div className="flex flex-col gap-2 border-t pt-4">
                  <SignInButton mode="redirect">
                    <Button variant="outline" className="w-full">
                      Iniciar Sesión
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="redirect">
                    <Button className="w-full">Registrarse</Button>
                  </SignUpButton>
                </div>
              </SignedOut>

              <SignedIn>
                <div className="flex flex-col gap-3 border-t pt-4">
                  {user && (
                    <div className="flex flex-col px-3">
                      <span className="font-medium text-sm">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {user.role === UserRole.ADMIN ? 'Organizador' : 'Cliente'}
                      </span>
                    </div>
                  )}
                  <UserButton
                    showName
                    appearance={{
                      theme: shadcn,
                    }}
                    afterSwitchSessionUrl="/"
                  />
                </div>
              </SignedIn>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
