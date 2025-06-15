
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';
import { SortBy } from '@/hooks/useSort';

interface SortOptionsProps {
  sortBy: SortBy;
  onSortChange: (sortBy: SortBy) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

const SortOptions = ({ sortBy, onSortChange, sortOrder, onSortOrderChange }: SortOptionsProps) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
      <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortBy)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="price">Price</SelectItem>
          <SelectItem value="rating">Rating</SelectItem>
          <SelectItem value="popularity">Popularity</SelectItem>
        </SelectContent>
      </Select>
      <button
        onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
      >
        <ArrowUpDown className={`h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''} transition-transform`} />
      </button>
    </div>
  );
};

export default SortOptions;
