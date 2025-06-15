
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, X, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: number[];
  onPriceRangeChange: (range: number[]) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
  isVegetarian: boolean;
  onVegetarianChange: (value: boolean) => void;
  isVegan: boolean;
  onVeganChange: (value: boolean) => void;
  availableCategories: string[];
  onClearFilters: () => void;
  activeFiltersCount: number;
}

const SearchFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  minRating,
  onRatingChange,
  isVegetarian,
  onVegetarianChange,
  isVegan,
  onVeganChange,
  availableCategories,
  onClearFilters,
  activeFiltersCount
}: SearchFiltersProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search for food items, canteens..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 w-full"
        />
      </div>

      {/* Filter Toggle and Active Filters */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <CollapsibleContent>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Category
                </label>
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={onPriceRangeChange}
                  max={500}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹0</span>
                  <span>₹500+</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Minimum Rating
                </label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[minRating]}
                    onValueChange={(value) => onRatingChange(value[0])}
                    max={5}
                    min={0}
                    step={0.5}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-1 min-w-[60px]">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{minRating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Dietary Preferences */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Dietary Preferences
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vegetarian"
                      checked={isVegetarian}
                      onCheckedChange={onVegetarianChange}
                    />
                    <label
                      htmlFor="vegetarian"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      🥬 Vegetarian
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vegan"
                      checked={isVegan}
                      onCheckedChange={onVeganChange}
                    />
                    <label
                      htmlFor="vegan"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      🌱 Vegan
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {selectedCategory}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onCategoryChange('all')}
              />
            </Badge>
          )}
          {(priceRange[0] > 0 || priceRange[1] < 500) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              ₹{priceRange[0]}-₹{priceRange[1]}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onPriceRangeChange([0, 500])}
              />
            </Badge>
          )}
          {minRating > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {minRating}+ ⭐
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onRatingChange(0)}
              />
            </Badge>
          )}
          {isVegetarian && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Vegetarian
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onVegetarianChange(false)}
              />
            </Badge>
          )}
          {isVegan && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Vegan
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onVeganChange(false)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
