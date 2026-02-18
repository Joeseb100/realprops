# Real Properties - Lead Generation Website

A premium real estate lead generation website built with **Next.js 16**, **Tailwind CSS**, and **PostgreSQL (Supabase)**.

## Features

- **Public Facing Website**:
  - Home page with featured properties and advanced filtering.
  - Property listings with search by location and type.
  - Detailed property view with image gallery.
  - "Call Now" and "WhatsApp" integration for instant leads.
  - Fully responsive design.
- **Admin Panel**:
  - Secure login (`/admin/login`).
  - Dashboard to manage properties.
  - Add, edit, delete, and mark properties as sold.
  - Image upload support.
- **Backend**:
  - Next.js API Routes.
  - Prisma ORM with PostgreSQL.
  - Supabase database hosting.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), Tailwind CSS
- **Backend**: Next.js API Routes, Prisma
- **Database**: PostgreSQL (Supabase)
- **Deployment**: Vercel

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Joeseb100/realprops.git
   cd realproperties
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   # Database (Supabase)
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

   # Auth
   JWT_SECRET="your-secret-key"
   ```

4. **Initialize the database**:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the result.

## Admin Access

- **URL**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Default Credentials** (if seeded):
  - Email: `admin@realproperties.com`
  - Password: `admin123`

## Deployment

Deploy easily on [Vercel](https://vercel.com).
1. Import the project on Vercel.
2. Add the `DATABASE_URL` and `JWT_SECRET` environment variables.
3. Deploy!
