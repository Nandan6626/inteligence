import { useCompanies } from "@/hooks/useCompanies";
import { Company } from "@/types/company";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ArrowLeftRight, Building2 } from "lucide-react";

const compareFields: { label: string; key: keyof Company; section: string }[] = [
  { label: "Category", key: "category", section: "General" },
  { label: "Employee Size", key: "employee_size", section: "General" },
  { label: "Hiring Velocity", key: "hiring_velocity", section: "Culture" },
  { label: "Work Culture", key: "work_culture_summary", section: "Culture" },
  { label: "Manager Quality", key: "manager_quality", section: "Culture" },
  { label: "Burnout Risk", key: "burnout_risk", section: "Culture" },
  { label: "Fixed vs Variable Pay", key: "fixed_vs_variable_pay", section: "Compensation" },
  { label: "ESOPs/Incentives", key: "esops_incentives", section: "Compensation" },
  { label: "Leave Policy", key: "leave_policy", section: "Compensation" },
  { label: "Training Spend", key: "training_spend", section: "Learning" },
  { label: "Mentorship", key: "mentorship_availability", section: "Learning" },
  { label: "Promotion Clarity", key: "promotion_clarity", section: "Learning" },
  { label: "Exit Opportunities", key: "exit_opportunities", section: "Learning" },
  { label: "Skill Relevance", key: "skill_relevance", section: "Learning" },
  { label: "Annual Revenue", key: "annual_revenue", section: "Financials" },
  { label: "Profitability", key: "profitability_status", section: "Financials" },
  { label: "YoY Growth", key: "yoy_growth_rate", section: "Financials" },
  { label: "Valuation", key: "valuation", section: "Financials" },
  { label: "Tech Stack", key: "tech_stack", section: "Technology" },
  { label: "AI/ML Adoption", key: "ai_ml_adoption_level", section: "Technology" },
  { label: "R&D Investment", key: "r_and_d_investment", section: "Technology" },
  { label: "Glassdoor Rating", key: "glassdoor_rating", section: "Brand" },
  { label: "Remote Policy", key: "remote_policy_details", section: "Logistics" },
];

const Compare = () => {
  const { data: companies = [] } = useCompanies();
  const [companyAId, setCompanyAId] = useState<number | null>(null);
  const [companyBId, setCompanyBId] = useState<number | null>(null);

  const a = companies.find((c) => c.company_id === companyAId);
  const b = companies.find((c) => c.company_id === companyBId);

  const sections = [...new Set(compareFields.map((f) => f.section))];

  return (
    <div className="container py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Compare Companies</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Side-by-side structured comparison across key dimensions
        </p>
      </div>

      {/* Selectors */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
        <Select value={companyAId?.toString() || ""} onValueChange={(val) => setCompanyAId(parseInt(val, 10))}>
          <SelectTrigger className="w-full sm:w-64 h-10">
            <SelectValue placeholder="Select Company A" />
          </SelectTrigger>
          <SelectContent>
            {companies.map((c) => (
              <SelectItem key={c.company_id} value={c.company_id.toString()}>
                {c.name || "Unnamed"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ArrowLeftRight className="h-5 w-5 text-muted-foreground shrink-0" />

        <Select value={companyBId?.toString() || ""} onValueChange={(val) => setCompanyBId(parseInt(val, 10))}>
          <SelectTrigger className="w-full sm:w-64 h-10">
            <SelectValue placeholder="Select Company B" />
          </SelectTrigger>
          <SelectContent>
            {companies.map((c) => (
              <SelectItem key={c.company_id} value={c.company_id.toString()}>
                {c.name || "Unnamed"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {companies.length === 0 ? (
        <div className="text-center py-16">
          <Building2 className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No companies available</h3>
          <p className="text-sm text-muted-foreground">
            Connect your database to start comparing companies.
          </p>
        </div>
      ) : a && b ? (
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section} className="rounded-xl border bg-card shadow-card overflow-hidden">
              <div className="px-5 py-3 bg-secondary/50 border-b">
                <h3 className="text-sm font-medium text-foreground">{section}</h3>
              </div>
              <div className="divide-y">
                {compareFields
                  .filter((f) => f.section === section)
                  .map((field) => (
                    <div key={field.key} className="grid grid-cols-3 gap-4 px-5 py-3">
                      <div className="text-xs text-muted-foreground font-medium self-start pt-0.5">
                        {field.label}
                      </div>
                      <div className="text-sm text-foreground">{a[field.key] || "—"}</div>
                      <div className="text-sm text-foreground">{b[field.key] || "—"}</div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-sm text-muted-foreground">
          Select two companies above to compare them side by side.
        </div>
      )}
    </div>
  );
};

export default Compare;
