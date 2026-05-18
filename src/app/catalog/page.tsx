import { getProducts, ProductFilters } from '@/backend/services/products.service';
import ProductCard from '@/frontend/components/catalog/ProductCard';
import CatalogFilters from '@/frontend/components/catalog/CatalogFilters';

export const revalidate = 0;

export const metadata = {
  title: 'Colección',
  description: 'Explora todos nuestros productos con estampados únicos.',
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const filters: ProductFilters = {
    category: typeof searchParams.category === 'string' ? searchParams.category : undefined,
    size:     typeof searchParams.size     === 'string' ? searchParams.size     : undefined,
    color:    typeof searchParams.color    === 'string' ? searchParams.color    : undefined,
  };

  const products = await getProducts(filters);

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-7xl text-foreground sm:text-8xl">
            COLECCIÓN
          </h1>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-muted-fg">
            {products.length} {products.length === 1 ? 'pieza disponible' : 'piezas disponibles'}
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar de filtros - Desktop: Sticky, Mobile: Ocultable vía componente interno */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-24">
              <CatalogFilters />
            </div>
          </aside>

          {/* Grid de productos */}
          <main className="flex-1">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center border border-border bg-card py-32 text-center transition-all hover:border-volt">
                <span className="font-display text-6xl text-muted-fg opacity-30">Ø</span>
                <h3 className="mt-4 font-display text-3xl tracking-widest text-foreground">
                  NO HAY DROPS AQUÍ
                </h3>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-muted-fg">
                  Limpia los filtros para ver el arsenal completo.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
