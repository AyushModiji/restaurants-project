# Single Restaurant Platform source

Includes a responsive main website (`/`), separate QR menu (`/menu`), owner sign-in (`/admin/login`), email password reset (`/admin/reset-password`), and private owner dashboard (`/admin`).

The dashboard edits restaurant name, tagline, logo URL, fonts, brand colours, hero/story copy and image URLs, gallery URLs, contact details, opening hours, maps link, section visibility, and menu item add/edit/delete/availability/order. Draft content is stored separately from public published content. QR menu contains no online ordering or payments.

## Setup
1. Use Node.js 20+ in a computer or cloud development environment.
2. Create a Supabase project and run `supabase/schema.sql` in its SQL Editor.
3. Enable email/password authentication and email confirmation in Supabase Auth. Set Site URL and redirect URL to include `/admin/reset-password`.
4. Create and verify the owner account. Set trusted `app_metadata.role=admin` through a trusted server-side Supabase Admin API process. Never put the service-role key in browser code.
5. Copy `.env.example` to `.env.local` and set the project URL, anon key, and exact owner email.
6. Run `npm install`, then `npm run dev`. Deploy to a Next.js-compatible host and configure the same environment variables.

## Important limitations
This is a full source-code foundation, not a deployed service. It has not been end-to-end tested in this chat. Replace sample restaurant details and demo dishes. Image controls accept public image URLs; direct image uploads, drag-and-drop layout editing, audit history and multi-admin management UI are not included. Test Supabase RLS, email flows, publish behaviour, backups and security before production.
