import React from 'react';
import { ChevronRight, MoveRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePriceFormatter } from '@/hooks/usePriceFormatter';

const EsimCard = ({
  country = "Belgium",
  flag,
  price = 3.59,
  duration = "/ for 7 days",
  buttonColor = 'bg-secondary',
  className,
  ...props
}) => {
  const { formatPrice } = usePriceFormatter();
  return (
    <Link href={`/esim/${country.toLowerCase().replace(/ /g, '-')}`}>
      <div
        className={cn(
          "group bg-white rounded-xl border border-gray-200 p-4 relative w-full cursor-pointer",
          "hover:shadow-lg transition-all duration-200 ease-out hover:border hover:border-[#757575]",
          "transform-gpu",
          className
        )}
        {...props}
      >
        {/* Mobile Layout - Horizontal (default) */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Flag Icon */}
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-sm relative">
            {flag}
          </div>

          {/* Country Info */}
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-500 font-medium mb-1">eSIM</div>
            <div className="text-md font-semibold text-gray-900 truncate">{country}</div>
          </div>

          {/* Price Info */}
          <div className="flex-shrink-0 text-right">
            <div className="text-xs text-gray-500 mb-1">Starting from</div>
            <div className="text-xs text-gray-500"><span className="text-md font-semibold text-gray-900">{formatPrice(price)} /</span> {duration}</div>
          </div>
        </div>

        {/* Desktop Layout - Vertical Card */}
        <div className="hidden md:flex flex-col h-full relative overflow-hidden">
          {/* Top Section - Country Info */}
          <div className="flex items-start gap-4 mb-4">
            {/* Flag Icon */}
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 shadow-md relative">
              {flag}
            </div>

            {/* Country Info */}
            <div className="flex-1">
              <div className="text-sm text-gray-500 font-medium">eSIM</div>
              <div className="text-lg font-semibold text-gray-900">{country}</div>
            </div>
          </div>

          {/* Horizontal Divider Line */}
          <div className="border-t border-gray-200 mb-4"></div>

          {/* Bottom Section - Price and Data */}
          <div className="mb-4 flex-1">
            <div className="text-sm text-gray-500 mb-2">Price start from</div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-xl font-semibold text-gray-900">{formatPrice(price)}</span>
              <span className="text-base text-gray-500">/ for {duration}</span>
            </div>
            <div className="text-green-600 text-sm font-semibold">
              Unlimited Data Available
            </div>
          </div>

          {/* Circular Action Button - Positioned absolutely at bottom right */}
          <div className="absolute bottom-10 right-4">
            <button className="w-10 h-10 rounded-full border border-gray-300 bg-white group-hover:bg-secondary group-hover:border-secondary transition-colors duration-200 flex items-center justify-center">
              <MoveRight className="w-4 h-4 text-gray-700  transition-colors duration-200" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Flag components for different countries
const BelgiumFlag = () => (
  <div className="w-full h-full flex">
    <div className="w-1/3 bg-black"></div>
    <div className="w-1/3 bg-secondary"></div>
    <div className="w-1/3 bg-red-500"></div>
  </div>
);

const EgyptFlag = () => (
  <div className="w-full h-full flex flex-col">
    <div className="h-1/3 bg-red-500"></div>
    <div className="h-1/3 bg-white flex items-center justify-center relative">
      <div className="w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
        <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
      </div>
    </div>
    <div className="h-1/3 bg-black"></div>
  </div>
);

// Single card example component
const EsimCardExample = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
      <EsimCard
        country="Belgium"
        flag={<BelgiumFlag />}
        price={3.59}
        duration="/ for 7 days"
        buttonColor="bg-secondary"
      />
    </div>
  );
};

// Additional flag components for more examples
const FranceFlag = () => (
  <div className="w-full h-full flex">
    <div className="w-1/3 bg-blue-600"></div>
    <div className="w-1/3 bg-white"></div>
    <div className="w-1/3 bg-red-500"></div>
  </div>
);

const GermanyFlag = () => (
  <div className="w-full h-full flex flex-col">
    <div className="h-1/3 bg-black"></div>
    <div className="h-1/3 bg-red-500"></div>
    <div className="h-1/3 bg-secondary"></div>
  </div>
);

const JapanFlag = () => (
  <div className="w-full h-full bg-white flex items-center justify-center">
    <div className="w-6 h-6 bg-red-500 rounded-full"></div>
  </div>
);

const SpainFlag = () => (
  <div className="w-full h-full flex flex-col">
    <div className="h-1/4 bg-red-500"></div>
    <div className="h-1/2 bg-secondary"></div>
    <div className="h-1/4 bg-red-500"></div>
  </div>
);

// Add display names for Fast Refresh
EsimCard.displayName = 'EsimCard';
EsimCardExample.displayName = 'EsimCardExample';
BelgiumFlag.displayName = 'BelgiumFlag';
EgyptFlag.displayName = 'EgyptFlag';
FranceFlag.displayName = 'FranceFlag';
GermanyFlag.displayName = 'GermanyFlag';
JapanFlag.displayName = 'JapanFlag';
SpainFlag.displayName = 'SpainFlag';

export { EsimCard, EsimCardExample, BelgiumFlag, EgyptFlag, FranceFlag, GermanyFlag, JapanFlag, SpainFlag };