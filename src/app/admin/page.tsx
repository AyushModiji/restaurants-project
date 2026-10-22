
import { redirect } from "next/navigation";
import Link from "next/link";
import { serverSupabase } from "@/lib/supabase-server";
import { defaults } from "@/lib/data";
import Editor from "./Editor";
import {
  signOut,
  addDish,
  updateDish,
  deleteDish,
} from "./actions";

export default async function Admin() {
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
    return (
      <main className="admin">
        <section className="panel">
          <h1>Admin access not enabled</h1>
          <p>Verify your email and add it to ADMIN_EMAILS.</p>
          <form action={signOut}>
            <button className="btn">Sign out</button>
          </form>
        </section>
      </main>
    );
  }

  const { data: draft } = await supabase
    .from("site_drafts")
    .select("content")
    .eq("id", 1)
    .maybeSingle();

  const { data: items, error: itemsError } = await supabase
    .from("menu_items")
    .select("*")
    .order("sort_order");

  if (itemsError) {
    console.error("Could not load menu items:", itemsError.message);
  }

  return (
    <main className="admin">
      <div className="bar">
        <div>
          <div className="eyebrow">Owner workspace</div>
          <h1 className="title serif">Website control room</h1>
          <p>{user.email}</p>
        </div>

        <Link className="btn outline" href="/" target="_blank">
          View website
        </Link>

        <Link className="btn outline" href="/menu" target="_blank">
          View menu
        </Link>

        <form action={signOut}>
          <button className="btn">Sign out</button>
        </form>
      </div>

      <p className="notice">
        Save drafts privately; publish to update the public pages.
      </p>

      <Editor
        initial={{
          ...defaults,
          ...(draft?.content || {}),
        }}
      />

      <section className="panel">
        <h2 className="category">Add menu item</h2>

        <form action={addDish}>
          <div className="grid">
            <div className="field">
              <label htmlFor="new-dish-name">Name</label>
              <input id="new-dish-name" name="name" required />
            </div>

            <div className="field">
              <label htmlFor="new-dish-price">Price</label>
              <input
                id="new-dish-price"
                name="price"
                placeholder="₹320"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="new-dish-category">Category</label>
              <input
                id="new-dish-category"
                name="category"
                placeholder="Small plates"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="new-dish-sort">Sort order</label>
              <input
                id="new-dish-sort"
                name="sort_order"
                type="number"
                defaultValue="100"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="new-dish-description">Description</label>
            <textarea id="new-dish-description" name="description" />
          </div>

          <div className="field">
            <label htmlFor="new-dish-image">Image URL</label>
            <input id="new-dish-image" name="image_url" />
          </div>

          <button className="btn">Add dish</button>
        </form>

        <h2 className="category">Edit or delete menu items</h2>

        {items?.map((dish: any) => (
          <form
            action={updateDish}
            key={dish.id}
            className="dishform"
          >
            <input type="hidden" name="id" value={dish.id} />

            <div className="grid">
              <div className="field">
                <label htmlFor={`name-${dish.id}`}>Name</label>
                <input
                  id={`name-${dish.id}`}
                  name="name"
                  defaultValue={dish.name}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor={`price-${dish.id}`}>Price</label>
                <input
                  id={`price-${dish.id}`}
                  name="price"
                  defaultValue={dish.price}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor={`category-${dish.id}`}>Category</label>
                <input
                  id={`category-${dish.id}`}
                  name="category"
                  defaultValue={dish.category}
                />
              </div>

              <div className="field">
                <label htmlFor={`sort-${dish.id}`}>Sort order</label>
                <input
                  id={`sort-${dish.id}`}
                  name="sort_order"
                  type="number"
                  defaultValue={dish.sort_order}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor={`description-${dish.id}`}>
                Description
              </label>
              <textarea
                id={`description-${dish.id}`}
                name="description"
                defaultValue={dish.description}
              />
            </div>

            <div className="field">
              <label htmlFor={`image-${dish.id}`}>Image URL</label>
              <input
                id={`image-${dish.id}`}
                name="image_url"
                defaultValue={dish.image_url || ""}
              />
            </div>

            <label>
              <input
                type="checkbox"
                name="is_available"
                defaultChecked={dish.is_available}
              />
              {" "}Show on public menu
            </label>

            <div className="bar">
              <button className="btn">Save dish</button>

              <button
                className="btn outline"
                formAction={deleteDish}
                name="id"
                value={dish.id}
              >
                Delete dish
              </button>
            </div>
          </form>
        ))}
      </section>
    </main>
  );
}
