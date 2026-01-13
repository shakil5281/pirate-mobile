"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { XCircle, ArrowLeft, Home, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PaymentCancelPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home after 30 seconds of inactivity
    const timer = setTimeout(() => {
      router.push('/')
    }, 30000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cancel Animation */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6 animate-in zoom-in duration-500">
            <XCircle className="w-16 h-16 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-lg text-gray-600">
            Your payment was cancelled. No charges were made.
          </p>
        </div>

        {/* Information Card */}
        <Card className="mb-8 shadow-xl border-red-200 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
            <CardTitle>What happened?</CardTitle>
            <CardDescription>Your payment was not processed</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-gray-700">
                You cancelled the payment process. This can happen for several reasons:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>You clicked "Cancel" in the payment popup</li>
                <li>You closed the payment window</li>
                <li>The payment session timed out</li>
                <li>You decided not to complete the purchase</li>
              </ul>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Don't worry!</strong> No charges have been made to your account. 
                  Your selected eSIM package is still available for purchase.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Choose Us Card */}
        <Card className="mb-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <CardHeader>
            <CardTitle>Why Choose Pirate Mobile?</CardTitle>
            <CardDescription>Benefits of our eSIM service</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-black text-xs font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Instant Activation</h3>
                  <p className="text-sm text-gray-600">
                    Get your eSIM immediately after purchase - no waiting!
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-black text-xs font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Global Coverage</h3>
                  <p className="text-sm text-gray-600">
                    Stay connected in 180+ countries worldwide
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-black text-xs font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Secure Payment</h3>
                  <p className="text-sm text-gray-600">
                    PayPal, Google Pay, and card payments - all encrypted and secure
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
          <Button 
            onClick={() => router.back()}
            size="lg"
            className="bg-secondary hover:bg-yellow-500 text-black font-semibold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Try Again
          </Button>
          <Button 
            onClick={() => router.push('/countries')}
            variant="outline"
            size="lg"
            className="border-gray-300"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Browse Plans
          </Button>
          <Button 
            onClick={() => router.push('/')}
            variant="outline"
            size="lg"
            className="border-gray-300"
          >
            <Home className="w-5 h-5 mr-2" />
            Home
          </Button>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-center animate-in fade-in duration-700 delay-500">
          <p className="text-sm text-gray-600 mb-2">
            Need help? We're here for you!
          </p>
          <Button 
            variant="link" 
            onClick={() => router.push('/contact-us')}
            className="text-yellow-600 hover:text-yellow-700"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  )
}

