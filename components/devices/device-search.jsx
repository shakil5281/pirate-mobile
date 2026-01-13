import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DeviceSearch = ({ onSearch, loading = false }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Real-time search as user types
    onSearch(value);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2 sm:gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for device"
            value={searchQuery}
            onChange={handleInputChange}
            className="pl-10 h-12 text-sm sm:text-base"
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          className="bg-secondary hover:bg-yellow-500 text-gray-900 font-medium px-6 h-12 rounded-lg"
          disabled={loading}
        >
          <Search className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </div>
    </form>
  );
};

export { DeviceSearch };
