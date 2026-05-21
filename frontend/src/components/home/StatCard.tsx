import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  color?: "blue" | "red" | "yellow" | "green";
}

const colorMap = {
  blue: "bg-primary/10 text-primary",
  red: "bg-destructive/10 text-destructive",
  yellow: "bg-warning/10 text-warning",
  green: "bg-success/10 text-success",
};

export function StatCard({ icon: Icon, label, value, subtitle, color = "blue" }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-card-foreground">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`rounded-lg p-2.5 ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
