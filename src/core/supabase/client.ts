import { createBrowserClient as supabaseCreateBrowserClient } from "@supabase/ssr";
import { Database } from "./database.types";

/**
 * Cria o cliente do Supabase para uso no navegador (Client Components).
 */
export const createBrowserClient = () => {
  return supabaseCreateBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
};

/**
 * Atalho para criar o cliente (alias createClient)
 */
export const createClient = () => createBrowserClient();

// Exportação padrão para compatibilidade
export default createClient;
