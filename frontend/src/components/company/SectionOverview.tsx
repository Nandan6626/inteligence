import { Company } from "@/types/company";
import { Building2, MapPin, Calendar, Globe, Users, Briefcase } from "lucide-react";

interface Props {
  company: Company;
}

function Field({ label, value, icon: Icon }: { label: string; value: string | null; icon?: React.ElementType }) {
  if (!value) return null;
  return (
    <div className="py-2.5 border-b last:border-b-0">
      <div className="flex items-start gap-2">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />}
        <div>
          <dt className="text-xs text-muted-foreground">{label}</dt>
          <dd className="text-sm text-foreground mt-0.5">{value}</dd>
        </div>
      </div>
    </div>
  );
}

export function SectionOverview({ company }: Props) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-start gap-4">
        {company.logo_url ? (
          <img
            src={company.logo_url.split(";")[0].trim()}
            alt={`${company.name} logo`}
            className="h-16 w-16 rounded-xl object-contain bg-secondary p-2"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold text-foreground">{company.name}</h2>
          {company.short_name && <p className="text-sm text-muted-foreground">{company.short_name}</p>}
          {company.category && (
            <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {company.category}
            </span>
          )}
        </div>
      </div>
      {company.overview_text && (
        <p className="text-sm text-foreground leading-relaxed">{company.overview_text}</p>
      )}
      <div className="grid sm:grid-cols-2 gap-0">
        <Field label="Nature" value={company.nature_of_company} icon={Briefcase} />
        <Field label="Incorporation Year" value={company.incorporation_year} icon={Calendar} />
        <Field label="Headquarters" value={company.headquarters_address} icon={MapPin} />
        <Field label="Operating Countries" value={company.operating_countries} icon={Globe} />
        <Field label="Office Count" value={company.office_count} icon={Building2} />
        <Field label="Office Locations" value={company.office_locations} icon={MapPin} />
        <Field label="Employee Size" value={company.employee_size} icon={Users} />
        <Field label="History" value={company.history_timeline} icon={Calendar} />
        <Field label="Recent News" value={company.recent_news} />
      </div>
    </div>
  );
}
