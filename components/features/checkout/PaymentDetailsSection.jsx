"use client"

import React from 'react'
import PayPalPayment from './payment/PayPalPayment'

const PaymentDetailsSection = ({
  onPaymentMethodSelect,
  onApproved,
  amount = 0,
  currency = 'USD',
  bundleId = null,
  bundleName = '',
  countryName = '',
  countryIso = '',
  dataAmount = 0,
  duration = 0,
  isUnlimited = false,
  disabled = false
}) => {

  return (
    <div className={`relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {disabled && (
        <div className="absolute inset-0 bg-gray-100/50 z-10 rounded-lg items-center justify-center hidden">
          <div className="bg-white px-6 py-3 rounded-lg shadow-lg border-2 border-yellow-400">
            <p className="text-sm font-medium text-gray-900">Please login to enable payment</p>
          </div>
        </div>
      )}

      {/* Payment Details Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Payment Details</h2>
      </div>

      {/* PayPal Integration with All Payment Methods */}
      <div className="payment-methods-container">
        <PayPalPayment
          bundleId={bundleId}
          bundleName={bundleName}
          amount={amount}
          currency={currency}
          onSuccess={onApproved}
          countryName={countryName}
          countryIso={countryIso}
          dataAmount={dataAmount}
          duration={duration}
          isUnlimited={isUnlimited}
        />
      </div>
    </div>
  )
}

export default PaymentDetailsSection
