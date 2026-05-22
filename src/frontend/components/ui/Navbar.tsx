'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { useCart } from '@/frontend/context/CartContext';

const NAV_LINKS = [
  { href: '/catalog',                       label: 'Todo',       isExact: true },
  { href: '/catalog?category=Camisetas',    label: 'Camisetas',  cat: 'Camisetas' },
  { href: '/catalog?category=Pantalones',   label: 'Pantalones', cat: 'Pantalones' },
  { href: '/catalog?category=Accesorios',   label: 'Accesorios', cat: 'Accesorios' },
  { href: '/custom',                        label: 'CUSTOM STUDIO', isExact: true },
];

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const currentCategory = searchParams.get('category');
  
  const { openCart, getTotalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setOpen(false);
  }, [pathname, searchParams]);

  // Evitar hydration mismatch para el número de items
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="group flex items-center gap-0">
          <span className="font-display text-4xl tracking-widest text-foreground transition-colors duration-150 group-hover:text-volt">
            VOLT
          </span>
          <span className="font-display text-4xl tracking-widest text-volt">AR</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map(({ href, label, isExact, cat }) => {
            const isActive = isExact
              ? pathname === '/catalog' && !currentCategory
              : currentCategory === cat;

            return (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors duration-150 ${
                  isActive ? 'text-volt' : 'text-muted-fg hover:text-foreground'
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-volt animate-fade-up" style={{ animationDuration: '0.2s' }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden text-xs font-bold uppercase tracking-widest text-muted-fg transition-colors hover:text-volt sm:block"
          >
            Admin
          </Link>

          {/* Cart */}
          <button
            onClick={openCart}
            className="group relative flex h-10 w-10 items-center justify-center border border-border bg-card text-muted-fg transition-all hover:border-volt hover:text-volt"
            aria-label="Carrito"
          >
            <ShoppingBag className="h-4 w-4 transition-transform group-hover:scale-110" />
            {mounted && getTotalItems() > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-volt text-[10px] font-black text-black">
                {getTotalItems()}
              </span>
            )}
          </button>

          {/* Mobile toggle */}
          <button
            className="flex h-10 w-10 items-center justify-center border border-border bg-card text-muted-fg transition-all hover:border-volt hover:text-volt md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menú"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="absolute left-0 right-0 top-16 border-b border-border bg-surface px-4 py-6 shadow-dark-lg md:hidden animate-fade-up" style={{ animationDuration: '0.2s' }}>
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map(({ href, label, isExact, cat }) => {
              const isActive = isExact
                ? pathname === '/catalog' && !currentCategory
                : currentCategory === cat;
                
              return (
                <Link
                  key={href}
                  href={href}
                  className={`border-l-2 py-3 pl-4 text-sm font-bold uppercase tracking-widest transition-colors ${
                    isActive ? 'border-volt text-volt bg-volt/5' : 'border-transparent text-muted-fg hover:text-foreground hover:bg-card'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <div className="mt-4 border-t border-border pt-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-widest text-muted-fg hover:text-volt"
              >
                Panel de Administración <span className="text-volt">→</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-0">
            <span className="font-display text-4xl tracking-widest text-foreground">VOLT</span>
            <span className="font-display text-4xl tracking-widest text-volt">AR</span>
          </div>
          <div className="hidden gap-2 md:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <div key={href} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-fg opacity-50">
                {label}
              </div>
            ))}
          </div>
          <div className="h-10 w-10 border border-border bg-card" />
        </div>
      </header>
    }>
      <NavbarContent />
    </Suspense>
  );
}
