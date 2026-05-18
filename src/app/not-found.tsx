import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background px-4 text-center">
      <div className="relative">
        {/* Glitch text effect container */}
        <h1 className="font-display text-[20vw] leading-none tracking-widest text-foreground sm:text-[15vw] lg:text-[12vw]">
          4<span className="text-volt">0</span>4
        </h1>
        <div className="absolute inset-0 flex items-center justify-center opacity-50 blur-sm filter">
           <h1 className="font-display text-[20vw] leading-none tracking-widest text-red-brand sm:text-[15vw] lg:text-[12vw] translate-x-1">
             404
           </h1>
        </div>
      </div>
      
      <p className="mt-4 max-w-md text-sm font-bold uppercase tracking-widest text-muted-fg">
        ESTA RUTA NO EXISTE. TE SALISTE DEL MAPA.
      </p>
      
      <Link
        href="/"
        className="mt-10 inline-flex items-center justify-center border-2 border-border bg-card px-8 py-4 text-xs font-black uppercase tracking-widest text-foreground transition-all hover:border-volt hover:text-volt"
      >
        VOLVER AL INICIO →
      </Link>
    </div>
  );
}
