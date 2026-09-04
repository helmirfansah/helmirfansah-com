# helmirfansah.com

Official website, technical engineering blog, interactive developer lab, and content management panel for **Helmi Irfansah** — Software Engineer & Tech Writer.

🌐 **Production Website**: [https://helmirfansah.com](https://helmirfansah.com)

---

## 🚀 Tech Stack

- **Framework**: [Astro 5](https://astro.build/) (Static Site Generation with dynamic client hydration)
- **Deployment & Hosting**: [Cloudflare Pages](https://pages.cloudflare.com/) via @astrojs/cloudflare
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security)
- **Styling & Effects**: Semantic HTML5, CSS Variables, Ambient Generative Canvas & Cursor Trail
- **Admin Panel**: Custom Linear/WordPress-grade Admin Panel (/admin)

---

## 🌟 Key Features

1. **Portfolio & Technical Notes**:
   - High-performance, SEO-optimized blog system with category filtering and instant search.
   - Reading time estimation, dynamic metadata, and OpenGraph support.

2. **Interactive Developer Lab**:
   - Cloud Infrastructure cost estimator (VPS/Server calculation in IDR).
   - AI Token API pricing calculator (Input/Output token conversion to IDR).

3. **Linear-Grade Admin Panel (/admin)**:
   - **Artikel & Editor**: Write, edit, format markdown, quick edit, and move articles to trash.
   - **Pustaka Media**: Upload images directly or via URL, browse, and copy markdown/direct links.
   - **Branding & Seluruh Tulisan**: Edit any text across the hero, about, 4 skill cards, works, lab, and contact sections.
   - **Kelola Navigasi**: Drag/reorder, edit label, URL, and target for **Navigasi Utama** (Header & Mobile Drawer) and **Navigasi Footer**.
   - **Koneksi Supabase**: Seamlessly switch between zero-config local storage mode and production cloud PostgreSQL.
   - **Alat & Backup**: Export / Import entire website database and settings in single-click JSON.

---

## 🛠️ Local Development

### 1. Install Dependencies
`ash
npm install
`

### 2. Start Dev Server
`ash
npm run dev
`
Open [http://localhost:4321](http://localhost:4321) (Website) or [http://localhost:4321/admin](http://localhost:4321/admin) (Admin Panel).

### 3. Build for Production
`ash
npm run build
`
Build output is generated into the dist/ directory.

---

## 🗄️ Database Setup (Supabase)

If connecting to Supabase:
1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Go to the SQL Editor and run the SQL script provided in [schema.sql](./schema.sql).
3. In /admin, open **Koneksi Supabase**, paste your **Supabase URL** and **Anon Key**, and click **Simpan & Hubungkan**.

---

## ☁️ Deployment to Cloudflare Pages

1. Push this repository to GitHub.
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
3. Select this repository: helmirfansah/helmirfansah-com.
4. Configure Build settings:
   - **Framework preset**: Astro
   - **Build command**: 
pm run build
   - **Build output directory**: dist
5. Click **Save and Deploy**.

---

## 📄 License

MIT © [Helmi Irfansah](https://helmirfansah.com)
