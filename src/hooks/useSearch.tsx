
import { useState, useMemo } from 'react';

interface SearchFilters {
  searchQuery: string;
  selectedCategory: string;
  priceRange: number[];
  minRating: number;
  isVegetarian: boolean;
  isVegan: boolean;
}

interface SearchableItem {
  id: string;
  name: string;
  category?: string;
  price: number;
  rating: number;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  description?: string;
  canteen_name?: string;
}

export const useSearch = <T extends SearchableItem>(items: T[]) => {
  const [filters, setFilters] = useState<SearchFilters>({
    searchQuery: '',
    selectedCategory: 'all',
    priceRange: [0, 500],
    minRating: 0,
    isVegetarian: false,
    isVegan: false,
  });

  const availableCategories = useMemo(() => {
    const categories = items
      .map(item => item.category)
      .filter((category): category is string => Boolean(category))
      .filter((category, index, array) => array.indexOf(category) === index)
      .sort();
    return categories;
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDescription = item.description?.toLowerCase().includes(query);
        const matchesCanteen = item.canteen_name?.toLowerCase().includes(query);
        
        if (!matchesName && !matchesDescription && !matchesCanteen) {
          return false;
        }
      }

      // Category filter
      if (filters.selectedCategory !== 'all' && item.category !== filters.selectedCategory) {
        return false;
      }

      // Price range filter
      if (item.price < filters.priceRange[0] || item.price > filters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (item.rating < filters.minRating) {
        return false;
      }

      // Vegetarian filter
      if (filters.isVegetarian && !item.is_vegetarian) {
        return false;
      }

      // Vegan filter
      if (filters.isVegan && !item.is_vegan) {
        return false;
      }

      return true;
    });
  }, [items, filters]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.selectedCategory !== 'all') count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) count++;
    if (filters.minRating > 0) count++;
    if (filters.isVegetarian) count++;
    if (filters.isVegan) count++;
    return count;
  }, [filters]);

  const updateFilters = (updates: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      selectedCategory: 'all',
      priceRange: [0, 500],
      minRating: 0,
      isVegetarian: false,
      isVegan: false,
    });
  };

  return {
    filters,
    filteredItems,
    availableCategories,
    activeFiltersCount,
    updateFilters,
    clearFilters,
  };
};
