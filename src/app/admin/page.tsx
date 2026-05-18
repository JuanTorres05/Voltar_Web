'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Plus, X, Check } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading]     = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews]   = useState<string[]>([]);
  const [error, setError]         = useState<string | null>(null);
  const [success, setSuccess]     = useState(false);

  const [form, setForm] = useState({
    name:        '',
    description: '',
    price:       '',
    category:    'Camisetas',
    sizes:       'S,M,L,XL',
    colors:      'Black,White',
  });

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setImageFiles(prev => [...prev, ...arr]);
    setPreviews(prev => [...prev, ...arr.map(f => URL.createObjectURL(f))]);
  };

  const removeFile = (i: number) => {
    setImageFiles(p => p.filter((_, idx) => idx !== i));
    setPreviews(p => p.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const cloudName    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
      let imageUrls: string[] = [];

      if (imageFiles.length > 0 && cloudName && uploadPreset) {
        for (const file of imageFiles) {
          const data = new FormData();
          data.append('file', file);
          data.append('upload_preset', uploadPreset);
          const res  = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: data });
          if (!res.ok) throw new Error(`Error subiendo ${file.name}`);
          const json = await res.json();
          imageUrls.push(json.secure_url as string);
        }
      }

      const { supabase } = await import('@/backend/lib/supabase/client');
      const { error: dbErr } = await supabase.from('products').insert([{
        name:        form.name,
        description: form.description,
        price:       parseFloat(form.price),
        category:    form.category,
        sizes:       form.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors:      form.colors.split(',').map(c => c.trim()).filter(Boolean),
        images:      imageUrls,
      }]);
      if (dbErr) throw dbErr;

      setSuccess(true);
      setTimeout(() => router.push('/catalog'), 1800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ── Header bar ─────────────────────────────── */}
      <div className="border-b border-border bg-surface px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-fg">
            Panel de administración
          </p>
          <h1 className="mt-1 font-display text-5xl tracking-widest text-foreground">
            NUEVO <span className="text-volt">PRODUCTO</span>
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Alerts */}
        {error && (
          <div className="mb-6 flex items-start gap-3 border border-red-brand/30 bg-red-brand/10 p-4">
            <X className="mt-0.5 h-4 w-4 shrink-0 text-red-brand" />
            <p className="text-sm font-medium text-red-brand">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 flex items-center gap-3 border border-volt/30 bg-volt/10 p-4">
            <Check className="h-4 w-4 text-volt" />
            <p className="text-sm font-bold text-volt">
              PRODUCTO CREADO — Redirigiendo al catálogo...
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-1">

          {/* ── Sección: Datos básicos ────────────── */}
          <div className="border border-border bg-card p-6">
            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.3em] text-volt">
              Datos del producto
            </p>

            <div className="space-y-5">
              {/* Nombre */}
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-muted-fg">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Camiseta Oversize Negra"
                  className="input-volt"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-muted-fg">
                  Descripción *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe el producto. Sé directo y sin rodeos."
                  className="input-volt resize-none"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* Precio + Categoría */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-muted-fg">
                    Precio (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="29.99"
                    className="input-volt"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-muted-fg">
                    Categoría *
                  </label>
                  <select
                    className="input-volt"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  >
                    {['Camisetas', 'Pantalones', 'Accesorios', 'Zapatos'].map(c => (
                      <option key={c} value={c} className="bg-surface">{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ── Sección: Variantes ───────────────── */}
          <div className="border border-border bg-card p-6">
            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.3em] text-volt">
              Variantes
            </p>
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-muted-fg">
                  Tallas <span className="text-muted-fg font-normal normal-case tracking-normal">(separadas por coma)</span>
                </label>
                <input
                  type="text"
                  placeholder="S, M, L, XL"
                  className="input-volt"
                  value={form.sizes}
                  onChange={e => setForm({ ...form, sizes: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-muted-fg">
                  Colores <span className="text-muted-fg font-normal normal-case tracking-normal">(en inglés, separados por coma)</span>
                </label>
                <input
                  type="text"
                  placeholder="Black, White, Red"
                  className="input-volt"
                  value={form.colors}
                  onChange={e => setForm({ ...form, colors: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* ── Sección: Imágenes ─────────────────── */}
          <div className="border border-border bg-card p-6">
            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.3em] text-volt">
              Imágenes
            </p>

            {/* Drop zone */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="group flex w-full flex-col items-center justify-center gap-3 border border-dashed border-border bg-surface py-10 transition-all hover:border-volt"
            >
              <Upload className="h-8 w-8 text-muted-fg transition-colors group-hover:text-volt" />
              <div className="text-center">
                <p className="text-xs font-black uppercase tracking-widest text-foreground">
                  Haz clic para seleccionar imágenes
                </p>
                <p className="mt-1 text-[10px] text-muted-fg">PNG · JPG · WEBP — máx. 10 MB c/u</p>
              </div>
            </button>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />

            {/* Previews grid */}
            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5">
                {previews.map((src, i) => (
                  <div
                    key={i}
                    className="group relative aspect-square overflow-hidden border border-border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center bg-red-brand opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-volt px-1 text-[8px] font-black uppercase text-black">
                        PORTADA
                      </span>
                    )}
                  </div>
                ))}

                {/* Add more */}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex aspect-square items-center justify-center border border-dashed border-border text-muted-fg transition-all hover:border-volt hover:text-volt"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* ── Submit ───────────────────────────── */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-volt py-4 text-sm font-black uppercase tracking-widest text-black transition-all duration-150 hover:-translate-y-1 hover:shadow-volt disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
          >
            {loading ? 'SUBIENDO PRODUCTO...' : success ? '✓ CREADO' : 'CREAR PRODUCTO'}
          </button>

          <p className="mt-3 text-center text-[10px] text-muted-fg">
            Configura las variables de entorno de Cloudinary para subir imágenes.
          </p>
        </form>
      </div>
    </div>
  );
}
