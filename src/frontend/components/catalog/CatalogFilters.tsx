'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import { X, Filter } from 'lucide-react';

const CATEGORIES = ['Camisetas', 'Pantalones', 'Accesorios', 'Zapatos'];
const SIZES      = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS     = [
  { name: 'Black',  hex: '#000000' },
  { name: 'White',  hex: '#FFFFFF' },
  { name: 'Red',    hex: '#FF2020' },
  { name: 'Blue',   hex: '#1D4ED8' },
  { name: 'Green',  hex: '#15803D' },
  { name: 'Gray',   hex: '#6B7280' },
];

export default function CatalogFilters() {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const createQS = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get(key);
      if (current === value) params.delete(key);
      else if (value) params.set(key, value);
      else params.delete(key);
      return params.toString();
    },
    [searchParams]
  );

  const set = (key: string, value: string) =>
    router.push(pathname + '?' + createQS(key, value), { scroll: false });

  const clear = () => router.push(pathname, { scroll: false });

  const cat   = searchParams.get('category') || '';
  const size  = searchParams.get('size')     || '';
  const color = searchParams.get('color')    || '';
  const hasFilters = !!(cat || size || color);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="mb-4 lg:hidden">
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="flex w-full items-center justify-between border border-border bg-card px-4 py-3 text-xs font-bold uppercase tracking-widest text-foreground transition-all hover:border-volt hover:text-volt"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filtros {hasFilters && '(Activos)'}</span>
          </div>
          {isOpenMobile ? <X className="h-4 w-4" /> : <span>+</span>}
        </button>
      </div>

      {/* Filters Container (Always open on Desktop, togglable on Mobile) */}
      <div className={`border border-border bg-card p-5 ${isOpenMobile ? 'block' : 'hidden lg:block'}`}>
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl tracking-widest text-foreground">FILTROS</h2>
          {hasFilters && (
            <button
              onClick={clear}
              className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-volt hover:text-foreground transition-colors"
            >
              <X className="h-3 w-3" />
              Limpiar
            </button>
          )}
        </div>

        <div className="space-y-6">

          {/* Categoría */}
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-fg">Categoría</p>
            <div className="space-y-1">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => set('category', c)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-sm font-semibold transition-all ${
                    cat === c
                      ? 'bg-volt text-black'
                      : 'text-muted-fg hover:bg-surface hover:text-foreground'
                  }`}
                >
                  {c}
                  {cat === c && <span className="text-[10px] font-black">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Talla */}
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-fg">Talla</p>
            <div className="grid grid-cols-3 gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => set('size', s)}
                  className={`py-2 text-xs font-black uppercase tracking-wider transition-all ${
                    size === s
                      ? 'bg-volt text-black border-transparent'
                      : 'border border-border text-muted-fg hover:border-volt hover:text-volt bg-surface'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-fg">Color</p>
            <div className="grid grid-cols-3 gap-2">
              {COLORS.map(({ name, hex }) => (
                <button
                  key={name}
                  onClick={() => set('color', name)}
                  title={name}
                  className={`flex flex-col items-center gap-1.5 p-2 transition-all border bg-surface ${
                    color === name ? 'border-volt' : 'border-border hover:border-volt'
                  }`}
                >
                  <div
                    className="h-6 w-6"
                    style={{ backgroundColor: hex, border: hex === '#FFFFFF' ? '1px solid #333' : 'none' }}
                  />
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${color === name ? 'text-volt' : 'text-muted-fg'}`}>
                    {name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
