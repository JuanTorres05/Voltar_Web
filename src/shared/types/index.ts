// Tipos compartidos entre frontend y backend
// Solo interfaces/tipos puros — NUNCA lógica de negocio aquí.

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  selected_size?: string;
  selected_color?: string;
  print_customization?: {
    image_url: string;
    position: { x: number; y: number };
    scale: number;
  } | null;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  shipping_address: Record<string, string>;
  created_at: string;
}

export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at: string;
}

// Interfaz para el Carrito de Compras
export interface CartItem {
  id: string; // ID único para el estado local (ej: product_id-talla-color)
  product_id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
}
