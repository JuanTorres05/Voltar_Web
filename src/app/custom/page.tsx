'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import { SprayCan, Upload, Sparkles } from 'lucide-react';
import DesignUploader from '@/frontend/components/previewer/DesignUploader';
import ShirtPreview from '@/frontend/components/previewer/ShirtPreview';
import ColorPicker from '@/frontend/components/previewer/ColorPicker';
import Controls from '@/frontend/components/previewer/Controls';
import { useCart } from '@/frontend/context/CartContext';
import { MOCK_ARTWORKS } from '@/shared/data/artists.mock';
import { getMergedGalleryData } from '@/frontend/lib/artistSubmissions';
import { ArtistArtwork } from '@/shared/types';

const getColorName = (hex: string): string => {
  const colorMap: Record<string, string> = {
    '#FFFFFF': 'Blanco',
    '#1A1A1A': 'Negro',
    '#808080': 'Gris',
    '#1C2841': 'Azul Marino',
    '#B22222': 'Rojo',
    '#2E8B57': 'Verde',
    '#DAA520': 'Amarillo',
    '#FFB6C1': 'Rosado',
  };
  return colorMap[hex] || 'Personalizado';
};

function CustomStudioContent() {
  const searchParams = useSearchParams();
  const { addItem } = useCart();

  const [artworks, setArtworks] = useState<ArtistArtwork[]>(MOCK_ARTWORKS);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedArtistMeta, setSelectedArtistMeta] = useState<{
    artist: string;
    title: string;
  } | null>(null);
  const [artSourceTab, setArtSourceTab] = useState<'gallery' | 'upload'>('gallery');

  const [shirtColor, setShirtColor] = useState<string>('#1A1A1A');
  const [positionX, setPositionX] = useState<number>(50);
  const [positionY, setPositionY] = useState<number>(34);
  const [scale, setScale] = useState<number>(100);
  const [selectedSize, setSelectedSize] = useState<string>('M');

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setArtworks(getMergedGalleryData().artworks);
  }, []);

  // Cargar diseño si viene desde /artists o Home (?art=...&artist=...&title=...)
  useEffect(() => {
    const artParam = searchParams.get('art');
    const artistParam = searchParams.get('artist');
    const titleParam = searchParams.get('title');

    if (artParam) {
      setUploadedImage(artParam);
      setArtSourceTab('gallery');
      if (artistParam && titleParam) {
        setSelectedArtistMeta({ artist: artistParam, title: titleParam });
      }
    }
  }, [searchParams]);

  const handleSelectGalleryWork = (url: string, artist: string, title: string) => {
    setUploadedImage(url);
    setSelectedArtistMeta({ artist, title });
  };

  const handleCustomUpload = (img: string | null) => {
    setUploadedImage(img);
    setSelectedArtistMeta(null);
  };

  const handleExport = async () => {
    if (!previewRef.current) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const html2canvas = (window as any).html2canvas;
      if (!html2canvas) {
        alert('El motor de renderizado aún está cargando. Intenta de nuevo en unos segundos.');
        return;
      }

      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        backgroundColor: null,
      });

      const base64Image = canvas.toDataURL('image/png');

      const itemName = selectedArtistMeta
        ? `Custom · ${selectedArtistMeta.title} (${selectedArtistMeta.artist})`
        : 'Camiseta Personalizada';

      addItem({
        product_id: selectedArtistMeta ? `custom-${selectedArtistMeta.artist}` : 'custom-drop',
        name: itemName,
        price: selectedArtistMeta ? 50.0 : 45.0,
        image: base64Image,
        size: selectedSize,
        color: getColorName(shirtColor),
        quantity: 1,
      });
    } catch (error) {
      console.error('Error al exportar el diseño:', error);
      alert('Hubo un error al generar la vista previa y agregar al carrito.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Cargar html2canvas desde CDN */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
        strategy="lazyOnload"
      />

      <div className="mb-10 flex flex-col justify-between gap-4 border-b border-border-strong pb-6 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="tag-volt">[ MÓDULO // CUSTOM LAB ]</span>
            <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted-fg">
              RES: 300DPI
            </span>
          </div>
          <h1 className="font-display text-5xl uppercase tracking-[-0.04em] text-foreground md:text-7xl">
            CUSTOM <span className="text-volt">LAB</span>
          </h1>
          <p className="mt-2 max-w-2xl font-mono text-xs uppercase tracking-wider text-muted-fg">
            Elige una obra de nuestros artistas urbanos o sube tu propio diseño. Ajusta posición, color y talla.
          </p>
        </div>

        <Link
          href="/artists"
          className="inline-flex items-center gap-2 border border-border-strong bg-surface px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.08em] text-foreground transition-colors hover:border-volt hover:text-volt"
        >
          <Sparkles className="h-4 w-4" />
          [ VER GALERÍA COMPLETA ]
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Lado izquierdo: Preview */}
        <div className="flex flex-col gap-4">
          <ShirtPreview
            ref={previewRef}
            uploadedImage={uploadedImage}
            shirtColor={shirtColor}
            positionX={positionX}
            positionY={positionY}
            scale={scale}
          />

          {selectedArtistMeta && (
            <div className="flex items-center justify-between border border-volt/40 bg-surface px-4 py-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-fg">
                  Obra seleccionada de la Galería Urbana
                </p>
                <p className="font-display text-2xl tracking-wide text-foreground">
                  {selectedArtistMeta.title}{' '}
                  <span className="font-graffiti text-base text-volt">
                    by {selectedArtistMeta.artist}
                  </span>
                </p>
              </div>
              <span className="tag-volt">+$5 ARTISTA</span>
            </div>
          )}
        </div>

        {/* Lado derecho: Herramientas */}
        <div className="flex flex-col gap-6">
          {/* Paso 1: Galería de Artistas o Uploader */}
          <div className="border border-border bg-surface p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-volt">
                1. Elige obra o sube tu arte
              </h2>
              <div className="flex border border-border bg-background">
                <button
                  type="button"
                  onClick={() => setArtSourceTab('gallery')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors ${
                    artSourceTab === 'gallery'
                      ? 'bg-volt text-white'
                      : 'text-muted-fg hover:text-foreground'
                  }`}
                >
                  <SprayCan className="h-3 w-3" />
                  Artistas
                </button>
                <button
                  type="button"
                  onClick={() => setArtSourceTab('upload')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors ${
                    artSourceTab === 'upload'
                      ? 'bg-volt text-white'
                      : 'text-muted-fg hover:text-foreground'
                  }`}
                >
                  <Upload className="h-3 w-3" />
                  Subir PNG
                </button>
              </div>
            </div>

            {artSourceTab === 'gallery' ? (
              <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
                {artworks.map((work) => {
                  const isSelected = uploadedImage === work.image_url;
                  return (
                    <button
                      key={work.id}
                      type="button"
                      onClick={() =>
                        handleSelectGalleryWork(work.image_url, work.artist_tag, work.title)
                      }
                      className={`group relative flex flex-col items-center border p-1.5 transition-colors ${
                        isSelected
                          ? 'border-volt bg-volt/10'
                          : 'border-border bg-card hover:border-volt/60'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={work.image_url}
                        alt={work.title}
                        className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <span className="mt-1.5 truncate w-full text-center font-mono text-[10px] font-bold uppercase text-volt">
                        {work.artist_tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <DesignUploader onImageUpload={handleCustomUpload} />
            )}
          </div>

          {/* Selector de Color */}
          <div className="border border-border bg-surface p-6">
            <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-volt">
              2. Color de la Prenda
            </h2>
            <ColorPicker selectedColor={shirtColor} onSelectColor={setShirtColor} />
          </div>

          {/* Controles de Posición */}
          <div className="border border-border bg-surface p-6">
            <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-volt">
              3. Posición y Tamaño
            </h2>
            <Controls
              positionX={positionX}
              setPositionX={setPositionX}
              positionY={positionY}
              setPositionY={setPositionY}
              scale={scale}
              setScale={setScale}
              disabled={!uploadedImage}
            />
          </div>

          {/* Tallas */}
          <div className="border border-border bg-surface p-6">
            <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-volt">
              4. Elige tu Talla
            </h2>
            <div className="flex flex-wrap gap-2">
              {['S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex h-12 w-12 items-center justify-center border font-mono text-xs font-bold uppercase tracking-widest transition-colors ${
                      isSelected
                        ? 'border-volt bg-volt text-white'
                        : 'border-border bg-background text-foreground hover:border-volt hover:text-volt'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exportación */}
          <button
            onClick={handleExport}
            disabled={!uploadedImage}
            className={`w-full py-5 font-mono text-xs font-extrabold uppercase tracking-[0.1em] transition-colors ${
              uploadedImage
                ? 'bg-volt text-white hover:bg-foreground hover:text-background'
                : 'cursor-not-allowed border border-border bg-surface text-muted-fg'
            }`}
          >
            {uploadedImage
              ? `ESTAMPADO LISTO (${selectedArtistMeta ? '$50.00' : '$45.00'}) →`
              : 'ELIGE O SUBE UN DISEÑO PRIMERO'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CustomStudioPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-center font-display text-4xl text-muted-fg">
          CARGANDO SPRAY LAB...
        </div>
      }
    >
      <CustomStudioContent />
    </Suspense>
  );
}
