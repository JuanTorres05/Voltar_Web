'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOCK_ARTWORKS } from '@/shared/data/artists.mock';
import { CUSTOM_PIECES_SHOWCASE } from '@/shared/data/custom-pieces.mock';
import VoltarLogo from '@/frontend/components/ui/VoltarLogo';

gsap.registerPlugin(ScrollTrigger);

const EASE_OUT = 'easeOut' as const;

const cellReveal = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
};

const gridStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const DROPS = [
  { code: '01', slug: 'Camisetas',  label: 'CAMISETAS',  spec: '220GSM // BOXY FIT',   tag: '[ DROP-01 ]', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop' },
  { code: '02', slug: 'Pantalones', label: 'PANTALONES', spec: 'RIPSTOP // 6 POCKETS', tag: '[ DROP-02 ]', img: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=800&auto=format&fit=crop' },
  { code: '03', slug: 'Accesorios', label: 'ACCESORIOS', spec: 'HEADWEAR // HARDWARE', tag: '[ DROP-03 ]', img: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=800&auto=format&fit=crop' },
  { code: '04', slug: 'Zapatos',    label: 'ZAPATOS',    spec: 'CHUNKY // PROTO-V1',   tag: '[ PRONTO ]',  img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop' },
];

const TELEMETRY_TICKER = [
  'ARCHIVO URBANO VØLTAR®',
  'SECTOR: STREETWEAR & GALERÍA',
  'SERIGRAFÍA 300DPI',
  'ALGODÓN 220GSM',
  'ARTISTAS EMERGENTES',
  'CUSTOM LAB ACTIVO',
];

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const customBannerRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const specimenY = useTransform(heroScroll, [0, 1], [0, 50]);
  const titleY = useTransform(heroScroll, [0, 1], [0, -35]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance stagger
      gsap.from('.hero-anim', {
        opacity: 0,
        y: 36,
        duration: 0.75,
        stagger: 0.1,
        ease: 'expo.out',
        clearProps: 'transform',
      });

      // Custom Lab headline skew-wipe on scroll
      if (customBannerRef.current) {
        gsap.from('.custom-banner-anim', {
          opacity: 0,
          y: 50,
          skewY: 2,
          duration: 0.85,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: customBannerRef.current,
            start: 'top 80%',
            once: true,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const [artworkPage, setArtworkPage] = useState(0);
  const ITEMS_PER_PAGE = 4;
  const totalArtworkPages = Math.ceil(MOCK_ARTWORKS.length / ITEMS_PER_PAGE);
  const visibleArtworks = MOCK_ARTWORKS.slice(
    artworkPage * ITEMS_PER_PAGE,
    artworkPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const handlePrevArtworks = () => {
    setArtworkPage((prev) => (prev === 0 ? totalArtworkPages - 1 : prev - 1));
  };

  const handleNextArtworks = () => {
    setArtworkPage((prev) => (prev + 1) % totalArtworkPages);
  };

  return (
    <div className="bg-background text-foreground">

      {/* ── HERO: BLUEPRINT TERMINAL ──────────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden border-b border-border-strong bg-background volt-grid"
      >
        {/* Top Metadata Strip */}
        <div className="border-b border-border bg-surface px-4 py-2 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-fg">
            <span>[ REF // VLT-001-ARCHIVE ]</span>
            <span>DIVISIÓN: GALERÍA URBANA &amp; INDUMENTARIA</span>
            <span className="text-volt">[ STATUS: OPERATIVO ]</span>
          </div>
        </div>

        {/* Main Blueprint Grid */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 gap-px border border-border-strong bg-border-strong lg:grid-cols-12">

            {/* Left 8 cols: Macro-Typography */}
            <div className="relative flex flex-col justify-between bg-background p-6 sm:p-10 lg:col-span-8">
              <span className="pointer-events-none absolute left-2 top-1 font-mono text-xs text-muted-fg">+</span>
              <span className="pointer-events-none absolute right-2 top-1 font-mono text-xs text-muted-fg">+</span>

              <motion.div style={{ y: titleY }}>
                <div className="hero-anim mb-6 flex flex-wrap items-center gap-3">
                  <span className="tag-volt">UNIT // 2025</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-fg">
                    &lt; INDUSTRIAL STREETWEAR &gt;
                  </span>
                </div>

                <h1
                  className="hero-anim inline-flex items-start whitespace-nowrap font-display uppercase tracking-[-0.05em] text-foreground"
                  style={{ fontSize: 'clamp(3.4rem, 9vw, 8rem)', lineHeight: 0.85 }}
                >
                  <span>
                    VØLT<span className="text-volt">AR</span>
                  </span>
                  <span className="ml-1.5 mt-1 font-mono text-[0.16em] font-bold leading-none tracking-normal text-muted-fg">
                    ®
                  </span>
                </h1>

                <p className="hero-anim mt-6 max-w-xl font-mono text-xs uppercase leading-relaxed tracking-[0.08em] text-muted-fg sm:text-sm">
                  PLATAFORMA DE MODA URBANA Y EXHIBICIÓN DE ARTISTAS CALLEJEROS.
                  SELECCIONA UNA OBRA DEL ARCHIVO Y ESTÁMPALA EN TEXTIL PESADO.
                </p>
              </motion.div>

              {/* Action Bar */}
              <div className="hero-anim mt-10 grid grid-cols-1 gap-px border border-border-strong bg-border-strong sm:grid-cols-3">
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/artists"
                    className="flex items-center justify-between bg-volt px-5 py-4 font-mono text-xs font-extrabold uppercase tracking-[0.08em] text-white transition-colors hover:bg-foreground hover:text-background"
                  >
                    <span>[ GALERÍA ]</span>
                    <span>&gt;&gt;&gt;</span>
                  </Link>
                </motion.div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/custom"
                    className="flex items-center justify-between bg-surface px-5 py-4 font-mono text-xs font-extrabold uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-volt hover:text-white"
                  >
                    <span>[ CUSTOM LAB ]</span>
                    <span>+</span>
                  </Link>
                </motion.div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/catalog"
                    className="flex items-center justify-between bg-background px-5 py-4 font-mono text-xs font-extrabold uppercase tracking-[0.08em] text-muted-fg transition-colors hover:bg-surface hover:text-foreground"
                  >
                    <span>[ TIENDA ]</span>
                    <span>///</span>
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Right 4 cols: Official Specimen Box */}
            <div className="hero-anim flex flex-col justify-between bg-surface p-6 sm:p-8 lg:col-span-4">
              <div className="flex items-center justify-between border-b border-border pb-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-fg">
                <span>SPECIMEN // 00</span>
                <span className="text-volt">EMBLEMA OFICIAL</span>
              </div>

              <motion.div
                style={{ y: specimenY }}
                className="my-8 flex flex-col items-center justify-center"
              >
                <VoltarLogo size="hero" />
                <div className="mt-4 barcode-strip h-4 w-40 opacity-80" />
              </motion.div>

              <dl className="grid grid-cols-2 gap-px border border-border bg-border font-mono text-[10px] uppercase">
                <div className="bg-background p-2.5">
                  <dt className="text-muted-fg">GRAMAJE</dt>
                  <dd className="mt-0.5 font-bold text-foreground">220 GSM</dd>
                </div>
                <div className="bg-background p-2.5">
                  <dt className="text-muted-fg">IMPRESIÓN</dt>
                  <dd className="mt-0.5 font-bold text-foreground">DTG / 300DPI</dd>
                </div>
                <div className="bg-background p-2.5">
                  <dt className="text-muted-fg">ARTISTAS</dt>
                  <dd className="mt-0.5 font-bold text-volt">ACTIVOS</dd>
                </div>
                <div className="bg-background p-2.5">
                  <dt className="text-muted-fg">ORIGEN</dt>
                  <dd className="mt-0.5 font-bold text-foreground">LATAM CREW</dd>
                </div>
              </dl>
            </div>

          </div>
        </div>

        {/* Hazard Strip Divider */}
        <div className="hazard-stripes h-3 w-full border-t border-border-strong" />
      </section>

      {/* ── TELEMETRY MARQUEE ─────────────────────────────────── */}
      <div className="overflow-hidden border-b border-border-strong bg-surface py-3">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) =>
            TELEMETRY_TICKER.map((item) => (
              <span
                key={`${i}-${item}`}
                className="mx-6 font-mono text-xs font-bold uppercase tracking-[0.15em] text-foreground"
              >
                {item} <span className="ml-6 text-volt">///</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ── GALERÍA URBANA: COMPARTMENTALIZED GRID ────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={cellReveal}
          className="mb-8 flex flex-col justify-between gap-4 border-b border-border-strong pb-5 sm:flex-row sm:items-end"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-volt">
              [ ARCHIVO DE OBRAS ESTAMPABLES // REV 2.6 ]
            </p>
            <h2
              className="mt-2 font-display uppercase tracking-[-0.04em] text-foreground"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', lineHeight: 0.9 }}
            >
              MURO DE ARTISTAS
            </h2>
          </div>
          <Link
            href="/artists"
            className="border border-border-strong bg-surface px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.1em] text-foreground transition-colors hover:border-volt hover:bg-volt hover:text-white"
          >
            [ VER ARCHIVO COMPLETO &gt;&gt;&gt; ]
          </Link>
        </motion.div>

        {/* Carrusel con una flecha a cada lado de los 4 artistas */}
        <div className="relative flex items-stretch">
          {/* Flecha izquierda */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevArtworks}
            aria-label="Artistas anteriores"
            className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-border-strong bg-background/95 text-foreground transition-colors hover:border-volt hover:bg-volt hover:text-white lg:static lg:h-auto lg:w-12 lg:shrink-0 lg:translate-y-0 lg:border-r-0 lg:bg-surface"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>

          {/* Blueprint 1px-gap grid with stagger */}
          <motion.div
            key={artworkPage}
            initial="hidden"
            animate="show"
            variants={gridStagger}
            className="grid flex-1 grid-cols-1 gap-px border border-border-strong bg-border-strong sm:grid-cols-2 lg:grid-cols-4"
          >
          {visibleArtworks.map((work, idx) => (
            <motion.article
              key={work.id}
              variants={cellReveal}
              className="group flex flex-col justify-between bg-background transition-colors hover:bg-surface"
            >
              {/* Header metadata */}
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.08em]">
                <span className="text-muted-fg">
                  UNIT // {String(artworkPage * ITEMS_PER_PAGE + idx + 1).padStart(2, '0')}
                </span>
                <span className="text-volt">[{work.style}]</span>
              </div>

              {/* Artwork preview */}
              <div className="relative aspect-square overflow-hidden border-b border-border bg-card">
                <span className="pointer-events-none absolute left-2 top-1 z-10 font-mono text-[10px] text-white/70">+</span>
                <span className="pointer-events-none absolute right-2 top-1 z-10 font-mono text-[10px] text-white/70">+</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={work.image_url}
                  alt={work.title}
                  className="h-full w-full object-cover grayscale contrast-125 transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
                />
              </div>

              {/* Footer info & CTA */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-fg">
                    ARTISTA: <span className="text-foreground">{work.artist_tag}</span>
                  </p>
                  <h3 className="mt-1.5 font-display text-2xl tracking-[-0.03em] text-foreground group-hover:text-volt">
                    {work.title}
                  </h3>
                </div>

                <Link
                  href={`/custom?art=${encodeURIComponent(work.image_url)}&artist=${encodeURIComponent(
                    work.artist_tag
                  )}&title=${encodeURIComponent(work.title)}`}
                  className="mt-5 flex items-center justify-between border border-border-strong bg-surface px-3 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-foreground transition-colors hover:border-volt hover:bg-volt hover:text-white"
                >
                  <span>[ ESTAMPAR ]</span>
                  <span>&gt;&gt;&gt;</span>
                </Link>
              </div>
            </motion.article>
          ))}
          </motion.div>

          {/* Flecha derecha */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleNextArtworks}
            aria-label="Siguientes artistas"
            className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-border-strong bg-background/95 text-foreground transition-colors hover:border-volt hover:bg-volt hover:text-white lg:static lg:h-auto lg:w-12 lg:shrink-0 lg:translate-y-0 lg:border-l-0 lg:bg-surface"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </div>
      </section>

      {/* ── CUSTOM LAB TERMINAL BANNER ────────────────────────── */}
      <section ref={customBannerRef} className="border-y border-border-strong bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-px border border-border-strong bg-border-strong lg:grid-cols-12">
            <div className="bg-background p-8 lg:col-span-8 lg:p-12">
              <span className="custom-banner-anim tag-volt mb-4 inline-block">
                [ MÓDULO // CUSTOM LAB ]
              </span>
              <h2
                className="custom-banner-anim font-display uppercase tracking-[-0.04em] text-foreground"
                style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 0.88 }}
              >
                TU DISEÑO EN <span className="text-volt">ALTO GRAMAJE</span>
              </h2>
              <p className="custom-banner-anim mt-5 max-w-xl font-mono text-xs uppercase leading-relaxed tracking-wider text-muted-fg">
                CARGA UNA OBRA DE LA GALERÍA O SUBE TU PROPIO ARCHIVO PNG.
                AJUSTA COORDENADAS X/Y, ESCALA Y COLOR BASE EN TIEMPO REAL.
              </p>
            </div>

            <div className="custom-banner-anim flex flex-col justify-between bg-card p-8 lg:col-span-4">
              <dl className="space-y-3 font-mono text-xs uppercase">
                <div className="flex justify-between border-b border-border pb-2">
                  <dt className="text-muted-fg">FORMATO:</dt>
                  <dd className="font-bold text-foreground">PNG / SVG</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <dt className="text-muted-fg">PRECIO BASE:</dt>
                  <dd className="font-bold text-foreground">$45.00 USD</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <dt className="text-muted-fg">REGALÍA ARTISTA:</dt>
                  <dd className="font-bold text-volt">+$5.00 USD</dd>
                </div>
              </dl>

              <motion.div whileTap={{ scale: 0.98 }}>
                <Link
                  href="/custom"
                  className="mt-8 flex items-center justify-between bg-volt px-6 py-4 font-mono text-xs font-extrabold uppercase tracking-[0.1em] text-white transition-colors hover:bg-foreground hover:text-background"
                >
                  <span>[ ABRIR CUSTOM LAB ]</span>
                  <span>&gt;&gt;&gt;</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DROPS / CATEGORÍAS DE TIENDA ──────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={cellReveal}
          className="mb-8 flex items-end justify-between border-b border-border-strong pb-5"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-volt">
              [ INVENTARIO // CATÁLOGO BASE ]
            </p>
            <h2
              className="mt-2 font-display uppercase tracking-[-0.04em] text-foreground"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', lineHeight: 0.9 }}
            >
              DROPS OFICIALES
            </h2>
          </div>
          <Link
            href="/catalog"
            className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-volt hover:underline"
          >
            [ VER TODO &gt;&gt;&gt; ]
          </Link>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={gridStagger}
          className="grid grid-cols-1 gap-px border border-border-strong bg-border-strong sm:grid-cols-2 lg:grid-cols-4"
        >
          {DROPS.map(({ code, slug, label, spec, tag, img }) => (
            <motion.div key={slug} variants={cellReveal}>
              <Link
                href={`/catalog?category=${slug}`}
                className="group relative flex min-h-[380px] flex-col justify-between overflow-hidden bg-background p-6 transition-colors hover:bg-surface"
              >
                <Image
                  src={img}
                  alt={label}
                  fill
                  className="object-cover object-center opacity-35 grayscale contrast-125 transition-all duration-300 group-hover:scale-105 group-hover:opacity-55 group-hover:grayscale-0"
                  unoptimized
                />

                <div className="relative z-10 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.1em]">
                  <span className="bg-background/90 px-2 py-1 text-foreground">{tag}</span>
                  <span className="font-display text-3xl text-volt">{code}</span>
                </div>

                <div className="relative z-10 border-t border-border-strong bg-background/90 p-4">
                  <h3 className="font-display text-4xl tracking-[-0.03em] text-foreground group-hover:text-volt">
                    {label}
                  </h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-fg">
                    {spec}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── PIEZAS PERSONALIZADAS (ARCHIVO DE PRODUCCIÓN) ─────── */}
      <section className="border-t border-border-strong bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={cellReveal}
            className="mb-8 flex flex-col justify-between gap-4 border-b border-border-strong pb-5 sm:flex-row sm:items-end"
          >
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-volt">
                [ ARCHIVO DE TALLER // PRENDAS ENTREGADAS ]
              </p>
              <h2
                className="mt-2 font-display uppercase tracking-[-0.04em] text-foreground"
                style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', lineHeight: 0.9 }}
              >
                PIEZAS PERSONALIZADAS
              </h2>
            </div>
            <Link
              href="/custom"
              className="border border-border-strong bg-background px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.1em] text-foreground transition-colors hover:border-volt hover:bg-volt hover:text-white"
            >
              [ CREA LA TUYA EN CUSTOM LAB &gt;&gt;&gt; ]
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            variants={gridStagger}
            className="grid grid-cols-1 gap-px border border-border-strong bg-border-strong sm:grid-cols-2 lg:grid-cols-4"
          >
            {CUSTOM_PIECES_SHOWCASE.map((piece) => (
              <motion.article
                key={piece.id}
                variants={cellReveal}
                className="group flex flex-col justify-between bg-background transition-colors hover:bg-card"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.08em]">
                  <span className="text-muted-fg">[{piece.code}]</span>
                  <span className="text-volt">{piece.technique}</span>
                </div>

                {/* Garment photo */}
                <div className="relative aspect-[4/5] overflow-hidden border-b border-border bg-card">
                  <span className="pointer-events-none absolute left-2 top-1 z-10 font-mono text-[10px] text-white/70">+</span>
                  <span className="pointer-events-none absolute right-2 top-1 z-10 font-mono text-[10px] text-white/70">+</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={piece.image_url}
                    alt={piece.title}
                    className="h-full w-full object-cover grayscale contrast-125 transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>

                {/* Specs */}
                <div className="p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-fg">
                    ARTE: <span className="text-foreground">{piece.artist_credit}</span>
                  </p>
                  <h3 className="mt-1 font-display text-2xl tracking-[-0.03em] text-foreground group-hover:text-volt">
                    {piece.title}
                  </h3>
                  <p className="mt-2 border-t border-border pt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-fg">
                    {piece.garment}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
