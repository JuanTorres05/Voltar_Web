'use client';

import { useState, useRef } from 'react';
import Script from 'next/script';
import DesignUploader from '@/frontend/components/previewer/DesignUploader';
import ShirtPreview from '@/frontend/components/previewer/ShirtPreview';
import ColorPicker from '@/frontend/components/previewer/ColorPicker';
import Controls from '@/frontend/components/previewer/Controls';
import { useCart } from '@/frontend/context/CartContext';

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

export default function CustomStudioPage() {
  const { addItem } = useCart();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [shirtColor, setShirtColor] = useState<string>('#FFFFFF');
  const [positionX, setPositionX] = useState<number>(50); // 0 a 100
  const [positionY, setPositionY] = useState<number>(30); // 0 a 100
  const [scale, setScale] = useState<number>(100); // 50 a 150
  const [selectedSize, setSelectedSize] = useState<string>('M');
  
  const previewRef = useRef<HTMLDivElement>(null);

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
      
      // Agregar al carrito con los datos personalizados
      addItem({
        product_id: 'custom-drop',
        name: 'Camiseta Personalizada',
        price: 45.00,
        image: base64Image,
        size: selectedSize,
        color: getColorName(shirtColor),
        quantity: 1,
      });
      
      alert('¡Diseño personalizado agregado al carrito!');
    } catch (error) {
      console.error('Error al exportar el diseño:', error);
      alert('Hubo un error al generar la vista previa y agregar al carrito.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Cargar html2canvas desde CDN para evitar problemas de NPM */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" strategy="lazyOnload" />
      
      <div className="mb-12">
        <h1 className="font-display text-5xl uppercase tracking-widest text-foreground md:text-7xl">
          CUSTOM <span className="text-volt">STUDIO</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm font-bold uppercase tracking-widest text-muted-fg">
          Tu diseño. Tus reglas. Sube tu arte, elige el color y posiciona tu estampado.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Lado izquierdo: Preview */}
        <div className="flex flex-col gap-6">
          <ShirtPreview 
            ref={previewRef}
            uploadedImage={uploadedImage}
            shirtColor={shirtColor}
            positionX={positionX}
            positionY={positionY}
            scale={scale}
          />
        </div>

        {/* Lado derecho: Herramientas */}
        <div className="flex flex-col gap-8">
          {/* Uploader */}
          <div className="border border-border bg-surface p-6">
            <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-volt">
              1. Sube tu arte
            </h2>
            <DesignUploader onImageUpload={setUploadedImage} />
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
              positionX={positionX} setPositionX={setPositionX}
              positionY={positionY} setPositionY={setPositionY}
              scale={scale} setScale={setScale}
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
                    className={`flex h-12 w-12 items-center justify-center border text-xs font-black uppercase tracking-widest transition-all ${
                      isSelected 
                        ? 'border-volt bg-volt text-black' 
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
            className={`w-full py-5 text-sm font-black uppercase tracking-widest transition-all ${
              uploadedImage 
                ? 'bg-volt text-black hover:-translate-y-1 hover:shadow-volt' 
                : 'cursor-not-allowed bg-surface text-muted-fg border border-border'
            }`}
          >
            {uploadedImage ? 'FINALIZAR DISEÑO →' : 'SUBE UN DISEÑO PRIMERO'}
          </button>
        </div>
      </div>
    </div>
  );
}
