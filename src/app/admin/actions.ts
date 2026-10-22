
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { serverSupabase } from "@/lib/supabase-server";

async function admin() {
  const supabase = await serverSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const allowedEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (
    !user.email ||
    !user.email_confirmed_at ||
    !allowedEmails.includes(user.email.toLowerCase())
  ) {
    throw new Error("Verified email is not authorised.");
  }

  return supabase;
}

export async function saveDraft(formData: FormData) {
  const supabase = await admin();

  let content: unknown;

  try {
    content = JSON.parse(String(formData.get("content") || "{}"));
  } catch {
    throw new Error("Invalid editor data.");
  }

  const { error } = await supabase.from("site_drafts").upsert({
    id: 1,
    content,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}

export async function publish() {
  const supabase = await admin();

  const { data, error } = await supabase
    .from("site_drafts")
    .select("content")
    .eq("id", 1)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const { error: publishError } = await supabase
    .from("published_site_content")
    .upsert({
      id: 1,
      content: data.content,
      updated_at: new Date().toISOString(),
    });

  if (publishError) {
    throw new Error(publishError.message);
  }

  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/admin");
}

export async function signOut() {
  const supabase = await admin();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function addDish(formData: FormData) {
  const supabase = await admin();

  const row = {
    name: String(formData.get("name") || "").trim(),
    price: String(formData.get("price") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    category: String(formData.get("category") || "Menu").trim(),
    image_url: String(formData.get("image_url") || "").trim(),
    sort_order: Number(formData.get("sort_order") || 100),
    is_available: true,
  };

  if (!row.name) {
    throw new Error("Dish name is required.");
  }

  const { error } = await supabase.from("menu_items").insert(row);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/admin");
}

export async function updateDish(formData: FormData) {
  const supabase = await admin();
  const id = String(formData.get("id") || "");

  const row = {
    name: String(formData.get("name") || "").trim(),
    price: String(formData.get("price") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    category: String(formData.get("category") || "Menu").trim(),
    image_url: String(formData.get("image_url") || "").trim(),
    sort_order: Number(formData.get("sort_order") || 100),
    is_available: formData.get("is_available") === "on",
  };

  if (!id || !row.name) {
    throw new Error("Dish name and ID are required.");
  }

  const { error } = await supabase
    .from("menu_items")
    .update(row)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/admin");
}

export async function deleteDish(formData: FormData) {
  const supabase = await admin();
  const id = String(formData.get("id") || "");

  if (!id) {
    throw new Error("Dish ID is missing.");
  }

  const { error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/admin");
}
