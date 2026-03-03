# Home Affordability Calculator

A comprehensive home affordability analysis tool that combines mortgage calculations, tax estimates, budget analysis, and scenario comparison into a single dashboard. Built with Next.js and Supabase.

## Features

- **Mortgage Calculator** — Monthly PITI (principal, interest, tax, insurance, PMI) with fixed-rate and 7/1 ARM support
- **Income & Tax Estimator** — Federal + state income tax, FICA, effective rate, and take-home pay for all 50 states + DC
- **Maximum Borrowing Power** — Three methods: 28% front-end DTI, 45% back-end DTI, and 30% net income
- **Amortization Schedule** — Yearly breakdown with optional extra payments showing interest saved and early payoff
- **Pay Down vs Invest** — Side-by-side comparison of extra mortgage payments vs market investing
- **Budget Analysis** — Obligated debts + 20 discretionary expense categories with 50/30/20 rule scoring
- **Sell & Move Up** — Equity calculation, new home PITI comparison, and cash-at-closing estimate
- **3-Scenario Comparison** — Compare up to 3 home prices and down payments with highlighted best values
- **County Property Tax Lookup** — Enter a zip code to pull median property tax rates from U.S. Census ACS data
- **Live Mortgage Rates** — Optional FRED API integration for current 30-year and 15-year Freddie Mac rates
- **PDF Export** — Downloadable report with section selection modal — choose which sections to include
- **User Accounts** — Supabase email/password and Google OAuth authentication

## Tech Stack

- **Framework** — Next.js 14 (App Router)
- **UI** — React 18, Tailwind CSS, inline styles
- **Auth** — Supabase Auth with SSR cookie management
- **Database** — Supabase (PostgreSQL) with Row Level Security
- **PDF** — html2pdf.js (html2canvas + jsPDF)
- **APIs** — U.S. Census ACS5 (property tax), FRED (mortgage rates)
- **Deployment** — Vercel

## Getting Started

### Prerequisites

- Node.js 18+ (recommended; Node 22 has known issues with Next.js 14 middleware locally)
- A Supabase project ([supabase.com](https://supabase.com))

### Installation

```bash
git clone https://github.com/DCro95/home-calculator.git
cd home-calculator
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional — enables live mortgage rate display
NEXT_PUBLIC_FRED_KEY=your-fred-api-key
```

- **Supabase keys** — Found in your Supabase dashboard under Settings > API
- **FRED API key** — Free at [fred.stlouisfed.org/docs/api/api_key.html](https://fred.stlouisfed.org/docs/api/api_key.html)

### Database Setup

Run the SQL in `supabase-setup.sql` against your Supabase project to create the `profiles` and `scenarios` tables with RLS policies.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** On Node 22, the middleware may throw an `EvalError` locally due to an edge-runtime incompatibility. This does not affect production on Vercel (Node 18).

## Email Authentication (Custom SMTP)

Supabase's built-in email service is rate-limited to ~3-4 emails/hour on the free tier. To remove this limit, configure a custom SMTP provider in the Supabase dashboard:

1. **Get SMTP credentials** from your email provider (e.g., [Resend](https://resend.com) — 3,000 emails/month free)
2. **In Supabase dashboard** — Go to **Settings > Auth > SMTP Settings**:
   - Enable **Custom SMTP**
   - Host: `smtp.resend.com`
   - Port: `465`
   - Username: `resend`
   - Password: your Resend API key
   - Sender email: `noreply@yourdomain.com` (must match a verified domain in Resend)
3. **Save** — Sign-up confirmation emails will now send through your SMTP provider with no rate limit

## Deployment

Deploy to Vercel and set the environment variables in your Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_FRED_KEY          # optional
```

## Project Structure

```
src/
  app/
    page.tsx                  # Landing page
    login/page.tsx            # Login page
    signup/page.tsx           # Sign-up page
    calculator/page.tsx       # Main calculator (protected)
    dashboard/page.tsx        # Saved scenarios (protected)
    auth/callback/route.ts    # Email confirmation handler
    terms/page.tsx            # Terms of service
  components/
    Calculator.jsx            # All calculator logic, tabs, and PDF generation
    Navbar.tsx                # Navigation bar with user menu
  lib/supabase/
    client.ts                 # Browser Supabase client
    server.ts                 # Server-side Supabase client
  middleware.ts               # Route protection and auth session management
```

## License

Private repository.
