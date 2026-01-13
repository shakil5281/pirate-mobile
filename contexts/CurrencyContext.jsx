"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

// Currency data with exchange rates (base: USD)
const currencies = [
  { code: 'USD', name: 'US Dollar', country: 'US', symbol: '$', rate: 1.0 },
  { code: 'EUR', name: 'Euro', country: 'EU', symbol: '€', rate: 0.85 },
  { code: 'AUD', name: 'Australian Dollar', country: 'AU', symbol: 'A$', rate: 1.35 },
  { code: 'NZD', name: 'New Zealand Dollar', country: 'NZ', symbol: 'NZ$', rate: 1.45 },
  { code: 'GBP', name: 'British Pound', country: 'GB', symbol: '£', rate: 0.75 },
  { code: 'CAD', name: 'Canadian Dollar', country: 'CA', symbol: 'C$', rate: 1.25 },
  { code: 'THB', name: 'Thai Baht', country: 'TH', symbol: '฿', rate: 35.0 }
]

const CurrencyContext = createContext()

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])
  const [exchangeRates, setExchangeRates] = useState({})

  // Load saved currency from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedCurrency = localStorage.getItem('selectedCurrency')
      if (savedCurrency) {
        const parsed = JSON.parse(savedCurrency)
        const found = currencies.find(c => c.code === parsed.code)
        if (found) {
          setSelectedCurrency(found)
        }
      }
    } catch (error) {
      console.error('Error parsing saved currency:', error)
    }
  }, [])

  // Save currency to localStorage when it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('selectedCurrency', JSON.stringify(selectedCurrency))
    } catch (error) {
      console.error('Error saving currency:', error)
    }
  }, [selectedCurrency])

  // Fetch real-time exchange rates (optional - you can implement this later)
  useEffect(() => {
    // For now, we'll use static rates
    // You can implement real-time rate fetching here
    const rates = {}
    currencies.forEach(currency => {
      rates[currency.code] = currency.rate
    })
    setExchangeRates(rates)
  }, [])

  const convertPrice = (price, fromCurrency = 'USD', toCurrency = selectedCurrency.code) => {
    if (!price || price === 0) return 0
    
    const fromRate = exchangeRates[fromCurrency] || 1
    const toRate = exchangeRates[toCurrency] || 1
    
    // Convert to USD first, then to target currency
    const usdPrice = price / fromRate
    const convertedPrice = usdPrice * toRate
    
    return convertedPrice
  }

  const formatPrice = (price, currency = selectedCurrency) => {
    if (!price || price === 0) return '0'
    
    const convertedPrice = convertPrice(price)
    
    // Format based on currency
    switch (currency.code) {
      case 'USD':
        return `$${convertedPrice.toFixed(2)}`
      case 'EUR':
        return `€${convertedPrice.toFixed(2)}`
      case 'GBP':
        return `£${convertedPrice.toFixed(2)}`
      case 'AUD':
        return `A$${convertedPrice.toFixed(2)}`
      case 'NZD':
        return `NZ$${convertedPrice.toFixed(2)}`
      case 'CAD':
        return `C$${convertedPrice.toFixed(2)}`
      case 'THB':
        return `฿${convertedPrice.toFixed(0)}`
      default:
        return `${currency.symbol}${convertedPrice.toFixed(2)}`
    }
  }

  const updateCurrency = (currency) => {
    setSelectedCurrency(currency)
  }

  const value = {
    selectedCurrency,
    currencies,
    exchangeRates,
    convertPrice,
    formatPrice,
    updateCurrency
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}
