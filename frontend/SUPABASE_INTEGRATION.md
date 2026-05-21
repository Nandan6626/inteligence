# Supabase Integration for PES Placement Intelligence PWA

## Overview

This document outlines the complete Supabase integration for the PES Placement Intelligence Progressive Web Application (PWA). The application now connects to a PostgreSQL database via Supabase and dynamically populates all UI screens with real company data.

## ✅ Integration Status

The following has been completed:

- ✅ Supabase client configuration
- ✅ Environment variable setup
- ✅ Company type definition (163 fields matching database schema)
- ✅ Data access layer with comprehensive service functions
- ✅ React Query hooks for data fetching and caching
- ✅ Home/Dashboard page with dynamic stats and categories
- ✅ Explore/Categories pages with filters and search
- ✅ Company Detail page with all structured data
- ✅ Comparison page for side-by-side analysis
- ✅ Skill Mapping page with company skill matching
- ✅ Analytics page with dynamic visualizations
- ✅ Error handling and loading states

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the project root:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace these values with your actual Supabase project credentials:

- Get your URL from Supabase Dashboard → Settings → API
- Get your anon key from the same location under the API section

**⚠️ Important**: Never commit `.env.local` to version control. Add it to `.gitignore`.

### 2. Install Dependencies

```bash
npm install @supabase/supabase-js
```

Or if using bun:

```bash
bun add @supabase/supabase-js
```

This has already been done in the project.

## Architecture

### 1. Supabase Client (`src/lib/supabase.ts`)

Initializes and exports the Supabase client:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 2. Company Type (`src/types/company.ts`)

Defines a TypeScript interface that matches the `public.company` table schema exactly:

- Primary key: `company_id` (number)
- ~163 fields, all text except `company_id` (number)
- All fields are optional (`string | null`)

### 3. Data Access Layer (`src/services/companyService.ts`)

Provides async functions for all database operations:

| Function                                           | Purpose                                                 |
| -------------------------------------------------- | ------------------------------------------------------- |
| `fetchCompanies(limit, offset, sortBy, sortOrder)` | Fetch all companies with pagination and sorting         |
| `fetchCompanyById(id)`                             | Fetch single company by ID                              |
| `fetchCompanyByName(name)`                         | Fetch company by name (ilike search)                    |
| `searchCompanies(query)`                           | Full-text search across name, short_name, overview_text |
| `fetchCompaniesByCategory(category)`               | Filter by category                                      |
| `fetchCompaniesByIds(ids)`                         | Fetch multiple companies by ID array                    |
| `fetchCategoryStats()`                             | Get category distribution                               |
| `fetchCompanyCount()`                              | Get total company count                                 |
| `fetchHiringVelocityStats()`                       | Analytics: hiring velocity distribution                 |
| `fetchProfitabilityStats()`                        | Analytics: profitability distribution                   |

All functions:

- Return typed Company objects
- Include error handling with logging
- Work directly with Supabase PostgreSQL queries
- Avoid N+1 queries through batch operations where possible

### 4. React Query Hooks (`src/hooks/useCompanies.ts`)

Custom hooks that wrap service functions with React Query caching:

```typescript
useCompanies(); // Fetch all companies
useCompany(id); // Fetch by ID
useSearchCompanies(query); // Search (enabled when query.length > 0)
useCompaniesByCategory(category); // Filter by category
useCompaniesByIds(ids); // Fetch multiple by IDs
useCategoryStats(); // Category distribution
useCompanyCount(); // Total count
useHiringVelocityStats(); // Hiring velocity analytics
useProfitabilityStats(); // Profitability analytics
```

## Page-by-Page Integration Details

### Home / Index Page (`src/pages/Index.tsx`)

**Data Sources:**

- `useCompanies()` - all companies
- `useCategoryStats()` - category distribution
- `useCompanyCount()` - total companies
- `useHiringVelocityStats()` - hiring trends
- `useProfitabilityStats()` - profitability trends

**Displays:**

- Total companies (from `fetchCompanyCount()`)
- Number of categories (from `fetchCategoryStats()`)
- Profitable company count (derived from company data)
- Top 4 categories by count (dynamically sorted)

### Explore Companies (`src/pages/ExploreCompanies.tsx`)

**Features:**

- Dynamic company list with pagination
- Full-text search (name, short_name, overview_text)
- Category filtering with live category list from DB
- Sorting by: name, employee_size, yoy_growth_rate, brand_value
- URL parameters for bookmarking: `?q=query&category=category`

**Data Sources:**

- `useCompanies()` - base list
- `useSearchCompanies(query)` - search results
- `useCategoryStats()` - available categories
- Client-side filtering and sorting

### Categories Page (`src/pages/Categories.tsx`)

**Features:**

- Dropdown to select category
- Display all companies in selected category
- Shows company count per category

**Data Sources:**

- `useCompanies()` - all companies
- Client-side category grouping

### Company Detail (`src/pages/CompanyDetail.tsx`)

**Features:**

- Route parameter: `/company/:id` (company_id as number)
- 10 tabs with comprehensive company information:
  - Overview: Logo, category, founding year, headquarters, etc.
  - Business: Pain points, sectors, offerings, financials strategy
  - Culture: Work environment, hiring velocity, diversity metrics
  - Learning: Training, mentorship, career growth opportunities
  - Compensation: Pay structure, benefits, insurance
  - Logistics: Remote policy, commute, office location
  - Financials: Revenue, growth, funding, risks
  - Technology: Tech stack, AI/ML adoption, R&D
  - Leadership: CEO, board, contact information
  - Brand: Website, social media, ratings, recognition

**Data Sources:**

- `useCompany(id)` - single company fetch by ID

### Comparison Page (`src/pages/Compare.tsx`)

**Features:**

- Select two companies via dropdowns (company_id)
- Display 23 key fields side-by-side
- Organize fields by section (General, Culture, Compensation, Learning, Financials, Technology, Brand, Logistics)

**Data Sources:**

- `useCompanies()` - dropdown options
- Client-side filtering for selected companies

### Skill Mapping (`src/pages/SkillMapping.tsx`)

**Algorithm:**

1. User enters skills (e.g., "Kubernetes", "Python", "AWS")
2. For each company, checks corpus: `${tech_stack} ${ai_ml_adoption_level} ${automation_level} ${skill_relevance}`
3. Calculates match percentage and fit level (High/Medium/Low)
4. Displays matched skills and gaps

**Data Sources:**

- `useCompanies()` - all companies
- Client-side skill matching (deterministic, no AI)

### Analytics Page (`src/pages/Analytics.tsx`)

**Charts Generated:**

- Category distribution (bar chart, top 30 truncated)
- Profitability status (pie chart: Profitable/Non-Profitable/Unknown)
- Hiring velocity distribution (bar chart, top 8)

**Data Sources:**

- `useCompanies()` - all companies
- Client-side aggregation for charts

## Component Updates

### CompanyCard (`src/components/company/CompanyCard.tsx`)

Updated to use `company.company_id` (not `id`) for routing to `/company/:company_id`

### CompanySections (`src/components/company/CompanySections.tsx`)

Displays all ~163 company fields organized into sections:

- SectionBusiness
- SectionCulture
- SectionLearning
- SectionCompensation
- SectionLogistics
- SectionFinancials
- SectionTechnology
- SectionLeadership
- SectionBrand

### SectionOverview (`src/components/company/SectionOverview.tsx`)

Displays company header with logo, name, category, and key details.

## Database Schema Alignment

The `Company` interface (`src/types/company.ts`) maintains 1:1 correspondence with `public.company` table:

```sql
CREATE TABLE public.company (
  company_id integer NOT NULL PRIMARY KEY,
  name text,
  short_name text,
  logo_url text,
  category text,
  ... (159 more text columns)
  incorporation_year text,
  -- ... full schema provided in migration
);
```

**Key Rules Maintained:**

- ✅ No columns are renamed
- ✅ No derived fields are added
- ✅ All fields remain optional (`string | null`)
- ✅ Primary key is `company_id` (number)
- ✅ All other fields are text type

## Error Handling & User Experience

### Loading States

- Skeleton loaders for list views
- "Loading..." messages for async operations
- Animated fade-in transitions

### Empty States

- When no companies are loaded: "No companies loaded. Connect your database..."
- When search yields no results: "No matching companies found. Try adjusting filters..."
- When database is empty: Appropriate empty state messages

### Error Handling

All service functions include:

- Try-catch blocks
- Console error logging
- Silent failures (don't crash UI)
- Null return values on errors

### Network Resilience

React Query provides:

- Automatic request dedueling (3-second stale time)
- Failed request retry logic
- Client-side caching

## Performance Optimizations

1. **Lazy Loading**: Components only fetch data when mounted (via React Query enabled conditions)
2. **Query Caching**: React Query caches results with 3-minute stale time
3. **Column Selection**: Service functions select only needed columns where applicable
4. **Pagination**: HOME page uses lazy loading for large datasets
5. **Client-Side Sorting**: Sorts already-fetched data (no additional API calls)

## Testing the Integration

### 1. Verify Environment Setup

```bash
# Check that .env.local exists
cat .env.local

# Should output:
# VITE_SUPABASE_URL=https://...
# VITE_SUPABASE_ANON_KEY=ey...
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Verify Data Loading

Visit each page and check:

- **/**: Dashboard shows company count, categories
- **/explore**: Company cards appear, filters work, search works
- **/categories**: Categories dropdown populated, companies display
- **/company/1**: Company details load for company_id=1
- **/compare**: Two companies can be selected and compared
- **/skills**: Skill matching works
- **/analytics**: Charts render with data

### 4. Check Browser Console

- No `Cannot read property 'company_id'` errors ✓
- No `Supabase connection failed` errors ✓
- React Query DevTools shows successful queries ✓

## Build & Production

### Build for Production

```bash
npm run build
```

Output: `dist/` folder with optimized static assets

### Environment Variables in Production

The same `.env.local` values are read at build time (Vite). Ensure:

- `VITE_SUPABASE_URL` is set
- `VITE_SUPABASE_ANON_KEY` is set
- Both are accessible to the build process

### Deployment

The build is framework-agnostic and can be deployed to:

- Vercel
- Netlify
- GitHub Pages
- Any static host
- Docker container

## Troubleshooting

### Problem: "Missing Supabase URL or anon key"

**Solution:**

- Check `.env.local` exists in project root
- Verify values are correct from Supabase Dashboard
- Restart dev server after creating `.env.local`

### Problem: "Could not fetch companies"

**Solution:**

- Verify database connection in Supabase
- Check that `public.company` table exists
- Check RLS policies allow anon read access
- Check Supabase project is active

### Problem: Routes return 404 for company detail

**Solution:**

- Verify URLs use `/company/:id` pattern (colon before parameter name)
- Check that company_id values are numeric
- Verify database has companies with those IDs

### Problem: Search not working

**Solution:**

- Ensure search input has content (minimum 1 character)
- Check that company names/sectors exist in database
- Verify `ilike` operator is supported by PostgreSQL (it is)

## Future Enhancements

1. **Backend Filtering**: Move filtering to Supabase for large datasets
   - `.eq()`, `.contains()`, `.range()` in service layer

2. **Real-time Updates**: Subscribe to table changes
   - Use Supabase realtime features

3. **Advanced Analytics**: More sophisticated aggregation
   - Time-series analysis
   - Trend detection
   - Cohort analysis

4. **Export Features**: Export company data
   - CSV export
   - PDF reports

5. **Favorites/Shortcuts**: Client-side localStorage integration
   - Star companies
   - Custom notes

6. **Admin Dashboard**: Data management
   - CRUD operations (with RLS)
   - Data validation
   - Bulk import

## Summary

The PES Placement Intelligence PWA is now fully integrated with Supabase PostgreSQL. All screens dynamically fetch and display real company data without any hardcoded values. The architecture follows best practices:

✅ Single source of truth (database)  
✅ Type-safe data binding (TypeScript)  
✅ Efficient caching (React Query)  
✅ Error handling & resilience  
✅ Scalable to any number of companies  
✅ Production-ready

To start using the application:

1. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`
2. Run `npm run dev`
3. All pages will automatically fetch from your database

Enjoy! 🚀
