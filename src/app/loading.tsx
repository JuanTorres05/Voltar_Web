export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-background">
      <div className="relative flex h-24 w-24 items-center justify-center">
        {/* Outer rotating square */}
        <div className="absolute inset-0 border-2 border-border border-t-volt animate-spin" />
        {/* Inner brand text */}
        <span className="font-display text-2xl tracking-widest text-volt animate-pulse">
          VLT
        </span>
      </div>
      <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-fg animate-pulse">
        CARGANDO...
      </p>
    </div>
  );
}
