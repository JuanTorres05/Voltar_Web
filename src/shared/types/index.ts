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

// Tipos para Galería Urbana & Artistas Emergentes
export type UrbanArtStyle = string;

export interface Artist {
  id: string;
  slug: string;
  tag: string;
  crew: string;
  city: string;
  style: UrbanArtStyle;
  bio: string;
  instagram: string;
  accentColor: 'volt' | 'pink' | 'cyan';
}

export interface ArtistArtwork {
  id: string;
  artist_id: string;
  artist_tag: string;
  artist_crew: string;
  title: string;
  style: UrbanArtStyle;
  image_url: string;
  description: string;
  royalty_usd: number;
}

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface ArtistSubmission {
  id: string;
  artist_tag: string;
  artist_crew: string;
  artist_city: string;
  artist_instagram: string;
  artist_bio: string;
  title: string;
  style: UrbanArtStyle;
  description: string;
  image_url: string;
  royalty_usd: number;
  status: SubmissionStatus;
  created_at: string;
}
