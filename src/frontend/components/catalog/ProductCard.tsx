import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/shared/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative flex flex-col overflow-hidden border border-border bg-card transition-all duration-200 hover:border-volt hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <Image
          src={product.images?.[0] || 'https://via.placeholder.com/400x500/111111/C8FF00?text=VOLTAR'}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Volt overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Quick tag */}
        <div className="absolute left-3 top-3">
          <span className="tag-volt">{product.category}</span>
        </div>

        {/* CTA overlay */}
        <div className="absolute bottom-4 left-0 right-0 flex translate-y-4 justify-center opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="bg-volt px-5 py-2 text-xs font-black uppercase tracking-widest text-black">
            Ver producto →
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4">
        <h3 className="font-display text-xl tracking-wide text-foreground line-clamp-1 group-hover:text-volt transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="font-display text-2xl text-volt">
            ${product.price.toFixed(2)}
          </span>

          {/* Color dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5">
              {product.colors.slice(0, 5).map((color, i) => (
                <div
                  key={i}
                  className="h-3 w-3 border border-border-strong"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
