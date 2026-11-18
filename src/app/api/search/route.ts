import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/backend/services/products.service';
import { MOCK_ARTISTS, MOCK_ARTWORKS } from '@/shared/data/artists.mock';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim().toLowerCase() || '';

  if (!q) {
    return NextResponse.json({
      products: [],
      artists: [],
      artworks: [],
    });
  }

  const allProducts = await getProducts();

  const products = allProducts
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    )
    .slice(0, 5);

  const artists = MOCK_ARTISTS.filter(
    (a) =>
      a.tag.toLowerCase().includes(q) ||
      a.crew.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.style.toLowerCase().includes(q)
  ).slice(0, 4);

  const artworks = MOCK_ARTWORKS.filter(
    (w) =>
      w.title.toLowerCase().includes(q) ||
      w.artist_tag.toLowerCase().includes(q) ||
      w.style.toLowerCase().includes(q) ||
      w.description.toLowerCase().includes(q)
  ).slice(0, 4);

  return NextResponse.json({ products, artists, artworks });
}
