import { useCompanies } from "@/hooks/useCompanies";
import { useMemo, useState } from "react";
import { CompanyCard } from "@/components/company/CompanyCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Filter } from "lucide-react";

const Categories = () => {
  const { data: companies = [], isLoading } = useCompanies();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const categories = useMemo(() => {
    const cats: Record<string, number> = {};
    companies.forEach((c) => {
      const cat = c.category || "Uncategorized";
      cats[cat] = (cats[cat] || 0) + 1;
    });
    return Object.entries(cats).sort((a, b) => b[1] - a[1]);
  }, [companies]);

  const filtered = useMemo(() => {
    if (!selectedCategory || selectedCategory === "all") return companies;
    return companies.filter((c) => c.category === selectedCategory);
  }, [companies, selectedCategory]);

  return (
    <div className="container py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Categories</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse companies grouped by category
        </p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-64 h-9 text-sm">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(([cat, count]) => (
              <SelectItem key={cat} value={cat}>
                {cat} ({count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {companies.length === 0 && !isLoading ? (
        <div className="text-center py-16">
          <Building2 className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No companies loaded</h3>
          <p className="text-sm text-muted-foreground">
            Connect your database to browse categories.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((company) => (
            <CompanyCard key={company.company_id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
