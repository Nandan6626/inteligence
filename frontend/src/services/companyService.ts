import { supabase } from '@/lib/supabase';
import { Company, CategoryStats } from '@/types/company';

/**
 * Fetch all companies from Supabase with optional filters and sorting
 */
export async function fetchCompanies(
  limit?: number,
  offset?: number,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc'
): Promise<Company[]> {
  try {
    let query = supabase.from('companies').select('*');

    if (sortBy) {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    } else {
      query = query.order('company_id', { ascending: true });
    }

    if (limit) {
      query = query.limit(limit);
    }

    if (offset) {
      query = query.range(offset, offset + (limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch companies:', error);
    throw error;
  }
}

/**
 * Fetch a company by its ID
 */
export async function fetchCompanyById(id: number): Promise<Company | null> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('company_id', id)
      .single();

    if (error) {
      console.error(`Error fetching company ${id}:`, error);
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error(`Failed to fetch company ${id}:`, error);
    throw error;
  }
}

/**
 * Fetch a company by its name
 */
export async function fetchCompanyByName(name: string): Promise<Company | null> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .ilike('name', `%${name}%`)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is acceptable
      console.error(`Error fetching company by name ${name}:`, error);
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error(`Failed to fetch company by name ${name}:`, error);
    throw error;
  }
}

/**
 * Search companies by query string (searches in name, short_name, overview_text)
 */
export async function searchCompanies(query: string): Promise<Company[]> {
  try {
    if (!query || query.trim() === '') {
      return [];
    }

    const searchTerm = `%${query}%`;

    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .or(
        `name.ilike.${searchTerm},short_name.ilike.${searchTerm},overview_text.ilike.${searchTerm}`
      );

    if (error) {
      console.error('Error searching companies:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to search companies:', error);
    throw error;
  }
}

/**
 * Fetch companies by category
 */
export async function fetchCompaniesByCategory(category: string): Promise<Company[]> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true });

    if (error) {
      console.error(`Error fetching companies in category ${category}:`, error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error(`Failed to fetch companies in category ${category}:`, error);
    throw error;
  }
}

/**
 * Fetch multiple companies by their IDs
 */
export async function fetchCompaniesByIds(ids: number[]): Promise<Company[]> {
  try {
    if (ids.length === 0) {
      return [];
    }

    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .in('company_id', ids);

    if (error) {
      console.error('Error fetching companies by ids:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch companies by ids:', error);
    throw error;
  }
}

/**
 * Get all distinct categories with company counts
 */
export async function fetchCategoryStats(): Promise<CategoryStats[]> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('category')
      .order('category', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    // Group by category and count
    const categoryMap = new Map<string | null, number>();

    (data || []).forEach((item) => {
      const category = item.category;
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    return Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
    }));
  } catch (error) {
    console.error('Failed to fetch category stats:', error);
    throw error;
  }
}

/**
 * Get total company count
 */
export async function fetchCompanyCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error fetching company count:', error);
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error('Failed to fetch company count:', error);
    throw error;
  }
}

/**
 * Get hiring velocity distribution for analytics
 */
export async function fetchHiringVelocityStats(): Promise<Map<string | null, number>> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('hiring_velocity');

    if (error) {
      console.error('Error fetching hiring velocity stats:', error);
      throw error;
    }

    const stats = new Map<string | null, number>();
    (data || []).forEach((item) => {
      const velocity = item.hiring_velocity;
      stats.set(velocity, (stats.get(velocity) || 0) + 1);
    });

    return stats;
  } catch (error) {
    console.error('Failed to fetch hiring velocity stats:', error);
    throw error;
  }
}

/**
 * Get profitability status distribution for analytics
 */
export async function fetchProfitabilityStats(): Promise<Map<string | null, number>> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('profitability_status');

    if (error) {
      console.error('Error fetching profitability stats:', error);
      throw error;
    }

    const stats = new Map<string | null, number>();
    (data || []).forEach((item) => {
      const status = item.profitability_status;
      stats.set(status, (stats.get(status) || 0) + 1);
    });

    return stats;
  } catch (error) {
    console.error('Failed to fetch profitability stats:', error);
    throw error;
  }
}
