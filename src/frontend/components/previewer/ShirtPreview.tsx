'use client';

import React, { forwardRef } from 'react';
import Image from 'next/image';

interface ShirtPreviewProps {
  uploadedImage: string | null;
  shirtColor: string;
  positionX: number;
  positionY: number;
  scale: number;
}

// Función matemática para transformar el blanco base en otros colores vía CSS Filters
const getColorFilter = (hex: string) => {
  switch (hex) {
    case '#1A1A1A': return 'brightness(0.2) contrast(1.2)'; // Negro
    case '#808080': return 'brightness(0.6) contrast(1.1)'; // Gris
    case '#1C2841': return 'sepia(1) hue-rotate(180deg) saturate(3) brightness(0.3) contrast(1.2)'; // Azul Marino
    case '#B22222': return 'sepia(1) hue-rotate(330deg) saturate(5) brightness(0.6) contrast(1.2)'; // Rojo
    case '#2E8B57': return 'sepia(1) hue-rotate(90deg) saturate(3) brightness(0.5) contrast(1.2)'; // Verde
    case '#DAA520': return 'sepia(1) hue-rotate(30deg) saturate(5) brightness(0.9)'; // Amarillo
    case '#FFB6C1': return 'sepia(1) hue-rotate(300deg) saturate(3) brightness(1.1)'; // Rosado
    case '#FFFFFF': 
    default: return 'none'; // Blanco
  }
};

const ShirtPreview = forwardRef<HTMLDivElement, ShirtPreviewProps>(
  ({ uploadedImage, shirtColor, positionX, positionY, scale }, ref) => {
    return (
      <div 
        ref={ref}
        className="relative mx-auto w-full max-w-lg aspect-[3/4] bg-[#f0f0f0] overflow-hidden"
      >
        {/* Imagen Base con Filtros CSS directos (Concepto Simple) */}
        <Image
          src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"
          alt="Base Shirt"
          fill
          className="object-cover transition-all duration-500"
          style={{ filter: getColorFilter(shirtColor) }}
          unoptimized
          crossOrigin="anonymous"
        />

        {/* Zona de Estampado Delimitada */}
        <div 
          className="absolute top-[20%] left-[25%] right-[25%] bottom-[20%] overflow-hidden pointer-events-none"
        >
          {uploadedImage && (
            <div 
              className="absolute pointer-events-auto"
              style={{
                top: `${positionY}%`,
                left: `${positionX}%`,
                transform: `translate(-50%, -50%) scale(${scale / 100})`,
                transformOrigin: 'center center',
              }}
            >
              <img 
                src={uploadedImage} 
                alt="Diseño subido"
                className="max-w-[200px] h-auto object-contain mix-blend-multiply drop-shadow-md"
                crossOrigin="anonymous"
              />
            </div>
          )}
        </div>
        
        {/* Helper visual */}
        {!uploadedImage && (
          <div className="absolute top-[20%] left-[25%] right-[25%] bottom-[20%] border-2 border-dashed border-black/20 pointer-events-none flex items-center justify-center">
            <span className="text-black/30 text-xs font-black uppercase tracking-widest text-center px-4">
              Área de<br/>Estampado
            </span>
          </div>
        )}
      </div>
    );
  }
);

ShirtPreview.displayName = 'ShirtPreview';

export default ShirtPreview;
