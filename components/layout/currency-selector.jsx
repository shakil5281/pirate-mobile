"use client"

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from "motion/react"
import ReactCountryFlag from "react-country-flag"
import { useCurrency } from '@/contexts/CurrencyContext'

export default function CurrencySelector({
  className = "",
  showOnMobile = false,
  whiteText = false
}) {
  const { selectedCurrency, currencies, updateCurrency } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleCurrencySelect = (currency) => {
    updateCurrency(currency)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Currency Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-full cursor-pointer border-gray-300  px-3 py-1.5 text-base  ${showOnMobile ? 'flex' : 'hidden md:flex'
          }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className='rounded-full overflow-hidden w-6 h-6 relative'>
          <ReactCountryFlag
            countryCode={selectedCurrency.country}
            svg
            className='absolute -top-4 -left-1 scale-150'
            style={{
              width: '60px',
              height: '60px',
            }}
          />
        </div>
        <span className={`font-medium ${whiteText ? 'text-white' : 'text-gray-900'}`}>{selectedCurrency.code}</span>
        <ChevronDown className={`size-5 ${whiteText ? 'text-white' : 'text-gray-600'} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg border border-gray-200 shadow-lg z-50"
            role="listbox"
          >
            <div className="p-1">
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencySelect(currency)}
                  className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-left transition-colors ${selectedCurrency.code === currency.code
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  role="option"
                  aria-selected={selectedCurrency.code === currency.code}
                >
                  <ReactCountryFlag
                    countryCode={currency.country}
                    svg
                    style={{
                      width: '24px',
                      height: '18px',
                      borderRadius: '4px'
                    }}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{currency.code}</div>
                  </div>
                  {selectedCurrency.code === currency.code && (
                    <Check className="w-4 h-4 text-yellow-600" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
