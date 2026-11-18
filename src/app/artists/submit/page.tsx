'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Upload, X, Check, ArrowLeft } from 'lucide-react';
import { createSubmission } from '@/frontend/lib/artistSubmissions';

const COUNTRIES_CITIES: Record<string, string[]> = {
  Colombia: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira', 'Manizales'],
  México: ['CDMX', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'Oaxaca', 'Mérida'],
  Argentina: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata'],
  Chile: ['Santiago', 'Valparaíso', 'Concepción', 'Viña del Mar'],
  Perú: ['Lima', 'Arequipa', 'Cusco', 'Trujillo'],
  Ecuador: ['Quito', 'Guayaquil', 'Cuenca'],
  España: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao'],
  'Estados Unidos': ['New York', 'Los Angeles', 'Miami', 'Chicago', 'Austin'],
};

const COUNTRIES = Object.keys(COUNTRIES_CITIES);

export default function SubmitArtworkPage() {
  const fileRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [form, setForm] = useState({
    artist_tag: '',
    artist_crew: '',
    artist_country: 'Colombia',
    artist_city: 'Bogotá',
    artist_instagram: '',
    artist_bio: '',
    title: '',
    style: '',
    description: '',
  });

  const availableCities = COUNTRIES_CITIES[form.artist_country] || [];

  const handleCountryChange = (country: string) => {
    const cities = COUNTRIES_CITIES[country] || [];
    setForm({
      ...form,
      artist_country: country,
      artist_city: cities[0] || '',
    });
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files || !files[0]) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError('SOLO SE PERMITEN ARCHIVOS DE IMAGEN (PNG, JPG, WEBP, SVG).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('EL ARCHIVO NO DEBE SUPERAR LOS 5 MB.');
      return;
    }
    setError(null);
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview || !imageFile) {
      setError('DEBES SUBIR LA IMAGEN DE TU OBRA.');
      return;
    }
    if (!acceptedTerms) {
      setError('DEBES ACEPTAR LOS TÉRMINOS DE ESTAMPADO Y REGALÍAS.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let finalImageUrl = preview;

      // Si Cloudinary está configurado, subir ahí; si no, usar DataURL local para demo
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (
        cloudName &&
        uploadPreset &&
        !cloudName.includes('your_') &&
        !uploadPreset.includes('your_')
      ) {
        const data = new FormData();
        data.append('file', imageFile);
        data.append('upload_preset', uploadPreset);
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: 'POST', body: data }
        );
        if (!res.ok) throw new Error('ERROR SUBIENDO IMAGEN A CLOUDINARY.');
        const json = await res.json();
        finalImageUrl = json.secure_url as string;
      }

      const created = createSubmission({
        artist_tag: form.artist_tag.trim().toUpperCase(),
        artist_crew: form.artist_crew.trim().toUpperCase() || 'INDEPENDIENTE',
        artist_city: `${form.artist_city}, ${form.artist_country}`,
        artist_instagram: form.artist_instagram.trim() || '@voltar.crew',
        artist_bio: form.artist_bio.trim(),
        title: form.title.trim().toUpperCase(),
        style: form.style.trim().toUpperCase() || 'DISRUPTIVO',
        description: form.description.trim(),
        image_url: finalImageUrl,
      });

      setSubmittedId(created.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'ERROR AL ENVIAR LA OBRA.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="border-b border-border-strong bg-surface volt-grid px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/artists"
            className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-muted-fg transition-colors hover:text-volt"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            [ VOLVER A GALERÍA URBANA ]
          </Link>

          <div className="mb-2 flex items-center gap-3">
            <span className="tag-volt">[ CONVOCATORIA ABIERTA // OPCIÓN A ]</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-fg">
              CURADURÍA EN /ADMIN
            </span>
          </div>

          <h1 className="font-display text-5xl uppercase tracking-[-0.04em] sm:text-7xl">
            SUBE TU <span className="text-volt">OBRA</span>
          </h1>
          <p className="mt-3 max-w-2xl font-mono text-xs uppercase leading-relaxed tracking-wider text-muted-fg">
            ABIERTO A TODO TIPO DE ARTISTAS VISUALES, ILUSTRADORES, TATUADORES Y CREADORES DISRUPTIVOS.
            UNA VEZ APROBADA TU OBRA EN CURADURÍA, QUEDARÁ DISPONIBLE PARA ESTAMPAR EN EL CUSTOM LAB (+$5 USD POR PRENDA).
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {submittedId ? (
          <div className="border border-volt bg-surface p-8">
            <div className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.1em] text-volt">
              <Check className="h-4 w-4" />
              [ SOLICITUD REGISTRADA // ID: {submittedId.toUpperCase()} ]
            </div>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[-0.03em] text-foreground sm:text-5xl">
              OBRA ENVIADA A CURADURÍA
            </h2>
            <p className="mt-3 max-w-xl font-mono text-xs uppercase leading-relaxed text-muted-fg">
              TU PIEZA QUEDÓ EN ESTADO <span className="text-foreground">PENDING</span>.
              CUANDO EL EQUIPO LA APRUEBE EN EL PANEL ADMIN, APARECERÁ AUTOMÁTICAMENTE EN
              LA GALERÍA URBANA Y EN EL CUSTOM LAB.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/admin"
                className="border border-volt bg-volt px-6 py-3.5 font-mono text-xs font-extrabold uppercase tracking-[0.1em] text-white transition-colors hover:bg-foreground hover:border-foreground hover:text-background"
              >
                [ REVISAR EN /ADMIN &gt;&gt;&gt; ]
              </Link>
              <Link
                href="/artists"
                className="border border-border-strong bg-background px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.1em] text-foreground transition-colors hover:border-volt hover:text-volt"
              >
                [ IR A GALERÍA ]
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 border border-volt bg-volt/10 p-4 font-mono text-xs uppercase text-volt">
                <X className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Bloque 1: Datos del Artista */}
            <div className="border border-border-strong bg-surface p-6">
              <p className="mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-volt">
                [ 01 // IDENTIDAD DEL ARTISTA ]
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-fg">
                    TAG / NOMBRE ARTÍSTICO *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="EJ. KROK-99"
                    className="input-volt"
                    value={form.artist_tag}
                    onChange={(e) => setForm({ ...form, artist_tag: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-fg">
                    CREW / COLECTIVO
                  </label>
                  <input
                    type="text"
                    placeholder="EJ. SOUTH BLOCK CREW"
                    className="input-volt"
                    value={form.artist_crew}
                    onChange={(e) => setForm({ ...form, artist_crew: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-fg">
                    PAÍS *
                  </label>
                  <select
                    required
                    className="input-volt"
                    value={form.artist_country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country} className="bg-surface">
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-fg">
                    CIUDAD *
                  </label>
                  <select
                    required
                    className="input-volt"
                    value={form.artist_city}
                    onChange={(e) => setForm({ ...form, artist_city: e.target.value })}
                  >
                    {availableCities.map((city) => (
                      <option key={city} value={city} className="bg-surface">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-fg">
                    INSTAGRAM / PORTAFOLIO *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="@tu.tag o behance.net/..."
                    className="input-volt"
                    value={form.artist_instagram}
                    onChange={(e) => setForm({ ...form, artist_instagram: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-fg">
                  BIO CORTA DEL ARTISTA *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Cuéntanos brevemente tu trayectoria o estilo callejero."
                  className="input-volt resize-none"
                  value={form.artist_bio}
                  onChange={(e) => setForm({ ...form, artist_bio: e.target.value })}
                />
              </div>
            </div>

            {/* Bloque 2: Datos de la Obra */}
            <div className="border border-border-strong bg-surface p-6">
              <p className="mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-volt">
                [ 02 // ESPECIFICACIONES DE LA OBRA ]
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-fg">
                    TÍTULO DE LA PIEZA *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="EJ. MURO VIVO // 04"
                    className="input-volt"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-fg">
                    ESTILO *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="EJ. ILUSTRACIÓN, TATUAJE, COLLAGE, STENCIL, 3D..."
                    className="input-volt"
                    value={form.style}
                    onChange={(e) => setForm({ ...form, style: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-fg">
                  DESCRIPCIÓN DE LA OBRA *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Técnica, concepto o historia detrás de esta pieza."
                  className="input-volt resize-none"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* Upload */}
              <div className="mt-5">
                <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-fg">
                  ARCHIVO DE DISEÑO (RECOMENDADO: PNG TRANSPARENTE · MÁX 5MB) *
                </label>

                {!preview ? (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="group flex w-full flex-col items-center justify-center gap-3 border border-dashed border-border-strong bg-background py-10 transition-colors hover:border-volt"
                  >
                    <Upload className="h-7 w-7 text-muted-fg transition-colors group-hover:text-volt" />
                    <div className="text-center font-mono">
                      <p className="text-xs font-bold uppercase tracking-widest text-foreground">
                        [ CLIC PARA SELECCIONAR ARCHIVO ]
                      </p>
                      <p className="mt-1 text-[10px] uppercase text-muted-fg">
                        PNG · WEBP · JPG · SVG
                      </p>
                    </div>
                  </button>
                ) : (
                  <div className="flex flex-col gap-4 border border-border-strong bg-background p-4 sm:flex-row sm:items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="Vista previa de la obra"
                      className="h-32 w-32 shrink-0 border border-border object-contain bg-card p-2"
                    />
                    <div className="flex-1 font-mono text-xs">
                      <p className="font-bold uppercase text-foreground">
                        {imageFile?.name}
                      </p>
                      <p className="mt-1 text-[10px] uppercase text-muted-fg">
                        LISTO PARA REVISIÓN EN CURADURÍA
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setImageFile(null);
                        }}
                        className="mt-3 border border-border-strong px-3 py-1.5 text-[10px] font-bold uppercase text-volt hover:border-volt"
                      >
                        [ CAMBIAR IMAGEN ]
                      </button>
                    </div>
                  </div>
                )}

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files)}
                />
              </div>
            </div>

            {/* Términos */}
            <label className="flex cursor-pointer items-start gap-3 border border-border-strong bg-surface p-4 font-mono text-[11px] uppercase leading-relaxed text-muted-fg">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#E61919]"
              />
              <span>
                CONFIRMO QUE SOY EL AUTOR DE ESTA OBRA Y AUTORIZO SU ESTAMPADO EN
                PRENDAS DE VØLTAR® BAJO EL ESQUEMA DE REGALÍA (+$5.00 USD POR PRENDA VENDIDA).
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-volt py-4 font-mono text-xs font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-foreground hover:text-background disabled:opacity-50"
            >
              {submitting ? '[ ENVIANDO A CURADURÍA... ]' : '[ ENVIAR OBRA A CURADURÍA >>> ]'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
