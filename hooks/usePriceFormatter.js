import { useCurrency } from '@/contexts/CurrencyContext'

/**
 * Custom hook for formatting prices with currency conversion
 * @returns {Object} Object containing formatPrice function and currency info
 */
export const usePriceFormatter = () => {
  const { formatPrice, convertPrice, selectedCurrency } = useCurrency()

  /**
   * Format a price with the selected currency
   * @param {number} price - The price to format
   * @param {string} fromCurrency - The currency of the input price (default: 'USD')
   * @returns {string} Formatted price string
   */
  const formatPriceWithCurrency = (price, fromCurrency = 'USD') => {
    return formatPrice(price, selectedCurrency)
  }

  /**
   * Convert price from one currency to another
   * @param {number} price - The price to convert
   * @param {string} fromCurrency - Source currency (default: 'USD')
   * @param {string} toCurrency - Target currency (default: selected currency)
   * @returns {number} Converted price
   */
  const convertPriceToCurrency = (price, fromCurrency = 'USD', toCurrency = selectedCurrency.code) => {
    return convertPrice(price, fromCurrency, toCurrency)
  }

  /**
   * Get the raw converted price without formatting
   * @param {number} price - The price to convert
   * @param {string} fromCurrency - Source currency (default: 'USD')
   * @returns {number} Raw converted price
   */
  const getConvertedPrice = (price, fromCurrency = 'USD') => {
    return convertPrice(price, fromCurrency, selectedCurrency.code)
  }

  return {
    formatPrice: formatPriceWithCurrency,
    convertPrice: convertPriceToCurrency,
    getConvertedPrice,
    selectedCurrency,
    currencySymbol: selectedCurrency.symbol,
    currencyCode: selectedCurrency.code
  }
}
