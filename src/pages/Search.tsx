
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSearch } from '@/hooks/useSearch';
import { useSort } from '@/hooks/useSort';
import SearchFilters from '@/components/SearchFilters';
import SortOptions from '@/components/SortOptions';
import FoodItemCard from '@/components/FoodItemCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Card, CardContent } from '@/components/ui/card';
import { Search as SearchIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  preparation_time: number;
  category: string;
  image_url: string;
  rating: number;
  total_reviews: number;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_available: boolean;
  canteen_id: string;
  canteens: {
    name: string;
  };
}

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const {
    filters,
    filteredItems,
    availableCategories,
    activeFiltersCount,
    updateFilters,
    clearFilters,
  } = useSearch(foodItems.map(item => ({
    ...item,
    canteen_name: item.canteens.name
  })));

  const {
    sortedItems,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
  } = useSort(filteredItems);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('food_items')
          .select(`
            *,
            canteens (name)
          `)
          .eq('is_available', true);

        if (error) throw error;
        setFoodItems(data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        toast({
          title: "Error",
          description: "Failed to load food items",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, [toast]);

  // Initialize search query from URL params
  useEffect(() => {
    const query = searchParams.get('q') || '';
    if (query !== filters.searchQuery) {
      updateFilters({ searchQuery: query });
    }
  }, [searchParams, filters.searchQuery, updateFilters]);

  // Update URL when search query changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.searchQuery.trim()) {
      params.set('q', filters.searchQuery.trim());
    }
    setSearchParams(params);
  }, [filters.searchQuery, setSearchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Food Items</h1>
          <p className="text-gray-600">Discover delicious food from all canteens</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <SearchFilters
                searchQuery={filters.searchQuery}
                onSearchChange={(query) => updateFilters({ searchQuery: query })}
                selectedCategory={filters.selectedCategory}
                onCategoryChange={(category) => updateFilters({ selectedCategory: category })}
                priceRange={filters.priceRange}
                onPriceRangeChange={(range) => updateFilters({ priceRange: range })}
                minRating={filters.minRating}
                onRatingChange={(rating) => updateFilters({ minRating: rating })}
                isVegetarian={filters.isVegetarian}
                onVegetarianChange={(value) => updateFilters({ isVegetarian: value })}
                isVegan={filters.isVegan}
                onVeganChange={(value) => updateFilters({ isVegan: value })}
                availableCategories={availableCategories}
                onClearFilters={clearFilters}
                activeFiltersCount={activeFiltersCount}
              />
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {sortedItems.length} results found
                </p>
                {filters.searchQuery && (
                  <p className="text-sm text-gray-600">
                    for "{filters.searchQuery}"
                  </p>
                )}
              </div>
              
              <SortOptions
                sortBy={sortBy}
                onSortChange={setSortBy}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
              />
            </div>

            {/* Results Grid */}
            {sortedItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedItems.map((item) => (
                  <FoodItemCard
                    key={item.id}
                    item={{
                      id: item.id,
                      name: item.name,
                      description: item.description,
                      price: item.price,
                      preparation_time: item.preparation_time,
                      is_available: item.is_available,
                      category: item.category,
                      canteen_id: item.canteen_id,
                      canteen_name: item.canteens.name,
                      rating: item.rating,
                      total_reviews: item.total_reviews,
                      image_url: item.image_url,
                    }}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
