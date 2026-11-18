import Link from 'next/link';
import VoltarLogo from '@/frontend/components/ui/VoltarLogo';

const COLS = {
  '[ ARCHIVO ]': [
    { href: '/artists',                    label: 'GALERÍA DE ARTISTAS' },
    { href: '/custom',                     label: 'CUSTOM LAB // ESTAMPADO' },
    { href: '/catalog?category=Camisetas', label: 'CAMISETAS 220GSM' },
    { href: '/catalog?category=Pantalones',label: 'PANTALONES CARGO' },
  ],
  '[ SISTEMA ]': [
    { href: '/catalog', label: 'CATÁLOGO COMPLETO' },
    { href: '/admin',   label: 'PANEL DE CONTROL' },
    { href: '#',        label: 'ESPECIFICACIONES DE TALLA' },
    { href: '#',        label: 'PROTOCOLO DE ENVÍOS' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border-strong bg-background">
      {/* Hazard Red Telemetry Marquee */}
      <div className="overflow-hidden border-b border-border-strong bg-volt py-2">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="mx-6 font-mono text-xs font-extrabold uppercase tracking-[0.15em] text-white"
            >
              VØLTAR® /// INDUSTRIAL STREETWEAR /// GALERÍA URBANA /// CUSTOM LAB /// NO LIMITS ///
            </span>
          ))}
        </div>
      </div>

      {/* Blueprint Grid Container */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-4">
          {/* Brand cell */}
          <div className="flex flex-col justify-between bg-surface p-6 md:col-span-2">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <VoltarLogo size="md" />
                <div>
                  <span className="font-display text-4xl tracking-[-0.04em] text-foreground">
                    VØLTAR
                  </span>
                  <span className="ml-1 font-mono text-xs text-volt">®</span>
                </div>
              </Link>
              <p className="mt-4 max-w-sm font-mono text-xs uppercase leading-relaxed tracking-wider text-muted-fg">
                SISTEMA DE INDUMENTARIA URBANA Y GALERÍA DE ARTISTAS EMERGENTES.
                ARTE CALLEJERO IMPRESO SOBRE TEXTIL PESADO.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="barcode-strip h-6 w-32 opacity-70" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-fg">
                ID // VLT-2025-RAW
              </span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(COLS).map(([title, links]) => (
            <div key={title} className="bg-background p-6">
              <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.12em] text-volt">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="font-mono text-[11px] uppercase tracking-wider text-muted-fg transition-colors hover:text-foreground"
                    >
                      &gt; {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-fg sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} VØLTAR® — TODOS LOS DERECHOS RESERVADOS.</p>
          <p>LAT: 04°36&apos;N / LON: 74°04&apos;W — TACTICAL TELEMETRY UI</p>
        </div>
      </div>
    </footer>
  );
}
