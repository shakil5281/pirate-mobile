import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  const DeviceSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div>
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="w-5 h-5" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      {/* Hero Section Skeleton */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <Skeleton className="h-12 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-80 mx-auto mb-8" />
          
          {/* Search Bar Skeleton */}
          <div className="w-full max-w-2xl mx-auto">
            <div className="flex gap-2 sm:gap-3">
              <Skeleton className="flex-1 h-12 rounded-lg" />
              <Skeleton className="w-20 h-12 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Devices List Skeleton */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <DeviceSkeleton key={index} />
            ))}
          </div>
        </div>

        {/* Additional Information Skeleton */}
        <div className="mt-12 sm:mt-16 bg-white rounded-xl p-6 sm:p-8 shadow-sm max-w-4xl mx-auto">
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <div>
              <Skeleton className="h-6 w-24 mb-2" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}