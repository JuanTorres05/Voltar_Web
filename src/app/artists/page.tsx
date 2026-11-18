'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { MOCK_ARTISTS, MOCK_ARTWORKS } from '@/shared/data/artists.mock';
import { getMergedGalleryData } from '@/frontend/lib/artistSubmissions';
import { Artist, ArtistArtwork } from '@/shared/types';

const EASE_OUT = 'easeOut' as const;

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_OUT },
  },
};

export default function ArtistsGalleryPage() {
  const [artists, setArtists] = useState<Artist[]>(MOCK_ARTISTS);
  const [artworks, setArtworks] = useState<ArtistArtwork[]>(MOCK_ARTWORKS);
  // IDs de artistas cuya galería completa está expandida (> 3 diseños)
  const [expandedArtists, setExpandedArtists] = useState<Record<string, boolean>>({});
  // Obra seleccionada para ver el modal con descripción + card del artista
  const [selectedWork, setSelectedWork] = useState<ArtistArtwork | null>(null);

  useEffect(() => {
    const merged = getMergedGalleryData();
    setArtists(merged.artists);
    setArtworks(merged.artworks);
  }, []);

  const toggleArtistExpand = (artistId: string) => {
    setExpandedArtists((prev) => ({
      ...prev,
      [artistId]: !prev[artistId],
    }));
  };

  // Cerrar modal con ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedWork(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const selectedArtist: Artist | undefined = selectedWork
    ? artists.find((a) => a.id === selectedWork.artist_id)
    : undefined;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── HEADER DE ARCHIVO ─────────────────────────────────── */}
      <section className="border-b border-border-strong bg-surface volt-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-fg">
            <span>[ ARCHIVO // GALERÍA URBANA ]</span>
            <span className="text-volt">[ {artists.length} ARTISTAS // {artworks.length} OBRAS INDEXADAS ]</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
            className="inline-flex items-start font-display uppercase tracking-[-0.05em] text-foreground"
            style={{ fontSize: 'clamp(3.2rem, 9vw, 7.5rem)', lineHeight: 0.86 }}
          >
            <span>
              GALERÍA <span className="text-volt">URBANA</span>
            </span>
            <span className="ml-1.5 mt-1 font-mono text-[0.16em] font-bold leading-none tracking-normal text-muted-fg">
              ®
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: EASE_OUT }}
            className="mt-4 max-w-2xl font-mono text-xs uppercase leading-relaxed tracking-[0.06em] text-muted-fg sm:text-sm"
          >
            REPOSITORIO DE ARTISTAS EMERGENTES: ILUSTRACIÓN, ARTE URBANO, GRÁFICA DISRUPTIVA
            Y DISEÑO INDEPENDIENTE. SELECCIONA CUALQUIER PIEZA PARA VER SU FICHA Y ESTAMPARLA.
          </motion.p>
        </div>
      </section>

      {/* ── SECCIONES AGRUPADAS POR ARTISTA ───────────────────── */}
      <div className="mx-auto max-w-7xl space-y-16 px-4 py-14 sm:px-6 lg:px-8">
        {artists.map((artist, artistIdx) => {
          const works = artworks.filter((w) => w.artist_id === artist.id);
          const isExpanded = Boolean(expandedArtists[artist.id]);
          const hasMoreThanThree = works.length > 3;
          const visibleWorks = isExpanded ? works : works.slice(0, 3);
          const hiddenCount = works.length - 3;

          return (
            <section key={artist.id} className="border border-border-strong bg-surface">
              {/* Cabecera del artista */}
              <div className="flex flex-col justify-between gap-4 border-b border-border-strong bg-background p-6 sm:flex-row sm:items-end">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.1em]">
                    <span className="tag-volt">ART-0{artistIdx + 1}</span>
                    <span className="text-muted-fg">{artist.crew}</span>
                    <span className="text-border-strong">///</span>
                    <span className="text-muted-fg">{artist.city}</span>
                  </div>
                  <h2 className="font-display text-4xl uppercase tracking-[-0.03em] text-foreground sm:text-5xl">
                    {artist.tag}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-fg">
                    MOSTRANDO {String(visibleWorks.length).padStart(2, '0')} /{' '}
                    {String(works.length).padStart(2, '0')} OBRAS
                  </span>

                  {hasMoreThanThree && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => toggleArtistExpand(artist.id)}
                      className="border border-volt bg-volt px-4 py-2 font-mono text-[11px] font-extrabold uppercase tracking-[0.08em] text-white transition-colors hover:bg-foreground hover:border-foreground hover:text-background"
                    >
                      {isExpanded
                        ? '[ MOSTRAR MENOS ]'
                        : `[ VER GALERÍA COMPLETA (+${hiddenCount}) >>> ]`}
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Grid de máximo 3 obras (o todas si está expandido) */}
              <motion.div
                key={`${artist.id}-${isExpanded ? 'all' : '3'}`}
                variants={gridVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                className="grid grid-cols-1 gap-px bg-border-strong sm:grid-cols-2 lg:grid-cols-3"
              >
                {visibleWorks.map((work, idx) => (
                  <motion.article
                    key={work.id}
                    variants={cardVariants}
                    className="group flex flex-col justify-between bg-background transition-colors hover:bg-surface"
                  >
                    {/* Top telemetry bar */}
                    <div className="flex items-center justify-between border-b border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.08em]">
                      <span className="text-muted-fg">
                        {artist.tag} // 0{idx + 1}
                      </span>
                      <span className="text-volt">+{work.royalty_usd} USD ARTISTA</span>
                    </div>

                    {/* Imagen clickeable para abrir ficha + card de artista */}
                    <button
                      type="button"
                      onClick={() => setSelectedWork(work)}
                      className="relative aspect-square w-full overflow-hidden border-b border-border bg-card text-left focus:outline-none"
                    >
                      <span className="pointer-events-none absolute left-2 top-1 z-10 font-mono text-[10px] text-white/70">+</span>
                      <span className="pointer-events-none absolute right-2 top-1 z-10 font-mono text-[10px] text-white/70">+</span>
                      <span className="tag-volt absolute left-3 top-4 z-10">{work.style}</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={work.image_url}
                        alt={work.title}
                        className="h-full w-full object-cover grayscale contrast-125 transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
                      />
                      <span className="absolute bottom-3 right-3 z-10 border border-border-strong bg-background/90 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                        [ VER FICHA + ARTISTA ]
                      </span>
                    </button>

                    {/* Info + Acciones */}
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <button
                          type="button"
                          onClick={() => setSelectedWork(work)}
                          className="text-left"
                        >
                          <h3 className="font-display text-3xl uppercase tracking-[-0.03em] text-foreground transition-colors group-hover:text-volt">
                            {work.title}
                          </h3>
                        </button>
                        <p className="mt-2 line-clamp-2 font-mono text-[11px] leading-relaxed text-muted-fg">
                          {work.description}
                        </p>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-px border border-border-strong bg-border-strong">
                        <button
                          type="button"
                          onClick={() => setSelectedWork(work)}
                          className="bg-surface px-3 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-card hover:text-volt"
                        >
                          [ VER FICHA ]
                        </button>
                        <Link
                          href={`/custom?art=${encodeURIComponent(work.image_url)}&artist=${encodeURIComponent(
                            work.artist_tag
                          )}&title=${encodeURIComponent(work.title)}`}
                          className="flex items-center justify-center bg-volt px-3 py-2.5 font-mono text-[10px] font-extrabold uppercase tracking-[0.08em] text-white transition-colors hover:bg-foreground hover:text-background"
                        >
                          [ ESTAMPAR &gt;&gt;&gt; ]
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </section>
          );
        })}
      </div>

      {/* ── MODAL DE PIEZA SELECCIONADA + CARD DEL ARTISTA ──────── */}
      <AnimatePresence>
        {selectedWork && selectedArtist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedWork(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-border-strong bg-background"
            >
              {/* Top bar del modal */}
              <div className="flex items-center justify-between border-b border-border-strong bg-surface px-5 py-3">
                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em]">
                  <span className="text-volt">[ SPECIMEN // {selectedWork.id.toUpperCase()} ]</span>
                  <span className="hidden text-muted-fg sm:inline">
                    ESTILO: {selectedWork.style}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedWork(null)}
                  className="flex items-center gap-1.5 border border-border-strong bg-background px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-foreground transition-colors hover:border-volt hover:bg-volt hover:text-white"
                >
                  <span>ESC</span>
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Contenido 2 columnas: Obra | Descripción + Card del Artista */}
              <div className="grid grid-cols-1 gap-px bg-border-strong md:grid-cols-2">
                {/* Columna izquierda: Imagen completa de la pieza */}
                <div className="relative flex aspect-square items-center justify-center bg-card p-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedWork.image_url}
                    alt={selectedWork.title}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Columna derecha: Descripción de la obra + Card del Artista */}
                <div className="flex flex-col justify-between bg-background p-6">
                  <div>
                    <span className="tag-volt mb-3 inline-block">
                      +{selectedWork.royalty_usd}.00 USD REGALÍA AL ARTISTA
                    </span>
                    <h2 className="font-display text-4xl uppercase tracking-[-0.03em] text-foreground">
                      {selectedWork.title}
                    </h2>
                    <p className="mt-3 font-mono text-xs leading-relaxed text-muted-fg">
                      {selectedWork.description}
                    </p>

                    {/* Card del Artista de la obra */}
                    <div className="mt-6 border border-border-strong bg-surface p-4">
                      <div className="flex items-center justify-between border-b border-border pb-2 font-mono text-[10px] uppercase tracking-[0.08em]">
                        <span className="text-volt">[ FICHA DEL ARTISTA ]</span>
                        <span className="text-muted-fg">{selectedArtist.city}</span>
                      </div>

                      <div className="mt-3 flex items-baseline justify-between gap-2">
                        <h3 className="font-display text-3xl tracking-[-0.03em] text-foreground">
                          {selectedArtist.tag}
                        </h3>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-fg">
                          {selectedArtist.instagram}
                        </span>
                      </div>

                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-volt">
                        CREW: {selectedArtist.crew} // {selectedArtist.style}
                      </p>

                      <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted-fg">
                        {selectedArtist.bio}
                      </p>
                    </div>
                  </div>

                  {/* CTA Estampar */}
                  <div className="mt-6 grid grid-cols-1 gap-2">
                    <Link
                      href={`/custom?art=${encodeURIComponent(
                        selectedWork.image_url
                      )}&artist=${encodeURIComponent(
                        selectedWork.artist_tag
                      )}&title=${encodeURIComponent(selectedWork.title)}`}
                      className="flex items-center justify-between bg-volt px-5 py-4 font-mono text-xs font-extrabold uppercase tracking-[0.1em] text-white transition-colors hover:bg-foreground hover:text-background"
                    >
                      <span>[ ESTAMPAR ESTA OBRA EN CUSTOM LAB ]</span>
                      <span>&gt;&gt;&gt;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CONVOCATORIA DE ARTISTAS ──────────────────────────── */}
      <section className="border-t border-border-strong bg-volt px-4 py-14 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.12em]">
              [ CONVOCATORIA ABIERTA // REGALÍAS DIRECTAS ]
            </p>
            <h2 className="mt-2 font-display text-4xl uppercase tracking-[-0.04em] sm:text-6xl">
              EXPÓN TU ARTE EN VØLTAR
              <span className="ml-1 align-top font-mono text-[0.2em] font-bold tracking-normal">
                ®
              </span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/artists/submit"
              className="border-2 border-black bg-black px-6 py-3.5 font-mono text-xs font-extrabold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white hover:text-black"
            >
              [ SUBIR TU OBRA &gt;&gt;&gt; ]
            </Link>
            <Link
              href="/custom"
              className="border-2 border-white bg-transparent px-6 py-3.5 font-mono text-xs font-extrabold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white hover:text-black"
            >
              [ PROBAR CUSTOM LAB ]
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
