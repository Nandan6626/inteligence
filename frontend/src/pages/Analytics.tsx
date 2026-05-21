import { useCompanies } from "@/hooks/useCompanies";
import { useMemo } from "react";
import { BarChart3, Building2, PieChart, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "hsl(217, 89%, 61%)",
  "hsl(142, 71%, 45%)",
  "hsl(43, 96%, 56%)",
  "hsl(4, 90%, 58%)",
  "hsl(262, 83%, 58%)",
  "hsl(190, 80%, 50%)",
];

const Analytics = () => {
  const { data: companies = [] } = useCompanies();

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    companies.forEach((c) => {
      const cat = c.category || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name: name.substring(0, 30), value }));
  }, [companies]);

  const profitData = useMemo(() => {
    let profitable = 0;
    let nonProfitable = 0;
    let unknown = 0;
    companies.forEach((c) => {
      const status = (c.profitability_status || "").toLowerCase();
      if (status.includes("profitable")) profitable++;
      else if (status) nonProfitable++;
      else unknown++;
    });
    return [
      { name: "Profitable", value: profitable },
      { name: "Non-Profitable", value: nonProfitable },
      { name: "Unknown", value: unknown },
    ].filter((d) => d.value > 0);
  }, [companies]);

  const velocityData = useMemo(() => {
    const counts: Record<string, number> = {};
    companies.forEach((c) => {
      const vel = c.hiring_velocity?.split(";")[0]?.trim() || "Unknown";
      const bucket = vel.substring(0, 20);
      counts[bucket] = (counts[bucket] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [companies]);

  if (companies.length === 0) {
    return (
      <div className="container py-6 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-foreground">Analytics & Insights</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visual analysis of placement company landscape
          </p>
        </div>
        <div className="text-center py-16">
          <BarChart3 className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No data available</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Connect your database to see analytics and visual insights across all companies.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Analytics & Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visual analysis across {companies.length} companies
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium text-card-foreground">Distribution by Category</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <RechartsPie>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
                fontSize={10}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPie>
          </ResponsiveContainer>
        </div>

        {/* Profitability */}
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-success" />
            <h3 className="text-sm font-medium text-card-foreground">Profitability Mix</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <RechartsPie>
              <Pie
                data={profitData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                dataKey="value"
                label
              >
                {profitData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPie>
          </ResponsiveContainer>
        </div>

        {/* Hiring Velocity */}
        <div className="rounded-xl border bg-card p-5 shadow-card md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-warning" />
            <h3 className="text-sm font-medium text-card-foreground">Hiring Velocity Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={velocityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="name" fontSize={11} tick={{ fill: "hsl(220, 9%, 46%)" }} />
              <YAxis fontSize={11} tick={{ fill: "hsl(220, 9%, 46%)" }} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(217, 89%, 61%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
