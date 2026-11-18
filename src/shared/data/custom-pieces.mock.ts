export interface CustomPieceShowcase {
  id: string;
  code: string;
  title: string;
  garment: string;
  artist_credit: string;
  technique: string;
  image_url: string;
}

// Reemplaza `image_url` con tus fotos reales colocándolas en `public/piezas-personalizadas/`
export const CUSTOM_PIECES_SHOWCASE: CustomPieceShowcase[] = [
  {
    id: 'piece-01',
    code: 'PCS-01',
    title: 'OVERSIZE // JUEGA SIEMPRE',
    garment: 'CAMISETA BOXY 220GSM — NEGRO',
    artist_credit: 'DJLU',
    technique: 'DTG ALTA DENSIDAD',
    image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'piece-02',
    code: 'PCS-02',
    title: 'HEAVY TEE // DESTRUYE ROSA',
    garment: 'CAMISETA RAW — BLANCO HUESO',
    artist_credit: 'TOXICÓMANO',
    technique: 'SERIGRAFÍA MANUAL',
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'piece-03',
    code: 'PCS-03',
    title: 'DROP CUSTOM // PERRO TRISTE',
    garment: 'HOODIE PESADO 400GSM — CARBÓN',
    artist_credit: 'PERRO TRISTE',
    technique: 'VINILO TEXTIL + DTG',
    image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'piece-04',
    code: 'PCS-04',
    title: 'EDICIÓN // SYSTEM ERROR',
    garment: 'CAMISETA ACID WASH — GRIS',
    artist_credit: 'ERROR',
    technique: 'DTG 300DPI',
    image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop',
  },
];
