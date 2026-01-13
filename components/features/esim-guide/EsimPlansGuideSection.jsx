"use client"

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePriceFormatter } from '@/hooks/usePriceFormatter'
import { BarChart3, ArrowUpDown, Calendar } from 'lucide-react'

function PlanCard({ plan, formatPrice }) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-white p-5 shadow-[0_16px_35px_-24px_rgba(0,0,0,0.35)] transition hover:shadow-[0_18px_45px_-20px_rgba(0,0,0,0.35)]",
        plan.mostPopular ? "border-[#FFDD4D] shadow-[0_18px_50px_-20px_rgba(255,221,77,0.55)]" : "border-[#E5E7EB]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-lg font-semibold text-slate-900 leading-tight">
            {plan.label} - {plan.validity}
          </p>
        </div>
        <div className="rounded-full border border-[#FFDD4D] bg-[#FFF8D6] px-3 py-1 text-sm font-bold text-slate-900">
          {formatPrice(plan.price)}
        </div>
      </div>

      <div className="mt-4 space-y-3 text-sm text-slate-800">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-4 h-4 text-slate-600" />
          <span className="text-slate-600">Type</span>
          <span className="ml-auto font-semibold text-slate-900">Data Only (4G/5G)</span>
        </div>
        <div className="flex items-center gap-3">
          <ArrowUpDown className="w-4 h-4 text-slate-600" />
          <span className="text-slate-600">Data</span>
          <span className="ml-auto font-semibold text-slate-900">{plan.label}</span>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-slate-600" />
          <span className="text-slate-600">Validity</span>
          <span className="ml-auto font-semibold text-slate-900">{plan.validity}</span>
        </div>
      </div>

      <Link href={`/checkout/${plan.pathName}`} className="mt-6 block">
        <Button
          variant="ghost"
          className="w-full rounded-full border border-[#D9D9D9] bg-[#F7F7F7] text-slate-900 hover:bg-[#F0F0F0] font-semibold"
        >
          Buy eSim Now
        </Button>
      </Link>
    </div>
  )
}

export default function EsimPlansGuideSection({
  countryName = "United States",
  flagUrl = "https://ik.imagekit.io/odc49ttmc/Pirate-mobile/home/Group%201171275346.png?updatedAt=1760260356476",
  description = "Choose your destination first, then a data plan according to your needs.",
  plans = { regular: [], unlimited: [] },
  className
}) {
  const { formatPrice } = usePriceFormatter()
  const defaultUnitedStatesPlans = useMemo(() => ({
    regular: [
      { id: '1', label: '1 GB', validity: '7 Days', price: 3.59, pathName: 'us-1gb-7days' },
      { id: '2', label: '2 GB', validity: '15 Days', price: 7.19, pathName: 'us-2gb-15days' },
      { id: '3', label: '3 GB', validity: '30 Days', price: 8.09, pathName: 'us-3gb-30days', mostPopular: true },
      { id: '4', label: '5 GB', validity: '30 Days', price: 11.69, pathName: 'us-5gb-30days' },
      { id: '5', label: '10 GB', validity: '30 Days', price: 17.09, pathName: 'us-10gb-30days' },
      { id: '6', label: '20 GB', validity: '30 Days', price: 28.79, pathName: 'us-20gb-30days' },
      { id: '7', label: '50 GB', validity: '30 Days', price: 59.39, pathName: 'us-50gb-30days' },
      { id: '8', label: '100 GB', validity: '30 Days', price: 111.59, pathName: 'us-100gb-30days' }
    ],
    unlimited: [
      { id: '9', label: '10 GB', validity: '30 Days', price: 17.09, pathName: 'us-10gb-30days-unlimited' },
      { id: '10', label: '20 GB', validity: '30 Days', price: 28.79, pathName: 'us-20gb-30days-unlimited' },
      { id: '11', label: '50 GB', validity: '30 Days', price: 59.39, pathName: 'us-50gb-30days-unlimited' },
      { id: '12', label: '100 GB', validity: '30 Days', price: 111.59, pathName: 'us-100gb-30days-unlimited' }
    ]
  }), [])

  const normalizedPlans = useMemo(() => {
    const isUnitedStates = countryName?.toLowerCase().includes('united states')
    if (!isUnitedStates) return defaultUnitedStatesPlans

    const regular = plans.regular?.length ? plans.regular : defaultUnitedStatesPlans.regular
    const unlimited = plans.unlimited?.length ? plans.unlimited : defaultUnitedStatesPlans.unlimited
    return { regular, unlimited }
  }, [countryName, defaultUnitedStatesPlans, plans.regular, plans.unlimited])

  const hasUnlimited = normalizedPlans.unlimited?.length > 0
  const [activeTab, setActiveTab] = useState('regular')

  useEffect(() => {
    if (!hasUnlimited && activeTab === 'unlimited') {
      setActiveTab('regular')
    }
  }, [activeTab, hasUnlimited])

  const displayedPlans = useMemo(() => {
    if (activeTab === 'unlimited' && hasUnlimited) return normalizedPlans.unlimited
    return normalizedPlans.regular || []
  }, [activeTab, hasUnlimited, normalizedPlans.regular, normalizedPlans.unlimited])

  return (
    <section className={cn("w-full bg-[#F8FAFC] py-14 md:py-20", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-2 mb-8 md:mb-12">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              {countryName} <span className="text-green-600">eSim Packages</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600">{description}</p>

          <div className="mt-4 flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white p-1">
            <button
              type="button"
              onClick={() => setActiveTab('regular')}
              className={cn(
                "px-5 py-2 rounded-full text-sm sm:text-base font-semibold transition",
                activeTab === 'regular' ? "bg-[#FFDD4D] text-slate-900 shadow-sm" : "text-slate-600"
              )}
            >
              Regular Plan
            </button>
            <button
              type="button"
              onClick={() => hasUnlimited && setActiveTab('unlimited')}
              className={cn(
                "px-5 py-2 rounded-full text-sm sm:text-base font-semibold transition",
                activeTab === 'unlimited' ? "bg-[#FFDD4D] text-slate-900 shadow-sm" : "text-slate-600",
                !hasUnlimited && "cursor-not-allowed opacity-50"
              )}
              disabled={!hasUnlimited}
            >
              Unlimited Plans
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {displayedPlans.map((plan, idx) => (
            <PlanCard key={`${activeTab}-${plan.pathName || idx}`} plan={plan} formatPrice={formatPrice} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/countries">
            <Button className="rounded-full bg-[#FFDD4D] px-6 sm:px-8 py-3 text-slate-900 font-semibold hover:bg-[#F2CF45]">
              See All Packages
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
