'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const CompatibleDevicesHeader = ({ searchQuery, onSearchChange, brandCount }) => {
  const handleInputChange = (event) => {
    onSearchChange(event.target.value);
  };

  return (
    <div className="bg-linear-to-b from-[#FFF6BA] to-white">
      <div className="max-w-7xl mx-auto pt-32 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Devices that <span className="text-green-600">Support eSIMs</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Only devices that are carrier-unlocked and support eSIM technology can use piratemobile.
          </p>

          <div className="flex justify-center max-w-3xl mx-auto px-4">
            <div className="flex items-center p-1 w-full rounded-full overflow-hidden shadow-xl bg-white border border-neutral-200">
              <Input
                type="text"
                placeholder="Search for device"
                value={searchQuery}
                onChange={handleInputChange}
                className="grow px-4 py-6 text-sm sm:text-base outline-none bg-white border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <button
                type="button"
                className="bg-secondary hover:bg-secondary-foreground p-3 px-4 text-neutral-900 font-semibold text-sm sm:text-base transition-colors duration-200 flex items-center gap-2 whitespace-nowrap rounded-full"
              >
                <Search size={25} />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>

          {searchQuery && (
            <div className="mt-6 text-center">
              <p className="text-sm sm:text-base text-gray-600">
                Found <span className="font-semibold text-neutral-900">{brandCount}</span> brand
                {brandCount !== 1 ? 's' : ''} matching your search
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompatibleDevicesHeader;
