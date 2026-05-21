# Supabase Integration - Developer Quick Reference

## File Structure

```
src/
├── lib/
│   ├── supabase.ts              ← Supabase client singleton
│   └── utils.ts
├── services/
│   └── companyService.ts        ← All database queries
├── hooks/
│   └── useCompanies.ts          ← React Query hooks
├── types/
│   └── company.ts               ← Company interface (163 fields)
└── pages/
    ├── Index.tsx                ← Home/Dashboard
    ├── ExploreCompanies.tsx     ← List with filters
    ├── Categories.tsx           ← Category view
    ├── CompanyDetail.tsx        ← Single company detail
    ├── Compare.tsx              ← Side-by-side comparison
    ├── SkillMapping.tsx         ← Skill matching
    └── Analytics.tsx            ← Charts & trends
```

## Adding a New Query Function

If you need to fetch new data from Supabase, add it to `src/services/companyService.ts`:

### Example: Get companies by employee size

```typescript
export async function fetchCompaniesByEmployeeSize(
  size: string,
): Promise<Company[]> {
  try {
    const { data, error } = await supabase
      .from("company")
      .select("*")
      .eq("employee_size", size)
      .order("name", { ascending: true });

    if (error) {
      console.error(`Error fetching companies by size ${size}:`, error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error(`Failed to fetch companies by size ${size}:`, error);
    throw error;
  }
}
```

Then create a React Query hook in `src/hooks/useCompanies.ts`:

```typescript
export function useCompaniesByEmployeeSize(size: string) {
  return useQuery({
    queryKey: ["companies", "size", size],
    queryFn: () => fetchCompaniesByEmployeeSize(size),
    enabled: !!size,
  });
}
```

## Adding a New Page

### 1. Create the page file: `src/pages/MyNewPage.tsx`

```typescript
import { useCompanies } from "@/hooks/useCompanies";

const MyNewPage = () => {
  const { data: companies = [], isLoading } = useCompanies();

  if (isLoading) return <div>Loading...</div>;
  if (companies.length === 0) return <div>No data</div>;

  return (
    <div className="container py-6">
      {/* Your content here */}
    </div>
  );
};

export default MyNewPage;
```

### 2. Add route in `src/App.tsx`:

```typescript
import MyNewPage from "./pages/MyNewPage";

// Inside <Routes>:
<Route path="/mynewpage" element={<MyNewPage />} />
```

### 3. Add navigation link in `src/components/layout/Navbar.tsx`:

```typescript
<NavLink to="/mynewpage" label="My New Page" />
```

## Working with the Company Type

The `Company` interface has 163 fields matching the Supabase schema:

```typescript
import { Company } from "@/types/company";

// All fields are optional string | null
interface Company {
  company_id: number;              // Primary key
  name?: string;
  short_name?: string;
  logo_url?: string;
  category?: string;
  // ... 158 more fields
}

// Usage in components:
function MyComponent({ company }: { company: Company }) {
  return (
    <div>
      <h1>{company.name}</h1>
      <p>{company.category}</p>
      <p>{company.hiring_velocity || "Not specified"}</p>
    </div>
  );
}
```

## Common Patterns

### Pattern 1: Fetch and Display List

```typescript
const { data: companies = [] } = useCompanies();

return (
  <div className="grid gap-4">
    {companies.map((company) => (
      <CompanyCard key={company.company_id} company={company} />
    ))}
  </div>
);
```

### Pattern 2: Search with Live Filter

```typescript
const [query, setQuery] = useState("");
const { data: results = [] } = useSearchCompanies(query);

return (
  <>
    <input
      placeholder="Search..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
    {results.map((company) => (
      <div key={company.company_id}>{company.name}</div>
    ))}
  </>
);
```

### Pattern 3: Fetch Single Company by ID

```typescript
const { id } = useParams<{ id: string }>();
const companyId = id ? parseInt(id, 10) : undefined;
const { data: company } = useCompany(companyId);

return company ? (
  <div>{company.name}</div>
) : (
  <div>Not found</div>
);
```

### Pattern 4: Aggregate Data

```typescript
const { data: companies = [] } = useCompanies();

const stats = useMemo(() => {
  const byCategory = new Map<string | null, number>();

  companies.forEach((c) => {
    const cat = c.category;
    byCategory.set(cat, (byCategory.get(cat) || 0) + 1);
  });

  return Array.from(byCategory.entries()).map(([category, count]) => ({
    category,
    count,
  }));
}, [companies]);

return <div>{stats.map((s) => `${s.category}: ${s.count}`)}</div>;
```

## Supabase Query Methods

Common methods available on the client:

```typescript
// SELECT
supabase
  .from("company")
  .select("*") // All columns
  .select("name, category") // Specific columns
  .eq("company_id", 5) // WHERE company_id = 5
  .ilike("name", "%tech%") // WHERE name ILIKE '%tech%'
  .in("company_id", [1, 2, 3]) // WHERE company_id IN (1,2,3)
  .contains("tech_stack", "React") // WHERE tech_stack @> 'React'
  .order("name", { ascending: true }) // ORDER BY name ASC
  .limit(10) // LIMIT 10
  .range(0, 9) // OFFSET 0 LIMIT 10
  .single(); // Expect single row (throw if not)

// COUNT
supabase.from("company").select("*", { count: "exact", head: true }); // Returns count only

// Aggregation (for analytics)
supabase.rpc("function_name", { param: value });
```

## Environment Variables

Add new environment variables with `VITE_` prefix (visible to client):

```bash
# .env.local
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=ey...
VITE_MY_NEW_VAR=value
```

Access in code:

```typescript
import.meta.env.VITE_MY_NEW_VAR;
```

## Testing a Query Locally

Create a test file `test-query.ts`:

```typescript
import { supabase } from "./src/lib/supabase";

async function testQuery() {
  const { data, error } = await supabase
    .from("company")
    .select("company_id, name, category")
    .limit(5);

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Results:", data);
  }
}

testQuery();
```

Run with:

```bash
npx tsx test-query.ts
```

## Debugging Tips

### Check React Query DevTools

Install in dev dependencies:

```bash
npm install -D @tanstack/react-query-devtools
```

Add to App.tsx:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Inside QueryClientProvider:
<ReactQueryDevtools initialIsOpen={false} />
```

### Log Service Calls

Add `console.log` in service functions:

```typescript
export async function fetchCompanies() {
  console.log("[Service] Fetching companies...");
  const { data, error } = await supabase.from("company").select("*");
  console.log("[Service] Companies fetched:", data?.length);
  return data || [];
}
```

### Verify Supabase Connection

In browser console:

```javascript
import { supabase } from "./src/lib/supabase";

(async () => {
  const { data, error } = await supabase.from("company").select("count(*)");
  console.log("Companies in DB:", data);
  if (error) console.error("Error:", error);
})();
```

## Common Errors & Fixes

| Error                                            | Cause                               | Fix                                      |
| ------------------------------------------------ | ----------------------------------- | ---------------------------------------- |
| `Cannot read property 'company_id' of undefined` | Company is null                     | Check `if (!company)` before accessing   |
| `Supabase URL is not defined`                    | Missing `.env.local`                | Create `.env.local` with credentials     |
| `PGRST116: No rows found`                        | Single row query returned 0 results | Use `.eq()` followed by `.maybeSingle()` |
| `401 Unauthorized`                               | Invalid anon key                    | Verify key in Supabase Dashboard         |
| `403 Forbidden`                                  | RLS policy blocks access            | Check table RLS policies in Supabase     |

## Performance Guidelines

✅ **DO:**

- Use specific column selection: `.select('name, category')`
- Limit results: `.limit(50)`
- Cache with React Query (automatic)
- Use batch queries: `.in('company_id', ids)`

❌ **DON'T:**

- Select all columns if you only need a few
- Fetch all 10,000 companies at once
- Make queries in loops (batch instead)
- Call same query function multiple times (use React Query)

## Code Style

Follow existing patterns:

```typescript
// ✅ Good: Error handling, logging, typed
export async function fetchCompaniesByCategory(
  category: string,
): Promise<Company[]> {
  try {
    const { data, error } = await supabase
      .from("company")
      .select("*")
      .eq("category", category);

    if (error) {
      console.error("Error fetching category:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch category:", error);
    throw error;
  }
}

// ❌ Bad: No error handling, hardcoded values
async function getCompanies() {
  const data = await supabase.from("company").select("*");
  return data.data;
}
```

## Next Steps

1. **Run locally**: `npm run dev`
2. **Test endpoints**: Visit each page to verify data loads
3. **Check console**: Look for errors or warnings
4. **Check DevTools**: React Query tab shows all requests
5. **Inspect DB**: Supabase Dashboard → Table Editor → company

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript SDK](https://supabase.com/docs/reference/javascript)
- [React Query Docs](https://tanstack.com/query/latest)
- [Vite Env Variables](https://vitejs.dev/guide/env-and-modes.html)
