import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  count: number;
  description: string;
  color: "blue" | "red" | "yellow" | "green";
  to: string;
}

const bgMap = {
  blue: "bg-primary/5 hover:bg-primary/10 border-primary/20",
  red: "bg-destructive/5 hover:bg-destructive/10 border-destructive/20",
  yellow: "bg-warning/5 hover:bg-warning/10 border-warning/20",
  green: "bg-success/5 hover:bg-success/10 border-success/20",
};

const iconMap = {
  blue: "text-primary",
  red: "text-destructive",
  yellow: "text-warning",
  green: "text-success",
};

export function CategoryCard({ icon: Icon, title, count, description, color, to }: CategoryCardProps) {
  return (
    <Link
      to={to}
      className={`group flex items-center gap-4 rounded-xl border p-4 transition-all ${bgMap[color]}`}
    >
      <div className={`shrink-0 ${iconMap[color]}`}>
        <Icon className="h-8 w-8" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-card-foreground">{title}</h3>
          <span className="text-xs text-muted-foreground bg-secondary rounded-full px-2 py-0.5">
            {count}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
    </Link>
  );
}
