# Quick Start Guide - Supabase Integration

## 5-Minute Setup

### Step 1: Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Open your project
3. Go to **Settings → API**
4. Copy:**Project URL** and **anon public key**

### Step 2: Create `.env.local`

In the project root, create a file named `.env.local`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

Paste your values from Step 1.

### Step 3: Verify Database Table

In Supabase Dashboard:

1. Go to **Editor → Tables**
2. Verify table `public.company` exists
3. Check it has at least these columns:
   - `company_id` (number, primary key)
   - `name` (text)
   - `category` (text)
   - And ~160 more text columns

### Step 4: Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Step 5: Check It Works

✅ Home page shows company count  
✅ Explore page shows company list  
✅ Click a company, see details load  
✅ Search works  
✅ Filters work

**Done!** 🎉

## What Each Page Shows

| Page       | URL           | What It Does                              |
| ---------- | ------------- | ----------------------------------------- |
| Home       | `/`           | Shows company stats and category overview |
| Explore    | `/explore`    | Browse companies with search & filters    |
| Categories | `/categories` | Browse by category dropdown               |
| Detail     | `/company/1`  | View all 163 fields for one company       |
| Compare    | `/compare`    | Compare 2 companies side-by-side          |
| Skills     | `/skills`     | Find companies matching your skills       |
| Analytics  | `/analytics`  | Charts showing company trends             |

## Common Setup Issues

### ❌ "Error: VITE_SUPABASE_URL is not set"

**Fix:**

1. Create `.env.local` in project root (not subdirectories)
2. Paste exact `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Restart dev server: `npm run dev`

### ❌ "Error: Could not fetch companies"

**Fix:**

1. Verify URL format: should be `https://xxx.supabase.co` (with `.co`)
2. Verify anon key is correct (starts with `ey`)
3. In Supabase, check that **RLS is disabled** for `public.company` table:
   - Go to **editor → company table**
   - Click **RLS → Disable RLS** (or modify policies if needed)
4. Check table exists: `SELECT * FROM public.company LIMIT 1`

### ❌ Pages show "No companies loaded"

**Possible causes:**

1. Database is empty - add test data to `public.company` table
2. Table name is wrong - verify it's `public.company` (case-sensitive)
3. Columns are different - schema must match

**Test query:**

```sql
-- Run in Supabase SQL Editor
SELECT COUNT(*) FROM public.company;
```

### ❌ "Cannot read property 'company_id'"

**Fix:** Components are trying to access data before it loads. Check if loading/error states are handled.

## Environment Variables Reference

```env
# REQUIRED - Supabase authentication
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# OPTIONAL - For future use
# VITE_API_TIMEOUT=10000
# VITE_ENABLE_ANALYTICS=true
```

## File Locations You May Need

- **Config file:** `.env.local`
- **Supabase client:** `src/lib/supabase.ts`
- **Database functions:** `src/services/companyService.ts`
- **React hooks:** `src/hooks/useCompanies.ts`
- **Company type:** `src/types/company.ts`
- **Home page:** `src/pages/Index.tsx`
- **Explore page:** `src/pages/ExploreCompanies.tsx`
- **Company detail:** `src/pages/CompanyDetail.tsx`

## Database Details

### Supabase Schema

The `public.company` table has:

- **Primary Key:** `company_id` (integer)
- **Row Count:** ~163 companies (depends on your data)
- **Columns:** ~163 text fields including:
  - Basic: name, short_name, logo_url, category
  - Business: annual_revenue, yoy_growth_rate, profitability_status
  - Culture: hiring_velocity, work_culture_summary, manager_quality
  - Learning: training_spend, mentorship_availability, skill_relevance
  - Technology: tech_stack, ai_ml_adoption_level, automation_level
  - And many more...

See full schema in `SUPABASE_INTEGRATION.md`

## Build & Deploy

### Local Development

```bash
npm run dev      # Start dev server at http://localhost:5173
```

### Production Build

```bash
npm run build    # Create optimized dist/ folder
npm run preview  # Preview production build locally
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard (same as `.env.local`)

### Deploy to Netlify

1. Push code to GitHub
2. Connect repo to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Testing

### Run Test Suite

```bash
npm run test        # Run tests once
npm run test:watch  # Run tests in watch mode
```

### Load Testing

If you have 1000+ companies, test pagination:

```bash
# In browser console
fetch('/api/companies?limit=100&offset=0')
```

## Debugging

### Enable React Query DevTools

In development, React Query DevTools gives visibility into all queries:

1. Look for **⚛️** icon in bottom-left
2. Click to expand React Query panel
3. Watch queries execute in real-time
4. See request/response data

### Check Supabase Logs

In Supabase Dashboard:

- Go to **Logs → API**
- Filter by table: `company`
- See all requests and errors

### Browser Console

Open DevTools (F12) → Console to see:

- Service function logs
- Error messages
- Data fetch confirmations

## Next Steps

1. ✅ Set up `.env.local`
2. ✅ Run `npm run dev`
3. ✅ Test each page
4. ✅ Read `SUPABASE_INTEGRATION.md` for detailed architecture
5. ✅ Read `DEVELOPER_GUIDE.md` if adding new features
6. ✅ Deploy to production

## Support

For issues:

1. Check `.env.local` is correct
2. Check Supabase dashboard → SQL Console
3. Check browser console for error messages
4. See troubleshooting section in `SUPABASE_INTEGRATION.md`

---

**You're all set!** The app will automatically fetch all data from Supabase. Every page is database-driven. 🚀
