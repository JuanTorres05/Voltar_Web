'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { Product, Artist, ArtistArtwork } from '@/shared/types';

interface SearchResults {
  products: Product[];
  artists: Artist[];
  artworks: ArtistArtwork[];
}

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults>({
    products: [],
    artists: [],
    artworks: [],
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Atajo Ctrl+K / Cmd+K y ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Búsqueda con debounce
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults({ products: [], artists: [], artworks: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = (await res.json()) as SearchResults;
          setResults(data);
        }
      } catch (err) {
        console.error('Error buscando:', err);
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  const hasQuery = query.trim().length > 0;
  const totalCount =
    results.products.length + results.artists.length + results.artworks.length;

  const closeAndClear = () => {
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs lg:max-w-sm">
      {/* Input brutalista */}
      <div className="flex h-9 items-center border border-border-strong bg-surface px-2.5 transition-colors focus-within:border-volt">
        <Search className="h-3.5 w-3.5 shrink-0 text-muted-fg" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="BUSCAR PRODUCTOS O ARTISTAS..."
          className="w-full bg-transparent px-2 font-mono text-[11px] uppercase tracking-[0.06em] text-foreground placeholder:text-muted-fg focus:outline-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="text-muted-fg hover:text-volt"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <kbd className="hidden border border-border px-1.5 py-0.5 font-mono text-[9px] text-muted-fg sm:inline-block">
            CTRL+K
          </kbd>
        )}
      </div>

      {/* Dropdown de resultados */}
      {isOpen && hasQuery && (
        <div className="absolute right-0 top-10 z-50 w-full min-w-[320px] max-h-[75vh] overflow-y-auto border border-border-strong bg-background sm:w-[440px]">
          {/* Barra de estado */}
          <div className="flex items-center justify-between border-b border-border bg-surface px-3 py-2 font-mono text-[10px] uppercase tracking-[0.08em]">
            <span className="text-muted-fg">
              {loading ? '[ BUSCANDO... ]' : `[ ${totalCount} RESULTADOS ]`}
            </span>
            <span className="text-volt">ESC PARA CERRAR</span>
          </div>

          {!loading && totalCount === 0 && (
            <div className="p-6 text-center font-mono text-xs uppercase tracking-wider text-muted-fg">
              NO SE ENCONTRARON PRODUCTOS NI ARTISTAS PARA &quot;{query}&quot;.
            </div>
          )}

          {/* Bloque: Productos */}
          {results.products.length > 0 && (
            <div className="border-b border-border">
              <div className="bg-surface px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-volt">
                [ PRODUCTOS ({results.products.length}) ]
              </div>
              <div className="grid gap-px bg-border">
                {results.products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={closeAndClear}
                    className="flex items-center gap-3 bg-background p-2.5 transition-colors hover:bg-surface"
                  >
                    {product.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-11 w-11 shrink-0 border border-border object-cover"
                      />
                    ) : (
                      <div className="h-11 w-11 shrink-0 border border-border bg-card" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-xs font-bold uppercase text-foreground">
                        {product.name}
                      </p>
                      <p className="font-mono text-[10px] uppercase text-muted-fg">
                        {product.category}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-volt">
                      ${product.price.toFixed(2)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bloque: Artistas */}
          {results.artists.length > 0 && (
            <div className="border-b border-border">
              <div className="bg-surface px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-volt">
                [ ARTISTAS ({results.artists.length}) ]
              </div>
              <div className="grid gap-px bg-border">
                {results.artists.map((artist) => (
                  <Link
                    key={artist.id}
                    href="/artists"
                    onClick={closeAndClear}
                    className="flex items-center justify-between bg-background px-3 py-2.5 transition-colors hover:bg-surface"
                  >
                    <div>
                      <p className="font-mono text-xs font-bold uppercase text-foreground">
                        {artist.tag}
                      </p>
                      <p className="font-mono text-[10px] uppercase text-muted-fg">
                        {artist.crew} · {artist.city}
                      </p>
                    </div>
                    <span className="border border-border-strong px-2 py-0.5 font-mono text-[9px] uppercase text-volt">
                      {artist.style}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bloque: Obras de artistas */}
          {results.artworks.length > 0 && (
            <div>
              <div className="bg-surface px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-volt">
                [ OBRAS ESTAMPABLES ({results.artworks.length}) ]
              </div>
              <div className="grid gap-px bg-border">
                {results.artworks.map((work) => (
                  <Link
                    key={work.id}
                    href={`/custom?art=${encodeURIComponent(work.image_url)}&artist=${encodeURIComponent(
                      work.artist_tag
                    )}&title=${encodeURIComponent(work.title)}`}
                    onClick={closeAndClear}
                    className="flex items-center gap-3 bg-background p-2.5 transition-colors hover:bg-surface"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={work.image_url}
                      alt={work.title}
                      className="h-11 w-11 shrink-0 border border-border object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-xs font-bold uppercase text-foreground">
                        {work.title}
                      </p>
                      <p className="font-mono text-[10px] uppercase text-muted-fg">
                        ARTISTA: {work.artist_tag}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] font-bold uppercase text-volt">
                      ESTAMPAR &gt;&gt;
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
