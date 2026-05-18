// =====================================================================
// products.service.ts
// Toda la lógica de acceso a datos de productos vive aquí.
// Las páginas y Server Actions SOLO importan desde este archivo.
// =====================================================================

import { supabase } from '@/backend/lib/supabase/client';
import { Product } from '@/shared/types';

export interface ProductFilters {
  category?: string;
  size?: string;
  color?: string;
}

// =====================================================================
// MOCK DATA PARA PRUEBAS CON CLIENTES
// =====================================================================
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'mock-01',
    name: 'Oversize "Raw" Tee',
    description: 'Camiseta oversize de 220gsm. Algodón premium con corte crudo en la parte inferior. Hecha para la calle, no para reglas.',
    price: 35.00,
    category: 'Camisetas',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White'],
    created_at: new Date().toISOString()
  },
  {
    id: 'mock-02',
    name: 'Volt Cargo Pants',
    description: 'Pantalones cargo de corte ancho con 6 bolsillos utilitarios. Costuras reforzadas. Ajuste de velcro en tobillos para cambiar la silueta.',
    price: 68.00,
    category: 'Pantalones',
    images: [
      'https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'Gray'],
    created_at: new Date().toISOString()
  },
  {
    id: 'mock-03',
    name: 'Acid Wash Drop',
    description: 'Tratamiento de lavado ácido intenso. Cada pieza es única. Fit holgado y cuello ancho.',
    price: 42.00,
    category: 'Camisetas',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Gray'],
    created_at: new Date().toISOString()
  },
  {
    id: 'mock-04',
    name: 'Distressed Beanie',
    description: 'Gorro beanie corto con detalles rasgados a mano y etiqueta de goma VOLTAR inyectada.',
    price: 24.00,
    category: 'Accesorios',
    images: [
      'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['One Size'],
    colors: ['Black', 'Red'],
    created_at: new Date().toISOString()
  },
  {
    id: 'mock-05',
    name: 'Heavy Puffer Black',
    description: 'No vas a pasar frío. Puffer ultra pesada color negro mate. Cierres impermeables.',
    price: 110.00,
    category: 'Camisetas', // Ubicada aquí a modo de Tops
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['M', 'L'],
    colors: ['Black'],
    created_at: new Date().toISOString()
  },
  {
    id: 'mock-06',
    name: 'Street Sneaker V1',
    description: 'Nuestra primera silueta. Suela chunky, cordones extra gruesos y detalles reflectivos que brillan de noche.',
    price: 120.00,
    category: 'Zapatos',
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['L', 'XL'],
    colors: ['Black', 'White', 'Volt'],
    created_at: new Date().toISOString()
  }
];

/** Obtener todos los productos (con filtros opcionales) */
export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 800));

  let results = [...MOCK_PRODUCTS];

  if (filters.category) {
    results = results.filter((p) => p.category === filters.category);
  }
  if (filters.size) {
    results = results.filter((p) => p.sizes?.includes(filters.size!));
  }
  if (filters.color) {
    results = results.filter((p) => p.colors?.includes(filters.color!));
  }

  return results;
}

/** Obtener un producto por su ID */
export async function getProductById(id: string): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_PRODUCTS.find((p) => p.id === id) || null;
}

/** Crear un nuevo producto */
export async function createProduct(
  payload: Omit<Product, 'id' | 'created_at'>
): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('[ProductService] createProduct error:', error.message);
    throw new Error(error.message);
  }

  return data as Product;
}

/** Actualizar un producto existente */
export async function updateProduct(
  id: string,
  payload: Partial<Omit<Product, 'id' | 'created_at'>>
): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[ProductService] updateProduct error:', error.message);
    throw new Error(error.message);
  }

  return data as Product;
}

/** Eliminar un producto */
export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[ProductService] deleteProduct error:', error.message);
    throw new Error(error.message);
  }
}
