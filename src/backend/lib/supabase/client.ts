// Cliente de Supabase para uso en el SERVIDOR (Server Components, Server Actions)
// Nunca exponer el service_role key en el cliente.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Este cliente usa la anon key (segura para SSR + RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
