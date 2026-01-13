'use client'

import React from 'react';
import { ChevronRight, BarChart3, ArrowUpDown, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePriceFormatter } from '@/hooks/usePriceFormatter';

const DataPlanCard = ({
  dataAmount = "1 GB",
  duration = "7 Days",
  price = 4.49, // Changed to number for conversion
  oldPrice = null, // Changed to number for conversion
  type = "Data Only (4G/5G)",
  dataValue = "1 GB",
  validity = "7 days",
  mostPopular = false,
  pathName,
  className,
  onBuyClick,
  ...props
}) => {
  const { formatPrice, selectedCurrency } = usePriceFormatter();
  const pathname = usePathname();
  const isEuropePage = pathname === '/esim/europe';
  const isHajjPage = pathname === '/esim/hajj';
  const isSpecialPage = isEuropePage || isHajjPage;
  
  return (
    <Link className='cursor-pointer' href={`/checkout/${pathName}`}>
      <div
        className={cn(
          "rounded-2xl border p-6 w-full bg-white border-[#E4E4E4]",
          "hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
          "max-w-sm mx-auto relative",
          isSpecialPage ? [
            isEuropePage ? "hover:border-[#00309A]/30" : "hover:border-[#35B34B]",
            mostPopular ? (isEuropePage ? "border-[#00309A] border-2" : "border-[#35B34B] border-2") : ""
          ] : [
            "bg-white",
            mostPopular ? "border-yellow-400 border-2" : "border-gray-100",
            "hover:border-gray-300"
          ],
          className
        )}
        {...props}
      >
        {/* Most Popular Badge */}
        {mostPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <div className={cn(
              "text-xs font-bold px-4 py-1 rounded-full shadow-md",
              isSpecialPage 
                ? (isEuropePage ? "bg-[#00309A] text-white" : "bg-[#35B34B] text-white")
                : "bg-secondary text-gray-900",
              isHajjPage && "font-[family-name:var(--font-philosopher)]"
            )}>
              Most Popular
            </div>
          </div>
        )}
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-1">
            <span className={cn("text-lg font-bold text-[#040415]", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>{dataAmount}</span>
            <span className={cn("text-sm text-[#040415]/70", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>- {duration}</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div             className={cn(
              "rounded-full px-3 py-1",
              isSpecialPage 
                ? (isEuropePage ? "bg-[#00309A]/10" : "bg-[#35B34B]/10")
                : "bg-secondary",
              isHajjPage && "font-[family-name:var(--font-philosopher)]"
            )}>
              <span className={cn("text-sm font-bold text-[#040415]", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>{formatPrice(price)}</span>
            </div>
            
          </div>
        </div>

        {/* Separator */}
        <div className={cn(
          "border-t mb-4",
          isSpecialPage 
            ? (isEuropePage ? "border-[#00309A]/20" : "border-[#35B34B]/20")
            : "border-gray-200"
        )}></div>

        {/* Specifications */}
        <div className="space-y-3 mb-6">
          {/* Type */}
          <div className="flex items-center gap-3">
            <BarChart3 className="w-4 h-4 flex-shrink-0 text-[#040415]/60" />
            <span className={cn("text-sm text-[#040415]/70")}>Type</span>
            <span className={cn("text-sm font-medium ml-auto text-[#040415]")}>{type}</span>
          </div>

          {/* Data */}
          <div className="flex items-center gap-3">
            <ArrowUpDown className="w-4 h-4 flex-shrink-0 text-[#040415]/60" />
            <span className={cn("text-sm text-[#040415]/70")}>Data</span>
            <span className={cn("text-sm font-medium ml-auto text-[#040415]")}>{dataValue}</span>
          </div>

          {/* Validity */}
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 flex-shrink-0 text-[#040415]/60" />
            <span className={cn("text-sm text-[#040415]/70")}>Validity</span>
            <span className={cn("text-sm font-medium ml-auto text-[#040415]")}>{validity}</span>
          </div>
        </div>

        {/* Buy Button */}
        <button
          onClick={onBuyClick}
          className={cn(
            "w-full cursor-pointer bg-[#F4F4F4] py-3 px-4 rounded-full font-semibold",
            "flex items-center justify-center gap-2 transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            "text-sm border text-[#040415]",
            isSpecialPage ? [
              isEuropePage ? "hover:bg-[#00309A]/90 bg-gray-100" : "hover:bg-[#35B34B]/90",
              "",
              isEuropePage ? "hover:text-white" : "text-[#040415] hover:text-white",
              isEuropePage ? "focus:ring-[#00309A]/50" : "focus:ring-[#35B34B]/50"
            ] : [
              "bg-gray-100 hover:bg-gray-200 text-[#040415] hover:text-[#040415]",
              "border-gray-200",
              "focus:ring-gray-300"
            ]
          )}
        >
          <span>Buy eSim Now</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </Link>
  );
};

// Example usage component
const DataPlanCardExample = () => {
  const handleBuyClick = () => {
    // Handle buy button click
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <DataPlanCard
        dataAmount="1 GB"
        duration="7 Days"
        price={4.49}
        type="Data Only (4G/5G)"
        dataValue="1 GB"
        validity="7 days"
        onBuyClick={handleBuyClick}
      />
    </div>
  );
};

export { DataPlanCard, DataPlanCardExample };