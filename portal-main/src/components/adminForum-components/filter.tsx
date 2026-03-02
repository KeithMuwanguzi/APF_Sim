import { Search } from 'lucide-react';
import { Category, PostStatus } from './types';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: PostStatus | 'all';
  onStatusChange: (status: PostStatus | 'all') => void;
  selectedCategory: string | 'all';
  onCategoryChange: (category: string | 'all') => void;
  categories: Category[];
  categoriesLoading?: boolean;
}

const FilterBar = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  categories,
  categoriesLoading = false,
}: FilterBarProps) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center mb-6 shadow-sm">
      <div className="flex-1 w-full relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search posts by title, content, or author..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
      </div>

      <div className="flex items-center gap-6 w-full md:w-auto">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-500">Status:</span>
          <select 
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as PostStatus | 'all')}
            className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer hover:text-indigo-600 transition-colors"
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="reported">Reported</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-500">Category:</span>
          <select 
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={categoriesLoading}
            className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="all">All</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;