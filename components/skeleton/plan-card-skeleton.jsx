import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PlanCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-sm mx-auto w-full">
      {/* Header Section Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>

      {/* Separator */}
      <div className="border-t border-gray-200 mb-4"></div>

      {/* Specifications Skeleton */}
      <div className="space-y-3 mb-6">
        {/* Type */}
        <div className="flex items-center gap-3">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-20 ml-auto" />
        </div>

        {/* Data */}
        <div className="flex items-center gap-3">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-12 ml-auto" />
        </div>

        {/* Validity */}
        <div className="flex items-center gap-3">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>
      </div>

      {/* Button Skeleton */}
      <Skeleton className="w-full h-12 rounded-lg" />
    </div>
  );
};

const PlanGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <PlanCardSkeleton key={index} />
      ))}
    </div>
  );
};

export { PlanCardSkeleton, PlanGridSkeleton };
