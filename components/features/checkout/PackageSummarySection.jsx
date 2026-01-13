"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Globe, Wifi, Calendar, Signal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePriceFormatter } from '@/hooks/usePriceFormatter'

const PackageSummarySection = ({ 
  countryName = 'Unknown',
  countryFlag = '',
  dataAmount = '1 GB',
  planType = 'Regular',
  speeds = [],
  duration = '7 days',
  networks = [],
  price = 0.00, // Changed to number for conversion
  onCouponApply
}) => {
  const { formatPrice } = usePriceFormatter()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(false)

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(true)
      if (onCouponApply) {
        onCouponApply(couponCode)
      }
    }
  }

  return (
    <div className="bg-gray-50 p-6 lg:p-8 flex items-start justify-center">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">eSim Package Summary</h2>
        
        <div className="space-y-4 mb-6">
          {/* Country */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">Country</span>
            </div>
            <div className="flex items-center space-x-2">
              {countryFlag && (
                <Image 
                  src={countryFlag} 
                  alt={`${countryName} flag`} 
                  width={20}
                  height={16}
                  className="w-5 h-4 rounded" 
                />
              )}
              <span className="text-sm font-medium text-gray-900">{countryName}</span>
            </div>
          </div>
          
          {/* Data */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Signal className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">Data</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {dataAmount} ({planType})
            </span>
          </div>
          
          {/* Type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-gray-600 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                </div>
              </div>
              <span className="text-sm text-gray-600">Type</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              Data Only ({speeds.length > 0 ? speeds.join('/') : '4G/5G'})
            </span>
          </div>
          
          {/* Validity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">Validity</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{duration}</span>
          </div>
          
          {/* Networks */}
          {networks.length > 0 && (
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Wifi className="h-5 w-5 text-gray-600 mt-0.5" />
                <span className="text-sm text-gray-600">Networks</span>
              </div>
              <div className="flex flex-col items-end space-y-1">
                {networks.map((network, index) => {
                  // Generate color based on index
                  const colors = [
                    'text-purple-600', 
                    'text-yellow-500', 
                    'text-orange-500', 
                    'text-blue-600', 
                    'text-green-600'
                  ]
                  const color = colors[index % colors.length]
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <span className={`text-lg ${color}`}>●</span>
                      <span className="text-sm font-medium text-gray-900">{network}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-base font-bold text-gray-900">{formatPrice(price)}</span>
          </div>
        </div>

        {/* Coupon Section */}
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg py-3 text-center">
            <span className="text-sm text-gray-600">Have Coupon Code?</span>
          </div>
          
          <div>
            <Label htmlFor="coupon" className="text-sm text-gray-600 mb-1.5 block">
              Coupon Code
            </Label>
            <Input
              id="coupon"
              placeholder="Enter Code. (e.g. MMK360)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full mb-3"
            />
            <Button 
              onClick={handleApplyCoupon}
              className="w-full bg-secondary hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg"
            >
              Apply Coupon
            </Button>
          </div>

          {appliedCoupon && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700">Coupon applied successfully!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PackageSummarySection

