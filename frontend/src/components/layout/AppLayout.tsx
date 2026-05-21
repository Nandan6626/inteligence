import { Navbar } from "./Navbar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-aurora"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-30"
        aria-hidden="true"
      />
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
