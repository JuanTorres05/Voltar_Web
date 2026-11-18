'use client';

import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useCart } from '@/frontend/context/CartContext';

export default function CartToast() {
  const { toast, dismissToast, openCart } = useCart();

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[80] w-[calc(100%-2.5rem)] max-w-sm">
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.key}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="pointer-events-auto border border-border-strong bg-background"
          >
            {/* Header de telemetría */}
            <div className="flex items-center justify-between border-b border-border bg-surface px-3 py-2 font-mono text-[10px] uppercase tracking-[0.08em]">
              <span className="flex items-center gap-2 text-foreground">
                <span className="inline-block h-1.5 w-1.5 bg-terminal" />
                [ ITEM AGREGADO AL BAG ]
              </span>
              <button
                type="button"
                onClick={dismissToast}
                aria-label="Cerrar notificación"
                className="text-muted-fg transition-colors hover:text-volt"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Contenido */}
            <div className="flex items-center gap-3 p-3">
              {toast.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={toast.image}
                  alt={toast.name}
                  className="h-14 w-12 shrink-0 border border-border object-cover"
                />
              ) : (
                <div className="h-14 w-12 shrink-0 border border-border bg-card" />
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-xl uppercase tracking-[-0.02em] text-foreground">
                  {toast.name}
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-muted-fg">
                  {toast.size && `TALLA: ${toast.size}`}
                  {toast.size && toast.color && ' · '}
                  {toast.color && `COLOR: ${toast.color}`}
                </p>
                <p className="mt-1 font-mono text-xs font-bold text-volt">
                  {toast.quantity}x · ${(toast.price * toast.quantity).toFixed(2)} USD
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  dismissToast();
                  openCart();
                }}
                className="shrink-0 border border-volt bg-volt px-3 py-2 font-mono text-[10px] font-extrabold uppercase tracking-[0.08em] text-white transition-colors hover:bg-foreground hover:border-foreground hover:text-background"
              >
                VER &gt;&gt;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
