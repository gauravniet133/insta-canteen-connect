
import { useState, useMemo } from 'react';

interface SortableItem {
  name: string;
  price: number;
  rating: number;
  total_reviews?: number;
}

export type SortBy = 'name' | 'price' | 'rating' | 'popularity';
export type SortOrder = 'asc' | 'desc';

export const useSort = <T extends SortableItem>(items: T[]) => {
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const sortedItems = useMemo(() => {
    const sorted = [...items].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'popularity':
          comparison = (a.total_reviews || 0) - (b.total_reviews || 0);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [items, sortBy, sortOrder]);

  return {
    sortedItems,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
  };
};
