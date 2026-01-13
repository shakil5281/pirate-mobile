"use client"

import { usePriceFormatter } from '@/hooks/usePriceFormatter'

/**
 * Component to display prices with automatic currency conversion
 * @param {Object} props
 * @param {number} props.price - The price to display
 * @param {string} props.fromCurrency - The currency of the input price (default: 'USD')
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showCurrencyCode - Whether to show currency code
 * @param {boolean} props.showOriginalPrice - Whether to show original price in USD
 */
export default function PriceDisplay({ 
  price, 
  fromCurrency = 'USD', 
  className = '', 
  showCurrencyCode = false,
  showOriginalPrice = false 
}) {
  const { formatPrice, getConvertedPrice, selectedCurrency } = usePriceFormatter()

  if (!price || price === 0) {
    return <span className={className}>Free</span>
  }

  const convertedPrice = getConvertedPrice(price, fromCurrency)
  const formattedPrice = formatPrice(price, fromCurrency)

  return (
    <div className={className}>
      <span className="font-semibold">
        {formattedPrice}
        {showCurrencyCode && (
          <span className="text-sm text-gray-500 ml-1">
            {selectedCurrency.code}
          </span>
        )}
      </span>
      {showOriginalPrice && fromCurrency !== selectedCurrency.code && (
        <div className="text-xs text-gray-400 line-through">
          ${price.toFixed(2)} USD
        </div>
      )}
    </div>
  )
}
