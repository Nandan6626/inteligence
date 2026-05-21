import { useParams, Link } from "react-router-dom";
import { useCompany } from "@/hooks/useCompanies";
import { SectionOverview } from "@/components/company/SectionOverview";
import {
  SectionBusiness,
  SectionCulture,
  SectionLearning,
  SectionCompensation,
  SectionLogistics,
  SectionFinancials,
  SectionTechnology,
  SectionLeadership,
  SectionBrand,
} from "@/components/company/CompanySections";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Building2,
  Briefcase,
  Users,
  GraduationCap,
  DollarSign,
  MapPin,
  TrendingUp,
  Cpu,
  UserCheck,
  Globe,
} from "lucide-react";

const tabs = [
  { value: "overview", label: "Overview", icon: Building2 },
  { value: "business", label: "Business", icon: Briefcase },
  { value: "culture", label: "Culture", icon: Users },
  { value: "learning", label: "Learning", icon: GraduationCap },
  { value: "compensation", label: "Compensation", icon: DollarSign },
  { value: "logistics", label: "Logistics", icon: MapPin },
  { value: "financials", label: "Financials", icon: TrendingUp },
  { value: "technology", label: "Technology", icon: Cpu },
  { value: "leadership", label: "Leadership", icon: UserCheck },
  { value: "brand", label: "Brand", icon: Globe },
];

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const companyId = id ? parseInt(id, 10) : undefined;
  const { data: company, isLoading } = useCompany(companyId);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-secondary rounded w-48" />
          <div className="h-4 bg-secondary rounded w-96" />
          <div className="h-64 bg-secondary rounded-xl" />
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container py-16 text-center">
        <Building2 className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
        <h2 className="text-lg font-medium text-foreground mb-1">Company not found</h2>
        <p className="text-sm text-muted-foreground mb-4">
          This company may not exist in the database yet.
        </p>
        <Link to="/explore" className="text-sm text-primary hover:underline">
          ← Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-6 animate-fade-in">
      <Link
        to="/explore"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Explore
      </Link>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full flex-wrap h-auto gap-1 bg-secondary/50 p-1 rounded-xl">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-1.5 text-xs data-[state=active]:bg-background data-[state=active]:shadow-card rounded-lg px-3 py-1.5"
            >
              <tab.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="border rounded-xl bg-card p-5 sm:p-6 shadow-card">
          <TabsContent value="overview" className="mt-0">
            <SectionOverview company={company} />
          </TabsContent>
          <TabsContent value="business" className="mt-0">
            <SectionBusiness company={company} />
          </TabsContent>
          <TabsContent value="culture" className="mt-0">
            <SectionCulture company={company} />
          </TabsContent>
          <TabsContent value="learning" className="mt-0">
            <SectionLearning company={company} />
          </TabsContent>
          <TabsContent value="compensation" className="mt-0">
            <SectionCompensation company={company} />
          </TabsContent>
          <TabsContent value="logistics" className="mt-0">
            <SectionLogistics company={company} />
          </TabsContent>
          <TabsContent value="financials" className="mt-0">
            <SectionFinancials company={company} />
          </TabsContent>
          <TabsContent value="technology" className="mt-0">
            <SectionTechnology company={company} />
          </TabsContent>
          <TabsContent value="leadership" className="mt-0">
            <SectionLeadership company={company} />
          </TabsContent>
          <TabsContent value="brand" className="mt-0">
            <SectionBrand company={company} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CompanyDetail;
