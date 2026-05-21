import { useCompanies } from "@/hooks/useCompanies";
import { useCompanyCount } from "@/hooks/useCompanies";
import { StatCard } from "@/components/home/StatCard";
import {
  Building2,
  TrendingUp,
  Search,
  BarChart3,
  Globe,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { data: companies = [], isLoading } = useCompanies();
  const { data: companyCount = 0 } = useCompanyCount();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero section */}
      <section className="relative overflow-hidden border-b bg-secondary/40">
        <div className="absolute -top-16 right-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-16 left-16 h-56 w-56 rounded-full bg-warning/20 blur-3xl" />
        <div className="container py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-1 text-4xl font-semibold mb-2">
              <span className="text-google-blue">P</span>
              <span className="text-google-red">E</span>
              <span className="text-google-yellow">S</span>
              <span className="hero-title ml-2">Placement Intelligence</span>
            </div>
            <p className="text-muted-foreground mt-2 text-base">
              Decision-grade insights on campus placement companies.
              Analyze, compare, and prepare with structured data.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="chip rounded-full px-3 py-1">Live company profiles</span>
              <span className="chip rounded-full px-3 py-1">Structured hiring signals</span>
              <span className="chip rounded-full px-3 py-1">Comparison-ready insights</span>
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="mt-8 max-w-lg mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search companies, sectors, or tech stacks..."
                  className="pl-10 h-11 rounded-full border-border/60 bg-white/70 shadow-elevated text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/explore"
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-elevated transition hover:shadow-prominent"
              >
                Explore Companies
              </Link>
              <Link
                to="/compare"
                className="rounded-full border border-border/70 bg-white/70 px-5 py-2 text-sm font-semibold text-foreground shadow-card transition hover:shadow-elevated"
              >
                Compare Shortlist
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-10 space-y-10">
        {/* Stats */}
        <section>
          <p className="section-kicker text-xs font-semibold text-muted-foreground mb-2">Overview</p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <StatCard
              icon={Building2}
              label="Total Companies"
              value={companyCount || "—"}
              subtitle="In database"
              color="blue"
            />
            <div className="feature-card rounded-2xl p-5 text-sm text-muted-foreground">
              <p className="section-title text-base font-semibold text-foreground">
                Your placement command center
              </p>
              <p className="mt-2">
                Track hiring velocity, interview signals, and workplace fit across every company
                profile. Keep your shortlist sharp with decision-ready insights.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="chip rounded-full px-3 py-1">163 data points</span>
                <span className="chip rounded-full px-3 py-1">Real-time updates</span>
                <span className="chip rounded-full px-3 py-1">Actionable insights</span>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section>
          <p className="section-kicker text-xs font-semibold text-muted-foreground mb-2">What you can do</p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Shortlist with confidence",
                description: "Compare culture, learning, and compensation signals side-by-side to make the right call.",
                icon: TrendingUp,
              },
              {
                title: "Trace hiring momentum",
                description: "Spot fast-moving hiring cycles and align your prep strategy with real demand.",
                icon: BarChart3,
              },
              {
                title: "Plan global exposure",
                description: "Review mobility, cross-functional exposure, and growth signals before you commit.",
                icon: Globe,
              },
            ].map((item) => (
              <div key={item.title} className="feature-card rounded-2xl p-5">
                <div className="flex items-center gap-2">
                  <item.icon className="h-5 w-5 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Workflow */}
        <section>
          <p className="section-kicker text-xs font-semibold text-muted-foreground mb-2">How it works</p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Scan the landscape",
                description: "Browse the latest company profiles and see high-signal highlights instantly.",
              },
              {
                step: "02",
                title: "Build your shortlist",
                description: "Use comparison and analytics tools to narrow down your best-fit roles.",
              },
              {
                step: "03",
                title: "Prepare with clarity",
                description: "Understand tech stacks, interview signals, and work policies before you apply.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-border/70 bg-white/70 p-5 shadow-card">
                <span className="text-xs font-semibold text-primary">{item.step}</span>
                <h3 className="mt-2 text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Explore tools */}
        <section>
          <p className="section-kicker text-xs font-semibold text-muted-foreground mb-2">Explore tools</p>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Company Explorer",
                description: "Filter by categories, tech stacks, and hiring velocity to pinpoint your targets.",
                to: "/explore",
              },
              {
                title: "Comparison Lab",
                description: "Stack companies side-by-side and surface the best fit in minutes.",
                to: "/compare",
              },
              {
                title: "Skill Mapping",
                description: "Match your skills against real company requirements and close the gaps.",
                to: "/skills",
              },
              {
                title: "Analytics",
                description: "Visualize the placement landscape and stay ahead of hiring trends.",
                to: "/analytics",
              },
            ].map((tool) => (
              <Link
                key={tool.title}
                to={tool.to}
                className="feature-card rounded-2xl p-5 transition hover:shadow-prominent"
              >
                <h3 className="text-sm font-semibold text-foreground">{tool.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Insight cards */}
        <section>
          <p className="section-kicker text-xs font-semibold text-muted-foreground mb-2">Quick insights</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-xl border bg-card p-5 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-card-foreground">Hiring Velocity</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                {companies.length > 0
                  ? "Distribution of hiring speed across companies"
                  : "Connect your database to see hiring velocity distribution"}
              </p>
            </div>
            <div className="rounded-xl border bg-card p-5 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-success" />
                <h3 className="text-sm font-medium text-card-foreground">Profitability Mix</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                {companies.length > 0
                  ? "Profitable vs non-profitable company breakdown"
                  : "Connect your database to see profitability analysis"}
              </p>
            </div>
            <div className="rounded-xl border bg-card p-5 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-warning" />
                <h3 className="text-sm font-medium text-card-foreground">Work Policy</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                {companies.length > 0
                  ? "Remote / Hybrid / On-site distribution"
                  : "Connect your database to see work policy insights"}
              </p>
            </div>
          </div>
        </section>

        {/* Data promise */}
        <section className="rounded-2xl border border-border/70 bg-white/70 p-6 shadow-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="section-kicker text-xs font-semibold text-muted-foreground">Data promise</p>
              <h3 className="section-title text-lg font-semibold text-foreground mt-2">
                Always current. Always structured.
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Every profile is sourced from your Supabase data. Add a new company and it appears
                instantly across dashboards, comparisons, and analytics.
              </p>
            </div>
            <div className="chip rounded-2xl px-5 py-4 text-center">
              <p className="text-xs text-muted-foreground">Active profiles</p>
              <p className="text-3xl font-semibold text-foreground">{companyCount || "—"}</p>
            </div>
          </div>
        </section>

        {/* Empty state */}
        {companies.length === 0 && !isLoading && (
          <section className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">No companies loaded yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Connect your database to start exploring placement intelligence.
              All 163 structured parameters per company will be available for analysis.
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

export default Index;
