# photobooth.ph Platform Migration

This project has been converted from a single static HTML page into a scalable full-stack foundation using Next.js + TypeScript + Prisma + PostgreSQL.

## Recommended Stack

- Frontend: Next.js App Router, TypeScript, server components
- Auth: NextAuth or Clerk (add during phase 2)
- Database: PostgreSQL with Prisma ORM
- Object storage: Cloudinary or S3-compatible storage for media
- Realtime and queues: Upstash Redis + background jobs (for rendering/export)
- Deployment: Vercel (app) + Neon/Supabase Postgres
- Monetization: Google AdSense on public memory pages and blog content

## What Was Converted

- The existing [index.html](index.html) is now used as your homepage source.
- [app/page.tsx](app/page.tsx) reads and renders the legacy HTML so your current design stays intact.
- Added dynamic memory pages at [app/[slug]/page.tsx](app/[slug]/page.tsx) for URLs like /maya.
- Added platform sections at [app/studio/page.tsx](app/studio/page.tsx) and [app/partner/page.tsx](app/partner/page.tsx).
- Added API stubs:
  - [app/api/events/route.ts](app/api/events/route.ts)
  - [app/api/customizations/route.ts](app/api/customizations/route.ts)
- Added schema for users, memory sites, sessions, templates, and partners at [prisma/schema.prisma](prisma/schema.prisma).

## Why This Stack Fits Your Goals

- Unlimited customization: A React-based studio can evolve to layer/canvas editing without rewriting the app.
- Personal memory websites: Dynamic slug routing supports one site per user/event.
- Partner network: Booth and session models already exist in the schema.
- Public growth + SEO: Next.js server rendering improves discoverability.
- AdSense income: Script is already wired in [app/layout.tsx](app/layout.tsx) using NEXT_PUBLIC_ADSENSE_CLIENT_ID.

## Run Locally

1. Install dependencies:
   - npm install
2. Set environment variables:
   - copy .env.example to .env
3. Generate Prisma client:
   - npm run prisma:generate
4. Start development server:
   - npm run dev

## Next Build Steps

1. Replace in-memory API data with Prisma DB writes.
2. Add authentication and role-based dashboards (creator, partner, admin).
3. Integrate booth QR sync (session code scanning).
4. Add media upload pipeline and thumbnail generation.
5. Add ad placements on public memory pages plus privacy/consent flows.
