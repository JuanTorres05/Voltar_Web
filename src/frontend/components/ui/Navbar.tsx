'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { useCart } from '@/frontend/context/CartContext';
import VoltarLogo from '@/frontend/components/ui/VoltarLogo';
import GlobalSearch from '@/frontend/components/ui/GlobalSearch';

const NAV_LINKS = [
  { href: '/catalog',                    label: '[ DROPS ]',      matchPath: '/catalog', exact: true },
  { href: '/artists',                    label: '[ GALERÍA ]',    matchPath: '/artists' },
  { href: '/catalog?category=Camisetas', label: '[ CAMISETAS ]',  cat: 'Camisetas' },
  { href: '/custom',                     label: '[ CUSTOM LAB ]', matchPath: '/custom', isAccent: true },
];

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const currentCategory = searchParams.get('category');

  const { openCart, getTotalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = mounted ? String(getTotalItems()).padStart(2, '0') : '00';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-strong bg-background">
      {/* Top telemetry bar */}
      <div className="hidden border-b border-border bg-surface px-4 py-1 sm:block sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-muted-fg">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-foreground">
              <span className="inline-block h-1.5 w-1.5 bg-terminal" />
              SYS: ONLINE
            </span>
            <span>///</span>
            <span>UNIT: VØLTAR-CORE</span>
            <span>///</span>
            <span>REV 2.6</span>
          </div>
          <div>ARCHIVO URBANO &amp; TALLER DE ESTAMPADO ®</div>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <VoltarLogo size="sm" />
          <div className="flex items-baseline gap-1">
            <span className="font-display text-3xl tracking-[-0.04em] text-foreground transition-colors group-hover:text-volt">
              VØLTAR
            </span>
            <span className="font-mono text-[10px] text-volt">™</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label, matchPath, exact, cat, isAccent }) => {
            const isActive = cat
              ? currentCategory === cat
              : exact
                ? pathname === matchPath && !currentCategory
                : pathname.startsWith(matchPath || '');

            return (
              <Link
                key={href}
                href={href}
                className={`border px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.08em] transition-colors ${
                  isActive
                    ? 'border-volt bg-volt text-white'
                    : isAccent
                      ? 'border-volt/50 text-volt hover:border-volt hover:bg-volt hover:text-white'
                      : 'border-transparent text-muted-fg hover:border-border-strong hover:text-foreground'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right controls + Search */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <GlobalSearch />
          </div>

          <Link
            href="/admin"
            className="hidden border border-border px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-muted-fg transition-colors hover:border-volt hover:text-volt sm:block"
          >
            ADMIN
          </Link>

          <button
            onClick={openCart}
            className="flex h-9 items-center gap-2 border border-border-strong bg-surface px-3 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-foreground transition-colors hover:border-volt hover:bg-volt hover:text-white"
            aria-label="Carrito"
          >
            <span>BAG:</span>
            <span className="text-volt group-hover:text-white">{itemCount}</span>
          </button>

          <button
            className="flex h-9 w-9 items-center justify-center border border-border-strong bg-surface text-foreground transition-colors hover:border-volt hover:text-volt md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menú"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border-strong bg-surface px-4 py-4 md:hidden">
          <div className="mb-3">
            <GlobalSearch />
          </div>
          <nav className="grid gap-px bg-border">
            {NAV_LINKS.map(({ href, label, matchPath, exact, cat }) => {
              const isActive = cat
                ? currentCategory === cat
                : exact
                  ? pathname === matchPath && !currentCategory
                  : pathname.startsWith(matchPath || '');

              return (
                <Link
                  key={href}
                  href={href}
                  className={`bg-background px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.08em] ${
                    isActive ? 'text-volt' : 'text-foreground'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/admin"
              className="bg-background px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.08em] text-muted-fg"
            >
              [ ADMIN // PANEL ]
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-40 w-full border-b border-border-strong bg-background">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <VoltarLogo size="sm" />
              <span className="font-display text-3xl tracking-[-0.04em] text-foreground">
                VØLTAR
              </span>
            </div>
            <div className="h-9 w-20 border border-border-strong bg-surface" />
          </div>
        </header>
      }
    >
      <NavbarContent />
    </Suspense>
  );
}
