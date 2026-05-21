import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Explore", path: "/explore" },
  { label: "Categories", path: "/categories" },
  { label: "Compare", path: "/compare" },
  { label: "Skill Mapping", path: "/skills" },
  { label: "Analytics", path: "/analytics" },
];

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<"checking" | "healthy" | "unhealthy">(
    "checking"
  );

  useEffect(() => {
    const controller = new AbortController();

    const checkBackend = async () => {
      try {
        const response = await fetch("/health/", { signal: controller.signal });
        if (!response.ok) {
          throw new Error("Backend health check failed");
        }

        setBackendStatus("healthy");
      } catch {
        if (!controller.signal.aborted) {
          setBackendStatus("unhealthy");
        }
      }
    };

    checkBackend();

    return () => controller.abort();
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-panel shadow-elevated">
      <div className="container flex h-16 items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-lg shrink-0 tracking-tight">
          <div className="flex items-center gap-0.5">
            <span className="text-google-blue">P</span>
            <span className="text-google-red">E</span>
            <span className="text-google-yellow">S</span>
          </div>
          <span className="hidden sm:inline text-foreground text-sm font-semibold">
            Placement Intelligence
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1 ml-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                location.pathname === item.path
                  ? "bg-white/70 text-primary font-semibold shadow-card"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div className="flex items-center gap-2 ml-auto">
          <div
            className={`hidden lg:flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
              backendStatus === "healthy"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                : backendStatus === "unhealthy"
                  ? "border-red-500/30 bg-red-500/10 text-red-700"
                  : "border-border/60 bg-white/60 text-muted-foreground"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                backendStatus === "healthy"
                  ? "bg-emerald-500"
                  : backendStatus === "unhealthy"
                    ? "bg-red-500"
                    : "bg-muted-foreground"
              }`}
            />
            <span>
              {backendStatus === "healthy"
                ? "Backend live"
                : backendStatus === "unhealthy"
                  ? "Backend offline"
                  : "Checking backend"}
            </span>
          </div>

          {searchOpen ? (
            <div className="flex items-center gap-2 animate-fade-in">
              <Input
                placeholder="Search companies..."
                className="w-48 sm:w-64 h-9 text-sm bg-white/70 border-border/60"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t bg-background animate-fade-in">
          <div className="container py-2 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
