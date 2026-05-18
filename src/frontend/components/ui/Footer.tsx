import Link from 'next/link';
import { Instagram, Twitter, Youtube } from 'lucide-react';

const COLS = {
  Colección: [
    { href: '/catalog?category=Camisetas',  label: 'Camisetas' },
    { href: '/catalog?category=Pantalones', label: 'Pantalones' },
    { href: '/catalog?category=Accesorios', label: 'Accesorios' },
    { href: '/catalog?category=Zapatos',    label: 'Zapatos' },
  ],
  Info: [
    { href: '#', label: 'Guía de tallas' },
    { href: '#', label: 'Envíos' },
    { href: '#', label: 'Devoluciones' },
    { href: '#', label: 'Contacto' },
  ],
};

const SOCIALS = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter,   href: '#', label: 'Twitter' },
  { icon: Youtube,   href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      {/* Marquee banner */}
      <div className="overflow-hidden border-b border-border bg-volt py-2">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-6 font-display text-lg tracking-widest text-black">
              VOLTAR · SIN LÍMITES · ROMPE ESQUEMAS · MODA URBANA ·
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-display text-5xl tracking-widest text-foreground">VOLT</span>
              <span className="font-display text-5xl tracking-widest text-volt">AR</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-fg">
              Moda urbana para quienes no siguen las reglas. Construida para la calle, pensada para los que se atreven.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center border border-border text-muted-fg transition-all hover:border-volt hover:text-volt"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(COLS).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-4 font-display text-xl tracking-widest text-volt">{title}</h3>
              <ul className="space-y-2">
                {links.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm font-medium text-muted-fg transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-fg">
            © {new Date().getFullYear()} VOLTAR. Todos los derechos reservados.
          </p>
          <p className="text-xs uppercase tracking-widest text-muted-fg">
            Sin límites — Next.js 14 + Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
