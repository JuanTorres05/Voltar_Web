'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { CartItem } from '@/shared/types';

export interface CartToastData {
  key: number;
  name: string;
  image: string;
  size?: string;
  color?: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  toast: CartToastData | null;
  dismissToast: () => void;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [toast, setToast] = useState<CartToastData | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cargar desde LocalStorage al iniciar
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem('voltar-cart');
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error leyendo carrito del localStorage', error);
    }

    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Guardar en LocalStorage al cambiar items
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('voltar-cart', JSON.stringify(items));
    }
  }, [items, isMounted]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const dismissToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(null);
  };

  const addItem = (item: Omit<CartItem, 'id'>) => {
    const uniqueId = `${item.product_id}-${item.size || 'no-size'}-${item.color || 'no-color'}`;

    setItems((prev) => {
      const existing = prev.find((i) => i.id === uniqueId);
      if (existing) {
        return prev.map((i) =>
          i.id === uniqueId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, id: uniqueId }];
    });

    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({
      key: Date.now(),
      name: item.name,
      image: item.image,
      size: item.size,
      color: item.color,
      price: item.price,
      quantity: item.quantity,
    });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 3500);

    openCart();
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);

  const getTotalItems = () => items.reduce((acc, item) => acc + item.quantity, 0);
  const getTotalPrice = () =>
    items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        toast,
        dismissToast,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}
