'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center border border-border bg-surface">
        <span className="font-display text-2xl tracking-widest text-muted-fg">SIN IMAGEN</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden border border-border bg-surface group">
        <Image
          src={images[active]}
          alt={`Imagen ${active + 1}`}
          fill
          priority
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Volt corner accent */}
        <div className="absolute left-0 top-0 h-1 w-16 bg-volt" />

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-volt backdrop-blur-sm">
            {active + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden border transition-all duration-150 ${
                active === i
                  ? 'border-volt'
                  : 'border-border opacity-50 hover:opacity-100 hover:border-border-strong'
              }`}
            >
              <Image
                src={img}
                alt={`Miniatura ${i + 1}`}
                fill
                className="object-cover object-center"
                sizes="10vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
