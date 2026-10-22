import {createBrowserClient,createServerClient} from "@supabase/ssr";
import {cookies} from "next/headers";
export function browserSupabase(){const u=process.env.NEXT_PUBLIC_SUPABASE_URL,k=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;if(!u||!k)throw Error("Set Supabase environment variables.");return createBrowserClient(u,k);}
export async function serverSupabase(){const c=cookies(),u=process.env.NEXT_PUBLIC_SUPABASE_URL,k=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;if(!u||!k)throw Error("Set Supabase environment variables.");return createServerClient(u,k,{cookies:{get(n){return c.get(n)?.value},set(n,v,o){try{c.set({name:n,value:v,...o})}catch{}},remove(n,o){try{c.set({name:n,value:"",...o})}catch{}}}});}
