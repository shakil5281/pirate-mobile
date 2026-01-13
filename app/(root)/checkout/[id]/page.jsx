"use client"

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  CheckoutProgress, 
  AccountCreationSection, 
  PackageSummarySection,
  NewPaymentSection 
} from '@/components/features/checkout'
import { useAuth } from '@/contexts/AuthContext'

// Helper function to format data amount
function formatDataAmount(mb) {
  if (mb >= 1000) {
    const gb = mb / 1000;
    return gb % 1 === 0 ? `${gb} GB` : `${gb.toFixed(1)} GB`;
  }
  return `${mb} MB`;
}

export default function CheckoutPage() {
  const { id } = useParams()
  const router = useRouter()
  const [bundleData, setBundleData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()
  // Initialize step: if user is logged in, they're on step 2 (Confirm & Pay), otherwise step 1 (Choose Plan)
  const [checkoutStep, setCheckoutStep] = useState(user ? 2 : 1)

  // Update step when user authentication changes
  useEffect(() => {
    if (user) {
      setCheckoutStep(2) // User is logged in, move to payment step
    } else {
      setCheckoutStep(1) // User not logged in, start at account creation
    }
  }, [user])

  // Fetch bundle data from API
  useEffect(() => {
    async function fetchBundleData() {
      try {
        setLoading(true)
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.piratemobile.gg';
        const response = await fetch(`${apiBaseUrl}/e-sim/single-bundle/${id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch bundle data')
        }
        
        const data = await response.json()
        setBundleData(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching bundle data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBundleData()
    }
  }, [id])

  // Handler functions
  const handleProceed = async (accountData) => {
    try {
      // Store account data and proceed to payment step
      console.log('Account data:', accountData)
      
      // Proceed to payment step
      setCheckoutStep(2)
    } catch (error) {
      console.error('Error proceeding to payment:', error)
      setError('Failed to proceed to payment')
    }
  }

  const handlePaymentComplete = async (paymentData) => {
    try {
      console.log('Payment completed:', paymentData)
      // Move to step 3 (Activate & Use) before redirecting
      setCheckoutStep(3)
      // Complete purchase and redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error) {
      console.error('Error completing payment:', error)
      setError('Failed to complete payment')
    }
  }

  const handleCouponApply = (coupon) => {
    // Handle coupon application
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-yellow-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bundle details...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !bundleData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-yellow-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error || 'Bundle not found'}</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-secondary hover:bg-yellow-500 text-black font-medium rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Extract bundle data
  const dataAmount = formatDataAmount(bundleData.dataAmount || 1000)
  const duration = `${bundleData.duration || 7} days`
  const price = parseFloat(bundleData.salePrice || bundleData.price || 0).toFixed(2)
  
  // Extract country information from the countries array
  const countryInfo = bundleData.countries?.[0]?.country || {}
  const countryName = countryInfo.name || 'Unknown'
  const countryCode = countryInfo.iso?.toLowerCase() || 'xx'
  const countryRegion = countryInfo.region || ''
  
  // Get flag URL from flagcdn or use the imageUrl from bundle
  const countryFlag = `https://flagcdn.com/w20/${countryCode}.png`
  
  // Extract network information
  const networkData = bundleData.countries?.[0]?.networks || []
  const networks = networkData.map(net => net.name || net.brandName)
  
  const planType = bundleData.unlimited ? 'Unlimited' : 'Regular'
  const speeds = bundleData.speed?.speeds || []

  return (
    <div className="min-h-screen bg-linear-to-br from-yellow-50 to-yellow-100 py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <CheckoutProgress currentStep={checkoutStep} />

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Column - Account Creation & Payment */}
            <div className="p-6 lg:p-8">
              {/* Show Login/Signup when not authenticated */}
              {!user && (
                <AccountCreationSection onProceed={handleProceed} />
              )}
              
              {/* Payment Section - Always visible but disabled when not logged in */}
              <div className={!user ? 'mt-8' : ''}>
                <NewPaymentSection
                  onPaymentComplete={handlePaymentComplete}
                  amount={price}
                  currency="USD"
                  disabled={!user}
                />
              </div>
            </div>
                  
            {/* Right Column - eSIM Package Summary */}
            <PackageSummarySection
              countryName={countryName}
              countryFlag={countryFlag}
              dataAmount={dataAmount}
              planType={planType}
              speeds={speeds}
              duration={duration}
              networks={networks}
              price={price}
              onCouponApply={handleCouponApply}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
