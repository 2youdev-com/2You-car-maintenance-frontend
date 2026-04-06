# El Amrety Frontend 🚗

> منصة إدارة مركز العمريطي للصيانة — Next.js 14 App

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)

## ✨ Features

- 🎛️ **Admin Dashboard** — Stats, revenue charts, recent activity
- 🔧 **Maintenance Logger** — Full service record form with parts tracking
- 📦 **Inventory Management** — CRUD for spare parts with low-stock alerts
- 👤 **Customer View** — Service history & parts catalog
- 📱 **Mobile Responsive** — Works on all screen sizes
- 🌙 **Dark Theme** — Matches El Amrety brand identity
- 🔐 **Supabase Auth** — Row-level security per center

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A Supabase project

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/Belal-Mohamed-24/El-Amrety-frontend.git
cd El-Amrety-frontend

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Run the database schema on Supabase
# Go to Supabase Dashboard → SQL Editor → paste schema.sql from El-Amrety-backend

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── dashboard/          # Admin dashboard + layout
│   ├── maintenance/        # Maintenance log page
│   ├── inventory/          # Spare parts management
│   ├── customer/           # Customer-facing view
│   └── globals.css         # Global styles + dark theme vars
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx     # Navigation sidebar
│   └── forms/
│       ├── MaintenanceLogForm.tsx
│       └── InventoryTable.tsx
├── lib/
│   └── supabase.ts         # Supabase client
└── types/
    └── index.ts            # All TypeScript types
```

## 🛠️ Tech Stack

| Layer      | Technology |
|------------|-----------|
| Framework  | Next.js 14 (App Router) |
| Styling    | Tailwind CSS + custom design system |
| UI         | Shadcn/UI + Radix primitives |
| Icons      | Lucide React |
| Forms      | react-hook-form + Zod |
| Charts     | Recharts |
| Database   | Supabase (PostgreSQL) |
| Auth       | Supabase Auth |
| Deployment | Vercel |

## 🌐 Deployment (Vercel)

```bash
npm i -g vercel
vercel --prod
```

Add env vars in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL`

## 📄 License

Private — El Amrety Center © 2024
