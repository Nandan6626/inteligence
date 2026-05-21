import { useCompanies } from "@/hooks/useCompanies";
import { useCompaniesByCategory, useSearchCompanies, useCategoryStats } from "@/hooks/useCompanies";
import { CompanyCard } from "@/components/company/CompanyCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, Building2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const ExploreCompanies = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState("name");

  // Fetch data based on current filters
  const { data: allCompanies = [], isLoading: isLoadingAll } = useCompanies();
  const { data: searchResults = [], isLoading: isLoadingSearch } = useSearchCompanies(search);
  const { data: categoryResults = [], isLoading: isLoadingCategory } = useCompaniesByCategory(categoryFilter);
  const { data: categoryStats = [] } = useCategoryStats();

  const isLoading = isLoadingAll || isLoadingSearch || isLoadingCategory;

  // Initialize category filter from URL
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setCategoryFilter(categoryFromUrl);
    }
  }, [searchParams]);

  const categories = useMemo(() => {
    return categoryStats
      .map((cs) => cs.category)
      .filter((cat) => cat !== null && cat !== undefined)
      .sort() as string[];
  }, [categoryStats]);

  const filtered = useMemo(() => {
    let result = allCompanies;

    // Apply search filter
    if (search) {
      result = searchResults;
    }

    // Apply category filter
    if (categoryFilter && categoryFilter !== "all") {
      result = result.filter((c) => c.category === categoryFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "employee_size":
          return (b.employee_size || "").localeCompare(a.employee_size || "");
        case "yoy_growth_rate":
          return (b.yoy_growth_rate || "").localeCompare(a.yoy_growth_rate || "");
        case "brand_value":
          return (b.brand_value || "").localeCompare(a.brand_value || "");
        default:
          return 0;
      }
    });

    return result;
  }, [allCompanies, searchResults, search, categoryFilter, sortBy]);

  return (
    <div className="container py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Explore Companies</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse and filter placement companies by various parameters
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, sector, tech stack..."
            className="pl-9 h-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48 h-9 text-sm">
            <SlidersHorizontal className="h-3.5 w-3.5 mr-2" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-40 h-9 text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="employee_size">Employee Size</SelectItem>
            <SelectItem value="yoy_growth_rate">Growth Rate</SelectItem>
            <SelectItem value="brand_value">Brand Value</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-5 h-44 animate-pulse">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-secondary rounded w-3/4" />
                  <div className="h-3 bg-secondary rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((company) => (
            <CompanyCard key={company.company_id} company={company} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Building2 className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">
            {allCompanies.length === 0 ? "No companies loaded" : "No matching companies"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {allCompanies.length === 0
              ? "Connect your database to start exploring companies."
              : "Try adjusting your search or filters."}
          </p>
        </div>
      )}
    </div>
  );
};

export default ExploreCompanies;
