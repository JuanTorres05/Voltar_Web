'use client';

import { useState } from 'react';
import { useCart } from '@/frontend/context/CartContext';
import { Product } from '@/shared/types';
import { ShoppingBag } from 'lucide-react';

interface AddToCartFormProps {
  product: Product;
}

export default function AddToCartForm({ product }: AddToCartFormProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { addItem } = useCart();

  const handleAddToCart = () => {
    setError('');

    // Validación estilo Voltar
    if (product.sizes?.length > 0 && !selectedSize) {
      setError('ELIGE UNA TALLA PARA CONTINUAR.');
      return;
    }
    if (product.colors?.length > 0 && !selectedColor) {
      setError('ELIGE UN COLOR PARA CONTINUAR.');
      return;
    }

    // Si pasa validación, al carrito
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      quantity: 1,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Colors */}
      {product.colors?.length > 0 && (
        <div>
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-fg">
            Color
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setSelectedColor(color);
                  setError('');
                }}
                className={`flex h-9 w-9 items-center justify-center border transition-all hover:border-border-strong ${
                  selectedColor === color 
                    ? 'border-volt ring-1 ring-volt' 
                    : 'border-border'
                }`}
                style={{
                  backgroundColor: color.toLowerCase(),
                  outline: (color.toLowerCase() === '#ffffff' || color.toLowerCase() === 'white') && selectedColor !== color
                    ? '1px solid #333'
                    : 'none',
                }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {product.sizes?.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-fg">
              Talla
            </p>
            <button className="text-[10px] font-bold uppercase tracking-widest text-volt hover:underline underline-offset-2">
              Guía de tallas
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => {
                  setSelectedSize(size);
                  setError('');
                }}
                className={`flex h-11 min-w-[44px] items-center justify-center border px-3 text-xs font-black uppercase tracking-widest transition-all hover:border-border-strong hover:text-foreground ${
                  selectedSize === size
                    ? 'border-volt bg-volt text-black'
                    : 'border-border bg-surface text-muted-fg'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="border border-red-brand/30 bg-red-brand/10 px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-brand animate-fade-up" style={{ animationDuration: '0.2s' }}>
          {error}
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-border mt-2" />

      {/* Add to cart */}
      <button 
        onClick={handleAddToCart}
        className="flex w-full items-center justify-center gap-3 bg-volt py-4 text-sm font-black uppercase tracking-widest text-black transition-all duration-150 hover:-translate-y-1 hover:shadow-volt active:translate-y-0"
      >
        <ShoppingBag className="h-4 w-4" />
        Añadir al carrito
      </button>
    </div>
  );
}
