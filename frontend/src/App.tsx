import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import ExploreCompanies from "./pages/ExploreCompanies";
import Categories from "./pages/Categories";
import CompanyDetail from "./pages/CompanyDetail";
import Compare from "./pages/Compare";
import SkillMapping from "./pages/SkillMapping";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/explore" element={<ExploreCompanies />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/company/:id" element={<CompanyDetail />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/skills" element={<SkillMapping />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
