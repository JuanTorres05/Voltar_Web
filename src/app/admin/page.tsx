'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload, Plus, X, Check, Trash2 } from 'lucide-react';
import {
  getSubmissions,
  updateSubmissionStatus,
  deleteSubmission,
} from '@/frontend/lib/artistSubmissions';
import { ArtistSubmission } from '@/shared/types';

const DEMO_PRODUCTS = [
  {
    name: 'Oversize "Raw" Tee',
    description: 'Camiseta oversize de 220gsm. Algodón premium con corte crudo en la parte inferior. Hecha para la calle, no para reglas.',
    price: 35.00,
    category: 'Camisetas',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White'],
  },
  {
    name: 'Volt Cargo Pants',
    description: 'Pantalones cargo de corte ancho con 6 bolsillos utilitarios. Costuras reforzadas. Ajuste de velcro en tobillos para cambiar la silueta.',
    price: 68.00,
    category: 'Pantalones',
    images: [
      'https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'Gray'],
  },
  {
    name: 'Acid Wash Drop',
    description: 'Tratamiento de lavado ácido intenso. Cada pieza es única. Fit holgado y cuello ancho.',
    price: 42.00,
    category: 'Camisetas',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Gray'],
  },
  {
    name: 'Distressed Beanie',
    description: 'Gorro beanie corto con detalles rasgados a mano y etiqueta de goma VOLTAR inyectada.',
    price: 24.00,
    category: 'Accesorios',
    images: [
      'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['One Size'],
    colors: ['Black', 'Red'],
  },
  {
    name: 'Heavy Puffer Black',
    description: 'No vas a pasar frío. Puffer ultra pesada color negro mate. Cierres impermeables.',
    price: 110.00,
    category: 'Camisetas',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['M', 'L'],
    colors: ['Black'],
  },
  {
    name: 'Street Sneaker V1',
    description: 'Nuestra primera silueta. Suela chunky, cordones extra gruesos y detalles reflectivos que brillan de noche.',
    price: 120.00,
    category: 'Zapatos',
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['L', 'XL'],
    colors: ['Black', 'White', 'Volt'],
  }
];

export default function AdminPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading]     = useState(false);
  const [seeding, setSeeding]     = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'submissions'>('products');
  const [submissions, setSubmissions] = useState<ArtistSubmission[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews]   = useState<string[]>([]);
  const [error, setError]         = useState<string | null>(null);
  const [success, setSuccess]     = useState(false);

  useEffect(() => {
    setSubmissions(getSubmissions());
  }, []);

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;

  const handleSeedDemoData = async () => {
    setSeeding(true);
    setError(null);
    setSuccess(false);

    try {
      const { supabase } = await import('@/backend/lib/supabase/client');

      // Validar si tiene credenciales configuradas
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
        throw new Error(
          'Configura primero credenciales de Supabase válidas en .env.local'
        );
      }

      const { error: dbErr } = await supabase.from('products').insert(DEMO_PRODUCTS);
      if (dbErr) throw dbErr;

      setSuccess(true);
      setError(null);
      alert('¡Se sembraron los 6 productos de prueba con éxito!');
      router.push('/catalog');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al sembrar datos');
    } finally {
      setSeeding(false);
    }
  };

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
      const imageUrls: string[] = [];

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
        <div className="mx-auto max-w-3xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-fg">
              Panel de administración
            </p>
            <h1 className="mt-1 font-display text-5xl tracking-widest text-foreground">
              NUEVO <span className="text-volt">PRODUCTO</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSeedDemoData}
              disabled={seeding}
              className="border border-volt bg-surface hover:bg-volt hover:text-white text-volt px-5 py-2.5 font-mono text-xs font-black uppercase tracking-widest transition-all duration-150 active:scale-95 disabled:opacity-50"
            >
              {seeding ? 'SEMBRANDO...' : 'SEMBRAR DEMO DATA'}
            </button>
          </div>
        </div>

        {/* Tabs de administración */}
        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap gap-px border border-border-strong bg-border-strong">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`flex-1 px-4 py-3 font-mono text-xs font-extrabold uppercase tracking-[0.08em] transition-colors ${
              activeTab === 'products'
                ? 'bg-volt text-white'
                : 'bg-background text-muted-fg hover:text-foreground'
            }`}
          >
            [ + NUEVO PRODUCTO ]
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('submissions')}
            className={`flex-1 px-4 py-3 font-mono text-xs font-extrabold uppercase tracking-[0.08em] transition-colors ${
              activeTab === 'submissions'
                ? 'bg-volt text-white'
                : 'bg-background text-muted-fg hover:text-foreground'
            }`}
          >
            [ SOLICITUDES DE ARTISTAS ({pendingCount}) ]
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">

        {activeTab === 'submissions' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4 font-mono text-xs uppercase">
              <span className="text-muted-fg">
                [ {submissions.length} SOLICITUDES REGISTRADAS ]
              </span>
              <Link href="/artists/submit" className="text-volt hover:underline">
                [ IR AL FORMULARIO DE ARTISTA &gt;&gt;&gt; ]
              </Link>
            </div>

            {submissions.length === 0 ? (
              <div className="border border-border-strong bg-surface p-12 text-center font-mono">
                <p className="text-xs uppercase tracking-widest text-muted-fg">
                  NO HAY OBRAS ENVIADAS POR ARTISTAS TODAVÍA.
                </p>
                <Link
                  href="/artists/submit"
                  className="mt-5 inline-block border border-volt bg-volt px-5 py-3 text-xs font-extrabold uppercase tracking-widest text-white"
                >
                  [ PROBAR SUBIR UNA OBRA &gt;&gt;&gt; ]
                </Link>
              </div>
            ) : (
              submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="grid grid-cols-1 gap-px border border-border-strong bg-border-strong sm:grid-cols-12"
                >
                  <div className="flex items-center justify-center bg-card p-4 sm:col-span-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sub.image_url}
                      alt={sub.title}
                      className="max-h-44 w-full object-contain"
                    />
                  </div>

                  <div className="flex flex-col justify-between bg-background p-5 sm:col-span-8">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase">
                        <span className="text-muted-fg">
                          {sub.artist_tag} · {sub.artist_crew} · {sub.artist_city}
                        </span>
                        <span
                          className={`border px-2 py-0.5 font-bold ${
                            sub.status === 'approved'
                              ? 'border-terminal text-terminal'
                              : sub.status === 'rejected'
                                ? 'border-volt text-volt'
                                : 'border-border-strong text-foreground'
                          }`}
                        >
                          {sub.status.toUpperCase()}
                        </span>
                      </div>

                      <h3 className="mt-2 font-display text-3xl uppercase text-foreground">
                        {sub.title}
                      </h3>
                      <p className="mt-1 font-mono text-[10px] uppercase text-volt">
                        ESTILO: {sub.style} · IG: {sub.artist_instagram}
                      </p>
                      <p className="mt-2 font-mono text-xs text-muted-fg">
                        {sub.description}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSubmissions(updateSubmissionStatus(sub.id, 'approved'))
                        }
                        className="flex items-center gap-1.5 border border-terminal bg-transparent px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-terminal transition-colors hover:bg-terminal hover:text-black"
                      >
                        <Check className="h-3.5 w-3.5" />
                        [ APROBAR ]
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSubmissions(updateSubmissionStatus(sub.id, 'rejected'))
                        }
                        className="flex items-center gap-1.5 border border-volt bg-transparent px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-volt transition-colors hover:bg-volt hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                        [ RECHAZAR ]
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubmissions(deleteSubmission(sub.id))}
                        className="ml-auto flex items-center gap-1 border border-border-strong px-3 py-2 font-mono text-[10px] uppercase text-muted-fg hover:border-volt hover:text-volt"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        ELIMINAR
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <>

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
          </>
        )}
      </div>
    </div>
  );
}
