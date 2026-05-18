'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/frontend/context/CartContext';

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, getTotalPrice } = useCart();
  
  // Evitar hydration mismatch renderizando solo en el cliente
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
      {/* Overlay oscuro */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed bottom-0 right-0 top-0 z-[70] flex w-full max-w-md flex-col border-l border-border bg-background shadow-dark-lg transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-5">
          <h2 className="font-display text-4xl tracking-widest text-foreground">
            TU <span className="text-volt">ARSENAL</span>
          </h2>
          <button 
            onClick={closeCart}
            className="text-muted-fg transition-colors hover:text-volt"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="mb-4 font-display text-6xl text-muted-fg opacity-20">Ø</span>
              <p className="text-sm font-bold uppercase tracking-widest text-muted-fg">
                TU CARRITO ESTÁ VACÍO.
              </p>
              <button 
                onClick={closeCart}
                className="mt-6 border border-border bg-surface px-6 py-3 text-xs font-black uppercase tracking-widest transition-all hover:border-volt hover:text-volt"
              >
                Volver a la tienda
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  {/* Image */}
                  <div className="relative h-24 w-20 shrink-0 border border-border bg-surface">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="font-display text-2xl uppercase text-foreground">
                          {item.name}
                        </h3>
                        <p className="font-display text-xl text-volt">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="mt-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-fg">
                        {item.size && <span>TALLA: {item.size}</span>}
                        {item.size && item.color && <span>·</span>}
                        {item.color && (
                          <div className="flex items-center gap-1">
                            COLOR: 
                            <span 
                              className="inline-block h-3 w-3 border border-border" 
                              style={{ backgroundColor: item.color, outline: item.color === 'White' || item.color === '#FFFFFF' ? '1px solid #333' : 'none' }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex h-8 items-center border border-border bg-surface">
                        <button 
                          className="flex h-full w-8 items-center justify-center text-muted-fg transition-colors hover:text-foreground"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                        <button 
                          className="flex h-full w-8 items-center justify-center text-muted-fg transition-colors hover:text-foreground"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-muted-fg transition-colors hover:text-red-brand"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border bg-surface p-6">
            <div className="mb-6 flex items-end justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-muted-fg">
                Subtotal
              </span>
              <span className="font-display text-4xl text-foreground">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
            
            <p className="mb-6 text-[10px] uppercase text-muted-fg">
              Los impuestos y gastos de envío se calculan en el siguiente paso.
            </p>

            <button className="flex w-full items-center justify-center gap-3 bg-volt py-5 text-sm font-black uppercase tracking-widest text-black transition-all hover:-translate-y-1 hover:shadow-volt">
              PROCEDER AL PAGO <span className="text-base">→</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
