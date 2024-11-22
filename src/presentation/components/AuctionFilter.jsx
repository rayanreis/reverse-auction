import React, { useState } from 'react';
import FilterDropdownItems from './FilterDropdownItems';

const AuctionFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    status: 'all'
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="sticky top-4 w-full bg-red  rounded-xl shadow-sm border border-gray-200">
      <div className="p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Filters</h2>
        
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="category-select" className="text-sm font-medium text-gray-700">Category</label>
            <select 
              id="category-select"
              name="category" 
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full rounded-lg border-gray-200 py-2.5 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <FilterDropdownItems type="category" />
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Price Range</label>
            <select 
              name="priceRange" 
              value={filters.priceRange}
              onChange={handleFilterChange}
              className="w-full rounded-lg border-gray-200 py-2.5 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <FilterDropdownItems type="priceRange" />
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select 
              name="status" 
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full rounded-lg border-gray-200 py-2.5 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <FilterDropdownItems type="status" />
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionFilter; 