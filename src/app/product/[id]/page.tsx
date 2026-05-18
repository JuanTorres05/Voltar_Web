import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProductById } from '@/backend/services/products.service';
import ImageGallery from '@/frontend/components/product/ImageGallery';
import AddToCartForm from '@/frontend/components/product/AddToCartForm';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) return { title: 'Producto no encontrado | VOLTAR' };
  return {
    title: `${product.name.toUpperCase()} | VOLTAR`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  return (
    <div className="min-h-screen bg-background">

      {/* ── Breadcrumb bar ─────────────────────────── */}
      <div className="border-b border-border bg-surface px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-3 text-xs font-bold uppercase tracking-widest">
          <Link
            href="/catalog"
            className="flex items-center gap-1 text-muted-fg transition-colors hover:text-volt"
          >
            <ArrowLeft className="h-3 w-3" />
            Colección
          </Link>
          <span className="text-border-strong">/</span>
          <Link
            href={`/catalog?category=${product.category}`}
            className="text-muted-fg transition-colors hover:text-volt"
          >
            {product.category}
          </Link>
          <span className="text-border-strong">/</span>
          <span className="text-volt truncate max-w-[200px]">{product.name.toUpperCase()}</span>
        </div>
      </div>

      {/* ── Main content ───────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">

          {/* Galería */}
          <ImageGallery images={product.images ?? []} />

          {/* Info panel */}
          <div className="flex flex-col gap-7">

            {/* Category tag + name */}
            <div>
              <span className="tag-volt">{product.category}</span>
              <h1 className="mt-3 font-display text-6xl leading-none tracking-wide text-foreground sm:text-7xl">
                {product.name.toUpperCase()}
              </h1>
              <p className="mt-5 font-display text-5xl text-volt">
                ${product.price.toFixed(2)}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Description */}
            <p className="text-sm leading-relaxed text-muted-fg">
              {product.description}
            </p>

            {/* Selector interactivo y Añadir al Carrito */}
            <AddToCartForm product={product} />

            {/* Shipping info */}
            <div className="border border-border bg-surface p-4">
              <ul className="space-y-2 text-xs font-medium uppercase tracking-wider text-muted-fg">
                <li className="flex items-center gap-3">
                  <span className="text-volt font-black">→</span>
                  Envío gratis en pedidos &gt; $50
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-volt font-black">→</span>
                  Entrega en 3–5 días hábiles
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-volt font-black">→</span>
                  Devoluciones gratis en 30 días
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Volt separator ─────────────────────────── */}
      <div className="mt-10 border-t border-border bg-surface py-8 text-center">
        <p className="font-display text-2xl tracking-widest text-muted-fg">
          VOLT<span className="text-volt">AR</span> — SIN LÍMITES
        </p>
      </div>
    </div>
  );
}
