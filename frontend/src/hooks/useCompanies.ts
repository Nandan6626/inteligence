import { useQuery } from "@tanstack/react-query";
import {
  fetchCompanies,
  fetchCompanyById,
  searchCompanies,
  fetchCompaniesByCategory,
  fetchCompaniesByIds,
  fetchCategoryStats,
  fetchCompanyCount,
  fetchHiringVelocityStats,
  fetchProfitabilityStats,
} from "@/services/companyService";

export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => fetchCompanies(),
  });
}

export function useCompany(id: number | undefined) {
  return useQuery({
    queryKey: ["company", id],
    queryFn: () => fetchCompanyById(id!),
    enabled: !!id,
  });
}

export function useSearchCompanies(query: string) {
  return useQuery({
    queryKey: ["companies", "search", query],
    queryFn: () => searchCompanies(query),
    enabled: query.length > 0,
  });
}

export function useCompaniesByCategory(category: string) {
  return useQuery({
    queryKey: ["companies", "category", category],
    queryFn: () => fetchCompaniesByCategory(category),
    enabled: !!category,
  });
}

export function useCompaniesByIds(ids: number[]) {
  return useQuery({
    queryKey: ["companies", "ids", ids],
    queryFn: () => fetchCompaniesByIds(ids),
    enabled: ids.length > 0,
  });
}

export function useCategoryStats() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategoryStats,
  });
}

export function useCompanyCount() {
  return useQuery({
    queryKey: ["company", "count"],
    queryFn: fetchCompanyCount,
  });
}

export function useHiringVelocityStats() {
  return useQuery({
    queryKey: ["stats", "hiring-velocity"],
    queryFn: fetchHiringVelocityStats,
  });
}

export function useProfitabilityStats() {
  return useQuery({
    queryKey: ["stats", "profitability"],
    queryFn: fetchProfitabilityStats,
  });
}
