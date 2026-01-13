'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { 
  generateICCID, 
  validateICCID, 
  formatICCID, 
  parseICCID,
  createESIMProfile,
  getICCIDStatus,
  isICCIDExpired
} from '@/lib/utils/iccidHelpers'
import { getToken } from '@/lib/utils/tokenStorage'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.piratemobile.gg'

// Keep first occurrence of an ICCID (so live API wins over extras)
const dedupeByICCID = (list) => {
  const seen = new Set()
  return list.filter((item) => {
    if (!item?.iccid) return true
    if (seen.has(item.iccid)) return false
    seen.add(item.iccid)
    return true
  })
}

// ICCID Context
const ICCIDContext = createContext()

// Helpers to normalize API responses
const getApiEsimList = (payload) => {
  if (!payload) return []
  if (Array.isArray(payload)) return payload

  const withBucket = (items, bucket) =>
    items.map((item) => ({
      ...item,
      __bucketStatus: item?.__bucketStatus || bucket
    }))

  const directArrays = ['eSIMs', 'esims', 'data', 'items']
  for (const key of directArrays) {
    if (Array.isArray(payload[key])) return payload[key]
  }

  if (Array.isArray(payload.all) && payload.all.length) {
    return withBucket(payload.all, 'all')
  }

  const bucketKeys = ['active', 'queued', 'pending', 'expired', 'inactive']
  const collected = []

  bucketKeys.forEach((key) => {
    if (Array.isArray(payload[key]) && payload[key].length) {
      collected.push(...withBucket(payload[key], key))
    }
  })

  if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    if (Array.isArray(payload.data.all) && payload.data.all.length) {
      collected.push(...withBucket(payload.data.all, 'all'))
    }

    bucketKeys.forEach((key) => {
      if (Array.isArray(payload.data[key]) && payload.data[key].length) {
        collected.push(...withBucket(payload.data[key], key))
      }
    })
  }

  if (collected.length) return collected

  const nestedArrays = Object.values(payload).filter(Array.isArray)
  if (nestedArrays.length) return nestedArrays.flat()

  return []
}

const mapApiStatus = (status) => {
  const normalized = (status || '').toString().toLowerCase()
  if (['active', 'activated', 'enable', 'enabled', 'complete', 'completed', 'ready'].some(value => normalized.includes(value))) {
    return 'activated'
  }
  if (['expired', 'deactivated', 'disable', 'disabled'].some(value => normalized.includes(value))) {
    return 'expired'
  }
  if (['pending', 'queue', 'queued', 'processing', 'created', 'new', 'await'].some(value => normalized.includes(value))) {
    return 'generated'
  }
  return 'generated'
}

const parseDateValue = (value) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

const parseDurationDays = (esim) => {
  const value =
    esim?.duration ??
    esim?.bundleDuration ??
    esim?.planDuration ??
    esim?.validity ??
    esim?.validityDays ??
    esim?.validity_days ??
    esim?.days ??
    esim?.validDays

  if (value === undefined || value === null) return null
  const numeric = typeof value === 'number' ? value : parseInt(value, 10)
  return Number.isNaN(numeric) ? null : numeric
}

const parseExpiresAt = (esim) => {
  const explicit = parseDateValue(
    esim?.expiresAt ||
    esim?.expires_at ||
    esim?.expiryDate ||
    esim?.expiry ||
    esim?.expirationDate ||
    esim?.validTill ||
    esim?.validTillDate ||
    esim?.valid_till ||
    esim?.endDate
  )

  if (explicit) return explicit

  const durationDays = parseDurationDays(esim)
  const created = parseDateValue(
    esim?.createdAt ||
    esim?.created_at ||
    esim?.createdOn ||
    esim?.activationDate ||
    esim?.activatedAt ||
    esim?.assignmentDateTime ||
    esim?.assignment_date_time ||
    esim?.assignmentDate ||
    esim?.assignedAt
  )

  const baseTime = created ? new Date(created).getTime() : Date.now()

  if (durationDays) {
    return new Date(baseTime + durationDays * 24 * 60 * 60 * 1000).toISOString()
  }

  // Default to a week from now so status calculation stays consistent
  return new Date(baseTime + 7 * 24 * 60 * 60 * 1000).toISOString()
}

const formatDataAmountFromValue = (value, { unitHint } = {}) => {
  if (value === undefined || value === null) return '0 GB'

  const formatUnitValue = (num, unit) => {
    const rounded = num % 1 === 0 ? num : Number(num.toFixed(1))
    return `${rounded} ${unit}`
  }

  if (typeof value === 'string') {
    const lowered = value.toLowerCase()
    const numeric = parseFloat(value)

    if (!Number.isNaN(numeric)) {
      if (lowered.includes('gb')) {
        return formatUnitValue(numeric, 'GB')
      }
      if (lowered.includes('mb')) {
        if (numeric >= 1000) {
          const gb = numeric / 1000
          return formatUnitValue(gb, 'GB')
        }
        return formatUnitValue(numeric, 'MB')
      }
    }
  }

  const numericValue = typeof value === 'number' ? value : parseFloat(value)
  if (Number.isNaN(numericValue)) return String(value)

  const treatAsBytes = unitHint === 'bytes' || numericValue >= 1e7

  if (treatAsBytes) {
    const gb = numericValue / 1e9
    if (gb >= 1) {
      return formatUnitValue(gb, 'GB')
    }
    const mb = numericValue / 1e6
    return formatUnitValue(mb, 'MB')
  }

  if (numericValue >= 1000) {
    const gb = numericValue / 1000
    return formatUnitValue(gb, 'GB')
  }

  if (numericValue >= 1) {
    return formatUnitValue(numericValue, 'MB')
  }

  return `${numericValue}`
}

const normalizeApiESIMs = (payload) => {
  const list = getApiEsimList(payload)
  const normalizedMap = new Map()

  const statusPriority = {
    activated: 3,
    generated: 2,
    expired: 2,
    unknown: 0
  }

  list.forEach((esim, index) => {
    const bucketStatus = esim?.__bucketStatus
    const status = mapApiStatus(
      esim?.status ||
      esim?.state ||
      esim?.simStatus ||
      esim?.bundleState ||
      bucketStatus
    )

    const duration = parseDurationDays(esim)
    let expiresAt = parseExpiresAt(esim)
    const createdAt =
      parseDateValue(
        esim?.createdAt ||
        esim?.created_at ||
        esim?.createdOn ||
        esim?.activationDate ||
        esim?.activatedAt ||
        esim?.assignmentDateTime ||
        esim?.assignment_date_time ||
        esim?.assignmentDate ||
        esim?.assignedAt
      ) ||
      new Date().toISOString()

    if (status === 'expired' && expiresAt && new Date(expiresAt) > new Date()) {
      expiresAt = new Date(Date.now() - 1000).toISOString()
    }

    let dataAmountUnitHint
    const totalDataValue = (() => {
      const sources = [
        { value: esim?.bundleData },
        { value: esim?.dataAmount },
        { value: esim?.data_amount },
        { value: esim?.data },
        { value: esim?.planData },
        { value: esim?.totalData },
        { value: esim?.dataLimit },
        { value: esim?.limit },
        { value: esim?.volume },
        { value: esim?.initialQuantity, unitHint: 'bytes' },
        { value: esim?.initial_quantity, unitHint: 'bytes' },
        { value: esim?.quantity, unitHint: 'bytes' }
      ]

      for (const source of sources) {
        if (source.value !== undefined && source.value !== null) {
          dataAmountUnitHint = source.unitHint
          return source.value
        }
      }

      return null
    })()

    let remainingUnitHint
    const remainingDataValue = (() => {
      const sources = [
        { value: esim?.remainingData },
        { value: esim?.remaining_data },
        { value: esim?.dataRemaining },
        { value: esim?.availableData },
        { value: esim?.dataLeft },
        { value: esim?.remainingQuantity, unitHint: 'bytes' },
        { value: esim?.remaining_quantity, unitHint: 'bytes' },
        { value: esim?.availableQuantity, unitHint: 'bytes' },
        { value: esim?.available_quantity, unitHint: 'bytes' },
        { value: esim?.balance, unitHint: 'bytes' }
      ]

      for (const source of sources) {
        if (source.value !== undefined && source.value !== null) {
          remainingUnitHint = source.unitHint
          return source.value
        }
      }

      return null
    })()

    const countryName =
      esim?.countryName ||
      esim?.country ||
      esim?.country_name ||
      esim?.countryLabel ||
      esim?.country_label ||
      esim?.countryTitle ||
      esim?.region ||
      'Unknown'

    const countryCode =
      esim?.countryCode ||
      esim?.country_code ||
      esim?.countryIso ||
      esim?.countryISO ||
      esim?.iso ||
      esim?.iso2 ||
      esim?.isoCode ||
      null

    const iccid =
      esim?.iccid ||
      esim?.iccId ||
      esim?.eSimId ||
      esim?.esimId ||
      esim?.simId ||
      esim?.sim_id ||
      esim?.id ||
      esim?._id ||
      `ESIM-${index + 1}`

    const normalized = {
      iccid,
      countryCode,
      countryName,
      planType: esim?.planType || esim?.plan || esim?.bundleName || esim?.bundle || esim?.name,
      dataAmount: formatDataAmountFromValue(totalDataValue, { unitHint: dataAmountUnitHint }),
      remainingData: formatDataAmountFromValue(
        remainingDataValue ?? totalDataValue,
        { unitHint: remainingUnitHint || dataAmountUnitHint }
      ),
      status,
      createdAt,
      expiresAt,
      duration,
      flag: esim?.flag || esim?.countryFlag,
      installUrl: esim?.appleInstallUrl || esim?.installUrl,
      qrCode: esim?.eSimQrCode || esim?.qrCode,
      order: esim?.order,
      raw: esim
    }

    const existing = normalizedMap.get(normalized.iccid)
    if (!existing) {
      normalizedMap.set(normalized.iccid, normalized)
      return
    }

    const existingPriority = statusPriority[existing.status] ?? 0
    const incomingPriority = statusPriority[normalized.status] ?? 0
    const shouldReplace =
      incomingPriority > existingPriority ||
      (!existing.remainingData && normalized.remainingData) ||
      ((!existing.countryCode || existing.countryCode === null) && normalized.countryCode) ||
      ((!existing.countryName || existing.countryName === 'Unknown') && normalized.countryName)

    if (shouldReplace) {
      normalizedMap.set(normalized.iccid, normalized)
    }
  })

  return Array.from(normalizedMap.values())
}

// ICCID Reducer
const iccidReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ESIM':
      return {
        ...state,
        eSIMs: [...state.eSIMs, action.payload],
        loading: false
      }
    
    case 'UPDATE_ESIM':
      return {
        ...state,
        eSIMs: state.eSIMs.map(esim => 
          esim.iccid === action.payload.iccid 
            ? { ...esim, ...action.payload }
            : esim
        )
      }
    
    case 'REMOVE_ESIM':
      return {
        ...state,
        eSIMs: state.eSIMs.filter(esim => esim.iccid !== action.payload.iccid)
      }
    
    case 'ACTIVATE_ESIM':
      return {
        ...state,
        eSIMs: state.eSIMs.map(esim => 
          esim.iccid === action.payload.iccid 
            ? { ...esim, status: 'activated', activatedAt: new Date().toISOString() }
            : esim
        )
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    
    case 'LOAD_ESIMS':
      return {
        ...state,
        eSIMs: action.payload,
        loading: false
      }

    case 'SET_ESIMS':
      return {
        ...state,
        eSIMs: Array.isArray(action.payload) ? action.payload : [],
        loading: false
      }
    
    default:
      return state
  }
}

// Initial state
const initialState = {
  eSIMs: [],
  loading: true,
  error: null
}

// ICCID Provider Component
export const ICCIDProvider = ({ children }) => {
  const [state, dispatch] = useReducer(iccidReducer, initialState)

  // Load eSIMs from backend API when authenticated
  useEffect(() => {
    const controller = new AbortController()
    const token = getToken()

    const restoreCachedESIMs = () => {
      if (typeof localStorage === 'undefined') return
      try {
        const cached = localStorage.getItem('pirate-mobile-esims')
        if (cached) {
          const parsed = JSON.parse(cached)
          if (Array.isArray(parsed) && parsed.length) {
            dispatch({ type: 'SET_ESIMS', payload: parsed })
          }
        }
      } catch (storageError) {
        console.warn('Unable to restore cached eSIMs', storageError)
      }
    }

    if (!token) {
      restoreCachedESIMs()
      dispatch({ type: 'SET_LOADING', payload: false })
      return () => controller.abort()
    }

    const fetchESIMs = async () => {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })

      try {
        const response = await fetch(`${API_BASE_URL}/e-sim`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          cache: 'no-store',
          signal: controller.signal
        })

        if (!response.ok) {
          const body = await response.json().catch(() => ({}))
          const message = body?.message || `Unable to fetch eSIMs (${response.status})`
          throw new Error(message)
        }

        const payload = await response.json()
        const normalized = dedupeByICCID(normalizeApiESIMs(payload))

        dispatch({ type: 'SET_ESIMS', payload: normalized })
        dispatch({ type: 'CLEAR_ERROR' })

        if (normalized.length > 0) {
          localStorage.setItem('pirate-mobile-esims', JSON.stringify(normalized))
        }
      } catch (error) {
        if (controller.signal.aborted) return
        console.error('Error fetching eSIMs:', error)
        restoreCachedESIMs()
        dispatch({ type: 'SET_ERROR', payload: error?.message || 'Unable to load your eSIMs right now.' })
      } finally {
        if (!controller.signal.aborted) {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      }
    }

    fetchESIMs()

    return () => controller.abort()
  }, [])

  // Actions
  const addESIM = async (eSIMData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Create eSIM profile with ICCID
      const eSIMProfile = createESIMProfile(eSIMData)
      
      dispatch({ type: 'ADD_ESIM', payload: eSIMProfile })
      return eSIMProfile
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const updateESIM = (iccid, updates) => {
    dispatch({ type: 'UPDATE_ESIM', payload: { iccid, ...updates } })
  }

  const removeESIM = (iccid) => {
    dispatch({ type: 'REMOVE_ESIM', payload: { iccid } })
  }

  const activateESIM = (iccid) => {
    dispatch({ type: 'ACTIVATE_ESIM', payload: { iccid } })
  }

  const getESIMByICCID = (iccid) => {
    return state.eSIMs.find(esim => esim.iccid === iccid)
  }

  const getESIMsByStatus = (status) => {
    return state.eSIMs.filter(esim => getICCIDStatus(esim) === status)
  }

  const getActiveESIMs = () => {
    return getESIMsByStatus('active')
  }

  const getQueuedESIMs = () => {
    return getESIMsByStatus('queued')
  }

  const getExpiredESIMs = () => {
    return getESIMsByStatus('expired')
  }

  const validateESIMICCID = (iccid) => {
    return validateICCID(iccid)
  }

  const formatESIMICCID = (iccid) => {
    return formatICCID(iccid)
  }

  const parseESIMICCID = (iccid) => {
    return parseICCID(iccid)
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const contextValue = {
    // State
    eSIMs: state.eSIMs,
    loading: state.loading,
    error: state.error,
    
    // Actions
    addESIM,
    updateESIM,
    removeESIM,
    activateESIM,
    getESIMByICCID,
    getESIMsByStatus,
    getActiveESIMs,
    getQueuedESIMs,
    getExpiredESIMs,
    validateESIMICCID,
    formatESIMICCID,
    parseESIMICCID,
    clearError,
    setESIMs: (esims) => dispatch({ type: 'SET_ESIMS', payload: esims }),
    
    // Utilities
    getICCIDStatus,
    isICCIDExpired
  }

  return (
    <ICCIDContext.Provider value={contextValue}>
      {children}
    </ICCIDContext.Provider>
  )
}

// Custom hook to use ICCID context
export const useICCID = () => {
  const context = useContext(ICCIDContext)
  if (!context) {
    throw new Error('useICCID must be used within an ICCIDProvider')
  }
  return context
}

// Higher-order component for ICCID functionality
export const withICCID = (WrappedComponent) => {
  return function ICCIDComponent(props) {
    return (
      <ICCIDProvider>
        <WrappedComponent {...props} />
      </ICCIDProvider>
    )
  }
}

export default ICCIDContext
