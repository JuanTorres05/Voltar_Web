import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const DROPS = [
  { slug: 'Camisetas',  label: 'CAMISETAS',  sub: 'Oversize · Cropped',        tag: 'NEW DROP',   img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop' },
  { slug: 'Pantalones', label: 'PANTALONES', sub: 'Cargo · Jogger · Street',   tag: 'BESTSELLER', img: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=800&auto=format&fit=crop' },
  { slug: 'Accesorios', label: 'ACCESORIOS', sub: 'Gorras · Complementos',     tag: null,         img: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=800&auto=format&fit=crop' },
  { slug: 'Zapatos',    label: 'ZAPATOS',    sub: 'Kicks que marcan',          tag: 'PRONTO',     img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop' },
];

const MANIFESTO = [
  'SIN LÍMITES',
  'ROMPE ESQUEMAS',
  'ENERGY',
  'STREET',
  'YOUTH',
  'VOLTAR',
];

export default function HomePage() {
  return (
    <div className="bg-background text-foreground">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center">

        {/* Volt stripe grid background */}
        <div className="pointer-events-none absolute inset-0 volt-grid opacity-70" />

        {/* Glow blob */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(200,255,0,0.08) 0%, transparent 60%)' }}
        />

        <div className="relative z-10 flex flex-col items-center">
          {/* Pre-title */}
          <div className="mb-4 animate-fade-up">
            <span className="tag-volt">Nueva colección 2025</span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-[22vw] leading-[0.85] tracking-wide text-foreground sm:text-[18vw] lg:text-[15vw] animate-fade-up delay-100">
            VOLT<span className="text-volt">AR</span>
          </h1>

          {/* Sub tagline */}
          <p className="mt-6 max-w-xl text-lg font-medium uppercase tracking-widest text-muted-fg animate-fade-up delay-200">
            Moda urbana para los que{' '}
            <span className="text-volt font-bold">rompen esquemas</span>
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row animate-fade-up delay-300">
            <Link
              href="/catalog"
              className="group flex items-center justify-center gap-3 bg-volt px-10 py-4 text-sm font-black uppercase tracking-widest text-black transition-all duration-150 hover:-translate-y-1 hover:shadow-volt"
            >
              Ver colección
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/catalog?category=Camisetas"
              className="flex items-center justify-center border border-border-strong bg-surface px-10 py-4 text-sm font-black uppercase tracking-widest text-foreground transition-all hover:border-volt hover:text-volt"
            >
              Camisetas
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-up delay-400">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-fg">Scroll</span>
          <div className="h-12 w-[1px] bg-gradient-to-b from-volt to-transparent" />
        </div>
      </section>

      {/* ── MARQUEE MANIFESTO ────────────────────────────────── */}
      <div className="overflow-hidden border-y border-border bg-surface py-5">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 3 }).map((_, i) =>
            MANIFESTO.map((word) => (
              <span key={`${i}-${word}`} className="mx-8 font-display text-3xl tracking-widest text-muted-fg">
                {word}
                <span className="ml-8 text-volt">·</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ── CUSTOM STUDIO BANNER ───────────────────────────────── */}
      <section className="border-b border-border bg-black text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <span className="tag-volt mb-6 inline-block">NUEVA EXPERIENCIA</span>
          <h2 className="font-display text-5xl text-white sm:text-7xl lg:text-8xl uppercase">
            Crea tu propio <span className="text-volt">Drop</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base font-medium text-muted-fg">
            No te conformes con lo que hay. Entra al Custom Studio, sube tu arte y diseña tu propia pieza única. Tú pones las reglas.
          </p>
          <Link
            href="/custom"
            className="mt-10 inline-flex items-center gap-3 border-2 border-volt bg-volt px-10 py-4 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-black hover:text-volt hover:-translate-y-1"
          >
            Entrar al Custom Studio
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── DROPS / CATEGORÍAS ──────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between border-b border-border pb-6">
          <h2 className="font-display text-6xl text-foreground sm:text-7xl">
            DROPS
          </h2>
          <Link
            href="/catalog"
            className="text-xs font-black uppercase tracking-widest text-volt hover:text-foreground transition-colors"
          >
            Ver todo →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DROPS.map(({ slug, label, sub, tag, img }) => (
            <Link
              key={slug}
              href={`/catalog?category=${slug}`}
              className="group relative flex flex-col justify-end overflow-hidden border border-border bg-surface p-6 transition-all duration-300 hover:border-volt hover:-translate-y-1"
              style={{ minHeight: '380px' }}
            >
              {/* Background Image */}
              <Image 
                src={img} 
                alt={label} 
                fill 
                className="object-cover object-center opacity-40 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-60"
                unoptimized
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

              {/* Content */}
              <div className="relative z-10">
                {tag && (
                  <span className="tag-volt mb-4 inline-block">{tag}</span>
                )}
                <h3 className="font-display text-5xl text-foreground transition-colors duration-150 group-hover:text-volt">
                  {label}
                </h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-fg">{sub}</p>
                <div className="mt-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-fg transition-colors group-hover:text-volt">
                  Explorar
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── MANIFIESTO ──────────────────────────────────────── */}
      <section className="border-y border-border bg-surface px-4 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-6xl text-foreground sm:text-7xl lg:text-8xl">
            NO SOMOS <span className="text-volt">UNA MARCA.</span><br />
            SOMOS UN<br />
            <span className="text-gradient-volt">MOVIMIENTO.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-base font-medium leading-relaxed text-muted-fg">
            Voltar nació para los que se cansan de lo mismo. Para la juventud que tiene energía de sobra y ganas de romper todo lo que le dijeron que no podía. Sin límites. Sin reglas. Sin miedo.
          </p>
          <Link
            href="/catalog"
            className="mt-10 inline-flex items-center gap-3 bg-volt px-10 py-4 text-sm font-black uppercase tracking-widest text-black transition-all hover:-translate-y-1 hover:shadow-volt"
          >
            Únete al movimiento
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            { value: '+500',  label: 'Productos' },
            { value: '+2K',   label: 'Guerreros Voltar' },
            { value: '100%',  label: 'Sin límites' },
            { value: '4.9★',  label: 'Rating' },
          ].map(({ value, label }) => (
            <div key={label} className="border-l-2 border-volt pl-5">
              <p className="font-display text-5xl text-volt sm:text-6xl">{value}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-fg">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────── */}
      <section className="overflow-hidden border-t border-border bg-volt px-4 py-16 text-center">
        <div className="relative">
          {/* Big background text */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <span className="font-display text-[20vw] font-black text-black/10 leading-none">VOLTAR</span>
          </div>
          <h2 className="relative font-display text-5xl text-black sm:text-6xl lg:text-7xl">
            ¿LISTO PARA EL DROP?
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-base font-semibold text-black/70">
            Envío gratis en tu primer pedido. Sin excusas.
          </p>
          <Link
            href="/catalog"
            className="relative mt-8 inline-flex items-center gap-3 border-2 border-black bg-black px-10 py-4 text-sm font-black uppercase tracking-widest text-volt transition-all hover:-translate-y-1"
          >
            Entrar al catálogo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
