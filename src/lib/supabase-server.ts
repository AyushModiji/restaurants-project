
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function serverSupabase() {
  const cookieStore = cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Set Supabase environment variables.");
  }

  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        try {
          cookieStore.set({
            name,
            value,
            ...options,
          });
        } catch {
          // Cookies cannot be changed in every Server Component context.
        }
      },
      remove(name: string, options: Record<string, unknown>) {
        try {
          cookieStore.set({
            name,
            value: "",
            ...options,
          });
        } catch {
          // Cookie removal may require a Route Handler or Server Action.
        }
      },
    },
  });
}
