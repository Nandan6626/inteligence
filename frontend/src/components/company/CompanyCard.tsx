import { Company } from "@/types/company";
import { Link } from "react-router-dom";
import { Building2, Users, MapPin, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const id = company.company_id;

  return (
    <Link
      to={`/company/${id}`}
      className="group block rounded-xl border bg-card p-5 shadow-card transition-all hover:shadow-card-hover"
    >
      <div className="flex items-start gap-4">
        {company.logo_url ? (
          <img
            src={company.logo_url.split(";")[0].trim()}
            alt={`${company.name} logo`}
            className="h-10 w-10 rounded-lg object-contain bg-secondary p-1 shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-card-foreground group-hover:text-primary transition-colors truncate">
            {company.name || "Unnamed Company"}
          </h3>
          {company.short_name && company.short_name !== company.name && (
            <p className="text-xs text-muted-foreground">{company.short_name}</p>
          )}
        </div>
      </div>

      {company.category && (
        <Badge variant="secondary" className="mt-3 text-xs">
          {company.category}
        </Badge>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        {company.employee_size && (
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span className="truncate">{company.employee_size}</span>
          </div>
        )}
        {company.focus_sectors && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{company.focus_sectors}</span>
          </div>
        )}
        {company.hiring_velocity && (
          <div className="flex items-center gap-1 col-span-2">
            <TrendingUp className="h-3 w-3" />
            <span className="truncate">Hiring: {company.hiring_velocity}</span>
          </div>
        )}
      </div>

      {company.profitability_status && (
        <p className="mt-2 text-xs text-success truncate">
          {company.profitability_status}
        </p>
      )}
    </Link>
  );
}
