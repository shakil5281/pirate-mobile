"use client"

import React, { useState } from 'react'
import { Lock, Check } from 'lucide-react'

const NewPaymentSection = ({ 
  onPaymentComplete,
  amount = 0, 
  currency = 'USD',
  disabled = false 
}) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCardInputChange = (e) => {
    const { name, value } = e.target
    let formattedValue = value

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
      if (formattedValue.length > 19) return
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1 / $2')
      if (formattedValue.length > 7) return
    }

    // Format CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '')
      if (formattedValue.length > 3) return
    }

    setCardDetails(prev => ({
      ...prev,
      [name]: formattedValue
    }))
  }

  const handleGooglePay = async () => {
    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Google Pay payment initiated')
      if (onPaymentComplete) {
        onPaymentComplete({ method: 'google_pay', success: true })
      }
    } catch (error) {
      console.error('Google Pay error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleApplePay = async () => {
    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Apple Pay payment initiated')
      if (onPaymentComplete) {
        onPaymentComplete({ method: 'apple_pay', success: true })
      }
    } catch (error) {
      console.error('Apple Pay error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCardPayment = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    try {
      // Validate card details
      if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv) {
        alert('Please fill in all card details')
        setIsProcessing(false)
        return
      }

      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Card payment processed:', cardDetails)
      if (onPaymentComplete) {
        onPaymentComplete({ method: 'card', success: true, cardDetails })
      }
    } catch (error) {
      console.error('Card payment error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className={`relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {disabled && (
        <div className="absolute inset-0 bg-gray-100/50 z-10 rounded-lg flex items-center justify-center">
          <div className="bg-white px-6 py-3 rounded-lg shadow-lg border-2 border-yellow-400">
            <p className="text-sm font-medium text-gray-900">Please login to enable payment</p>
          </div>
        </div>
      )}
      
      {/* Payment Details Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Payment Details</h2>
        <p className="text-gray-600">Choose your preferred payment method</p>
      </div>

      {/* Google Pay and Apple Pay - 2 Column Layout */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Google Pay Button */}
        <button
          onClick={handleGooglePay}
          disabled={isProcessing}
          className={`flex items-center justify-center py-3 px-4 rounded-lg border-2 transition-all duration-200 bg-white hover:border-yellow-300 hover:shadow-sm ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer border-gray-200'
          }`}
        >
          <svg viewBox="0 0 48 48" className="w-16 h-6">
            <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
        </button>

        {/* Apple Pay Button */}
        <button
          onClick={handleApplePay}
          disabled={isProcessing}
          className={`flex items-center justify-center py-3 px-4 rounded-lg border-2 transition-all duration-200 bg-black hover:bg-gray-900 ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer border-black'
          }`}
        >
          <svg viewBox="0 0 24 24" className="w-12 h-6 fill-white">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
        </button>
      </div>

      {/* Card Payment Form - Always Visible */}
      <form onSubmit={handleCardPayment} className="space-y-4">
        {/* First Row: Card Number, Expiry Date, CVV */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-4">
          {/* Card Number */}
          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-gray-600 z-10">
              Card number
            </label>
            <div className="relative">
              <input
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleCardInputChange}
                placeholder="1234 5678 9101 3456"
                className={`w-full px-4 py-3 pr-12 border-2 rounded-xl outline-none transition-all ${
                  cardDetails.cardNumber.replace(/\s/g, '').length === 16
                    ? 'border-green-500 focus:border-green-500'
                    : 'border-gray-300 focus:border-yellow-400'
                }`}
                required
              />
              {cardDetails.cardNumber.replace(/\s/g, '').length === 16 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Expiry Date */}
          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-gray-600 z-10">
              Expiry date
            </label>
            <input
              type="text"
              name="expiryDate"
              value={cardDetails.expiryDate}
              onChange={handleCardInputChange}
              placeholder="MM / YY"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-400 outline-none transition-all"
              required
            />
          </div>

          {/* CVV */}
          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-gray-600 z-10">
              CVV
            </label>
            <input
              type="text"
              name="cvv"
              value={cardDetails.cvv}
              onChange={handleCardInputChange}
              placeholder="•••"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-400 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Second Row: Cardholder Name */}
        <div className="relative">
          <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-gray-600 z-10">
            Cardholder name
          </label>
          <input
            type="text"
            name="cardName"
            value={cardDetails.cardName}
            onChange={handleCardInputChange}
            placeholder="Mark Parker"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-400 outline-none transition-all"
            required
          />
        </div>

        {/* Pay Securely Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            isProcessing
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-yellow-400 hover:bg-yellow-500 text-black shadow-lg hover:shadow-xl'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              Pay Securely
            </>
          )}
        </button>
      </form>

      {/* Security Badge */}
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>Secured by 256-bit SSL encryption</span>
      </div>
    </div>
  )
}

export default NewPaymentSection
