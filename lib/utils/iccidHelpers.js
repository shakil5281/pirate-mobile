/**
 * ICCID (Integrated Circuit Card Identifier) management utilities
 * ICCID format: 19-20 digits, used to identify eSIM cards
 */

// ICCID validation and generation utilities
export const ICCID_PREFIXES = {
  // Major eSIM providers prefixes
  DIGICEL: '8943108',
  AIRTEL: '8943201',
  VODAFONE: '8943107',
  T_MOBILE: '8943106',
  VERIZON: '8943105',
  AT_T: '8943104',
  PIRATE_MOBILE: '8943108', // Using Digicel prefix for now
}

// Country-specific ICCID prefixes
export const COUNTRY_ICCID_PREFIXES = {
  US: '8943104', // AT&T
  UK: '8943107', // Vodafone
  DE: '8943201', // Airtel
  FR: '8943107', // Vodafone
  JP: '8943106', // T-Mobile
  AU: '8943201', // Airtel
  BD: '8943108', // Digicel
  BE: '8943107', // Vodafone
  DEFAULT: '8943108', // Default to Digicel
}

/**
 * Generate a valid ICCID for a specific country
 * @param {string} countryCode - ISO country code (e.g., 'US', 'UK')
 * @param {string} planType - Plan type identifier
 * @returns {string} Valid ICCID
 */
export function generateICCID(countryCode = 'DEFAULT', planType = '001') {
  const prefix = COUNTRY_ICCID_PREFIXES[countryCode.toUpperCase()] || COUNTRY_ICCID_PREFIXES.DEFAULT
  
  // Generate random digits for the middle part (keeping it unique)
  const randomPart = Math.floor(Math.random() * 10000000).toString().padStart(7, '0')
  
  // Plan type identifier (3 digits)
  const planId = planType.padStart(3, '0')
  
  // Combine: prefix + random + plan
  const iccidWithoutChecksum = prefix + randomPart + planId
  
  // Calculate Luhn checksum for the last digit
  const checksum = calculateLuhnChecksum(iccidWithoutChecksum)
  
  return iccidWithoutChecksum + checksum
}

/**
 * Validate ICCID format and checksum
 * @param {string} iccid - ICCID to validate
 * @returns {boolean} True if valid
 */
export function validateICCID(iccid) {
  if (!iccid || typeof iccid !== 'string') {
    return false
  }
  
  // Remove any non-digit characters
  const cleanICCID = iccid.replace(/\D/g, '')
  
  // Check length (19-20 digits)
  if (cleanICCID.length < 19 || cleanICCID.length > 20) {
    return false
  }
  
  // Validate Luhn algorithm
  return validateLuhnChecksum(cleanICCID)
}

/**
 * Calculate Luhn checksum digit
 * @param {string} number - Number without checksum
 * @returns {string} Checksum digit
 */
function calculateLuhnChecksum(number) {
  const digits = number.split('').map(Number)
  let sum = 0
  let isEven = false
  
  // Process digits from right to left
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i]
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return ((10 - (sum % 10)) % 10).toString()
}

/**
 * Validate Luhn checksum
 * @param {string} number - Number with checksum
 * @returns {boolean} True if checksum is valid
 */
function validateLuhnChecksum(number) {
  const digits = number.split('').map(Number)
  let sum = 0
  let isEven = false
  
  // Process digits from right to left
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i]
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

/**
 * Format ICCID for display (with spaces for readability)
 * @param {string} iccid - Raw ICCID
 * @returns {string} Formatted ICCID
 */
export function formatICCID(iccid) {
  if (!iccid) return ''
  
  const cleanICCID = iccid.replace(/\D/g, '')
  
  // Format as: 8943 1081 6502 2541 2345
  return cleanICCID.replace(/(\d{4})(\d{4})(\d{4})(\d{4})(\d{0,4})/, '$1 $2 $3 $4 $5').trim()
}

/**
 * Extract information from ICCID
 * @param {string} iccid - ICCID to analyze
 * @returns {object} ICCID information
 */
export function parseICCID(iccid) {
  if (!validateICCID(iccid)) {
    return { valid: false, error: 'Invalid ICCID format' }
  }
  
  const cleanICCID = iccid.replace(/\D/g, '')
  
  // Extract components
  const prefix = cleanICCID.substring(0, 7)
  const countryCode = getCountryFromPrefix(prefix)
  const planId = cleanICCID.substring(14, 17)
  
  return {
    valid: true,
    prefix,
    countryCode,
    planId,
    provider: getProviderFromPrefix(prefix),
    formatted: formatICCID(iccid),
    raw: cleanICCID
  }
}

/**
 * Get country code from ICCID prefix
 * @param {string} prefix - ICCID prefix
 * @returns {string} Country code
 */
function getCountryFromPrefix(prefix) {
  const prefixMap = {
    '8943104': 'US',
    '8943107': 'UK',
    '8943201': 'DE',
    '8943106': 'JP',
    '8943108': 'BD',
  }
  
  return prefixMap[prefix] || 'DEFAULT'
}

/**
 * Get provider name from ICCID prefix
 * @param {string} prefix - ICCID prefix
 * @returns {string} Provider name
 */
function getProviderFromPrefix(prefix) {
  const providerMap = {
    '8943104': 'AT&T',
    '8943107': 'Vodafone',
    '8943201': 'Airtel',
    '8943106': 'T-Mobile',
    '8943108': 'Digicel',
  }
  
  return providerMap[prefix] || 'Pirate Mobile'
}

/**
 * Generate QR code data for eSIM activation
 * @param {string} iccid - ICCID
 * @param {string} activationCode - Activation code
 * @returns {string} QR code data
 */
export function generateESIMQRData(iccid, activationCode) {
  return `LPA:1$rsp-prod.ondemandconnectivity.com$1.3.6.1.4.1.31746.1.500.100.2.1.1${iccid}${activationCode}`
}

/**
 * Create eSIM profile data
 * @param {object} eSIMData - eSIM configuration
 * @returns {object} Complete eSIM profile
 */
export function createESIMProfile(eSIMData) {
  const {
    countryCode,
    planType,
    dataAmount,
    duration,
    price,
    countryName
  } = eSIMData
  
  const iccid = generateICCID(countryCode, planType)
  const activationCode = generateActivationCode()
  const qrData = generateESIMQRData(iccid, activationCode)
  
  return {
    iccid,
    activationCode,
    qrData,
    countryCode,
    countryName,
    planType,
    dataAmount,
    duration,
    price,
    status: 'generated',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + (parseInt(duration) * 24 * 60 * 60 * 1000)).toISOString()
  }
}

/**
 * Generate activation code
 * @returns {string} Activation code
 */
function generateActivationCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Check if ICCID is expired
 * @param {string} expiresAt - Expiration date
 * @returns {boolean} True if expired
 */
export function isICCIDExpired(expiresAt) {
  return new Date(expiresAt) < new Date()
}

/**
 * Get ICCID status
 * @param {object} eSIMProfile - eSIM profile
 * @returns {string} Status
 */
export function getICCIDStatus(eSIMProfile) {
  if (isICCIDExpired(eSIMProfile.expiresAt)) {
    return 'expired'
  }
  
  if (eSIMProfile.status === 'generated') {
    return 'queued'
  }
  
  if (eSIMProfile.status === 'activated') {
    return 'active'
  }
  
  return 'unknown'
}
