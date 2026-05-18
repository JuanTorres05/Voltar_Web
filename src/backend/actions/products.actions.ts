// =====================================================================
// products.actions.ts  — Server Actions de Next.js
// Estas funciones se ejecutan 100% en el servidor.
// El cliente las llama con "use server" sin exponer lógica backend.
// =====================================================================

'use server';

import { createProduct, updateProduct, deleteProduct } from '@/backend/services/products.service';
import { revalidatePath } from 'next/cache';
import { Product } from '@/shared/types';

/** Subir imágenes a Cloudinary desde el servidor */
async function uploadImages(files: File[]): Promise<string[]> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Variables de entorno de Cloudinary no configuradas.');
  }

  const urls: string[] = [];
  for (const file of files) {
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: form }
    );

    if (!res.ok) throw new Error(`Error subiendo imagen: ${file.name}`);
    const json = await res.json();
    urls.push(json.secure_url as string);
  }

  return urls;
}

/** Acción: Crear producto (llamada desde el formulario de Admin) */
export async function createProductAction(formData: FormData) {
  const name        = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price       = parseFloat(formData.get('price') as string);
  const category    = formData.get('category') as string;
  const sizes       = (formData.get('sizes') as string).split(',').map(s => s.trim()).filter(Boolean);
  const colors      = (formData.get('colors') as string).split(',').map(c => c.trim()).filter(Boolean);
  const imageFiles  = formData.getAll('images') as File[];

  let images: string[] = [];
  if (imageFiles.length > 0 && imageFiles[0].size > 0) {
    images = await uploadImages(imageFiles);
  }

  await createProduct({ name, description, price, category, sizes, colors, images });

  // Revalidar el caché del catálogo para que aparezca el nuevo producto
  revalidatePath('/catalog');
}

/** Acción: Eliminar producto */
export async function deleteProductAction(id: string) {
  await deleteProduct(id);
  revalidatePath('/catalog');
  revalidatePath('/admin');
}
