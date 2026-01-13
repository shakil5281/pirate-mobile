import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const HeroSkeleton = () => {
  return (
    <div className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Image Skeleton */}
      <Skeleton className="absolute inset-0 w-full h-full" />
    
      {/* Overlay Content Skeleton */}
      <div className="absolute inset-0 bg-black bg-opacity-30">
        <div className="container mx-auto px-4 h-full flex items-end pb-8">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            {/* Flag and Country Name */}
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            
            {/* Trust Score Section */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-8 w-24 rounded" />
            </div>
            
            {/* Buttons */}
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32 rounded" />
              <Skeleton className="h-10 w-40 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { HeroSkeleton };
