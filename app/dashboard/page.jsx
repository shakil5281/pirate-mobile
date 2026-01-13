"use client"
import EsimGauge from "@/components/dashboard/EsimGauge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useICCID } from "@/contexts/ICCIDContext"
import { formatICCID, getICCIDStatus } from "@/lib/utils/iccidHelpers"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle, Clock, AlertCircle, ArrowUpDown, Timer, Download } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"

export default function Page() {
  const {
    getActiveESIMs,
    getQueuedESIMs,
    getExpiredESIMs,
    activateESIM,
    loading,
    error
  } = useICCID()

  const [copiedICCID, setCopiedICCID] = useState(null)
  const [selectedESIM, setSelectedESIM] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [topUpOpen, setTopUpOpen] = useState(false)
  const [topUpESIM, setTopUpESIM] = useState(null)

  const activeESIMs = getActiveESIMs()
  const queuedESIMs = getQueuedESIMs()
  const expiredESIMs = getExpiredESIMs()

  const copyICCID = async (iccid) => {
    try {
      await navigator.clipboard.writeText(iccid)
      setCopiedICCID(iccid)
      setTimeout(() => setCopiedICCID(null), 2000)
    } catch (err) {
      console.error('Failed to copy ICCID:', err)
    }
  }

  const handleActivateESIM = (iccid) => {
    activateESIM(iccid)
  }

  const openDetails = (esim) => {
    setSelectedESIM(esim)
    setDetailOpen(true)
  }

  const openTopUpDialog = (esim) => {
    setTopUpESIM(esim)
    setTopUpOpen(true)
  }

  const closeDetails = () => {
    setDetailOpen(false)
    setSelectedESIM(null)
  }

  const closeTopUp = () => {
    setTopUpOpen(false)
    setTopUpESIM(null)
  }

  const dataToMb = (value) => {
    if (value === undefined || value === null) return null
    const stringValue = String(value).trim()
    const numeric = parseFloat(stringValue.replace(/[^\d.]/g, ''))
    if (Number.isNaN(numeric)) return null
    const lowered = stringValue.toLowerCase()
    if (lowered.includes('gb')) return numeric * 1000
    return numeric
  }

  const getUsagePercent = (esim) => {
    const totalMb = dataToMb(esim.dataAmount)
    const remainingMb = dataToMb(esim.remainingData)
    if (esim.status === 'expired') return 100
    if (typeof totalMb === 'number' && !Number.isNaN(totalMb) && totalMb > 0 && typeof remainingMb === 'number' && !Number.isNaN(remainingMb)) {
      const usedMb = Math.max(0, totalMb - remainingMb)
      return Math.min(100, Math.max(0, (usedMb / totalMb) * 100))
    }
    return 0
  }

  const statusConfig = {
    active: { color: '#22c55e', label: 'ACTIVE', bgColor: 'bg-green-100', textColor: 'text-green-700' },
    queued: { color: '#3b82f6', label: 'QUEUED', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
    expired: { color: '#6b7280', label: 'EXPIRED', bgColor: 'bg-gray-100', textColor: 'text-gray-700' }
  }

  const getStatusConfig = (status) => statusConfig[status] || statusConfig.queued

  const detailStatus = selectedESIM ? getICCIDStatus(selectedESIM) : null
  const detailStatusConfig = selectedESIM ? getStatusConfig(detailStatus) : null
  const detailUsagePercent = selectedESIM ? getUsagePercent(selectedESIM) : 0

  const getTopUpPlans = (esim) => {
    if (Array.isArray(esim?.topUpPlans) && esim.topUpPlans.length) {
      return esim.topUpPlans
    }

    // Fallback sample plans to mirror requested design
    return [
      { id: '1gb-7d', label: '1 GB', duration: '7 days', price: '$3.59' },
      { id: '2gb-15d', label: '2 GB', duration: '15 days', price: '$5.39' },
      { id: 'unlimited-30d', label: 'Unlimited', duration: '30 days', price: '$6.29', note: '1 GB high-speed, then 1.25 Mbps/day' },
      { id: '5gb-30d', label: '5 GB', duration: '30 days', price: '$9.89' }
    ]
  }

  const getQrSrc = (esim) => {
    if (!esim) return null
    if (esim.qrCode) return esim.qrCode
    const data = esim.installUrl || esim.iccid || 'pirate-esim'
    return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(data)}`
  }

  const handleDownloadQr = (esim) => {
    const src = getQrSrc(esim)
    if (!src) return
    const link = document.createElement('a')
    link.href = src
    const safeName = (esim?.countryName || 'esim').toLowerCase().replace(/[^a-z0-9]+/g, '-')
    link.download = `${safeName}-qr.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getDaysRemaining = (expiresAt) => {
    if (!expiresAt) return null
    const expires = new Date(expiresAt)
    if (Number.isNaN(expires.getTime())) return null
    const diff = expires.getTime() - Date.now()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const formatDateTime = (value) => {
    if (!value) return 'N/A'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'N/A'
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  const renderDetailRow = (label, value) => (
    <div className="flex items-start justify-between gap-3">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900 text-right break-words max-w-[70%] md:max-w-[260px]">{value ?? 'N/A'}</p>
    </div>
  )

  const renderQueuedESIMCard = (esim) => {
    const validityLabel = (() => {
      if (esim.duration) return `${esim.duration} days`
      if (esim.validity) return String(esim.validity)
      if (esim.raw?.validity_days) return `${esim.raw.validity_days} days`
      if (esim.raw?.validity) return String(esim.raw.validity)
      return 'N/A'
    })()

    const fallbackInitial = (esim.countryName || 'Q').slice(0, 1).toUpperCase()

    return (
      <div key={esim.iccid} className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          {esim.flag ? (
            <img
              src={esim.flag}
              alt={esim.countryName}
              className="h-10 w-10 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600 border border-gray-200">
              {fallbackInitial}
            </div>
          )}
          <div>
            <p className="text-base font-semibold text-gray-900">{esim.countryName || 'Queued eSIM'}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-medium">ICCID: {formatICCID(esim.iccid)}</span>
              <button
                onClick={() => copyICCID(esim.iccid)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy ICCID"
              >
                {copiedICCID === esim.iccid ? (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <span className="ml-2">Data</span>
            <span className="ml-auto font-semibold text-gray-900">{esim.dataAmount || 'N/A'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Timer className="w-4 h-4 text-gray-500" />
            <span className="ml-2">Validity</span>
            <span className="ml-auto font-semibold text-gray-900">{validityLabel}</span>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-10 w-full rounded-full"
            onClick={() => openDetails(esim)}
          >
            See Details
          </Button>
        </div>
      </div>
    )
  }

  const renderESIMCard = (esim, showActions = true) => {
    const status = getICCIDStatus(esim)
    const config = getStatusConfig(status)
    const daysRemaining = getDaysRemaining(esim.expiresAt)
    const remainingDisplay = status === 'expired'
      ? '0 GB'
      : esim.remainingData || esim.dataAmount || '0 GB'

    const gaugePercent = getUsagePercent(esim)

    const badgeLabel = (() => {
      if (status === 'active' && daysRemaining !== null) {
        return `${daysRemaining} DAY${daysRemaining === 1 ? '' : 'S'} LEFT`
      }
      if (status === 'queued') return 'QUEUED'
      if (status === 'expired') return 'EXPIRED'
      return config.label
    })()

    const fallbackInitial = (esim.countryName || 'E').slice(0, 1).toUpperCase()

    return (
      <div key={esim.iccid} className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5">
        {/* Title */}
        <div className="flex items-center gap-3">
          {esim.flag ? (
            <img
              src={esim.flag}
              alt={esim.countryName}
              className="h-10 w-10 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600 border border-gray-200">
              {fallbackInitial}
            </div>
          )}
          <div>
            <p className="font-medium text-[15px]">{esim.countryName}</p>
            <div className="flex items-center gap-2">
              <p className="text-[11px] text-gray-500">
                ICCID: {formatICCID(esim.iccid)}
              </p>
              <button
                onClick={() => copyICCID(esim.iccid)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {copiedICCID === esim.iccid ? (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="my-3 h-px bg-gray-200" />

        <div className="flex flex-col items-center">
          <EsimGauge
            percent={gaugePercent}
            color={config.color}
          />
          <div className="-mt-14 text-center">
            <div className="text-[18px] font-bold">
              {remainingDisplay}
            </div>
            <div className="text-[11px] text-gray-500">
              of {esim.dataAmount}
            </div>
            <div className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${config.bgColor} ${config.textColor}`}>
              {badgeLabel}
            </div>
          </div>
        </div>

        {showActions && (
          <div className="mt-4 w-full flex flex-col gap-3">
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-full rounded-full"
              onClick={() => openDetails(esim)}
            >
              See Details
            </Button>
            {status === 'queued' && (
              <Button
                size="sm"
                className="h-9 w-full rounded-full bg-secondary text-black font-medium"
                onClick={() => handleActivateESIM(esim.iccid)}
              >
                Activate
              </Button>
            )}
            {status === 'active' && (
              <Button
                size="sm"
                className="h-9 w-full rounded-full bg-secondary text-black font-medium"
                onClick={() => openTopUpDialog(esim)}
              >
                Top Up Plan
              </Button>
            )}
            {status === 'expired' && (
              <Button size="sm" className="h-9 w-full rounded-full bg-secondary text-black font-medium">
                Renew
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderLoadingState = () => (
    <div className="col-span-full flex items-center justify-center py-12">
      <Spinner className="h-6 w-6 text-gray-500" />
      <span className="ml-3 text-sm text-gray-600">Loading your eSIMs...</span>
    </div>
  )

  const renderErrorState = () => (
    <div className="col-span-full text-center py-12">
      <div className="text-red-500 mb-4">
        <AlertCircle className="w-12 h-12 mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">We couldn&apos;t load your eSIMs</h3>
      <p className="text-gray-500">{error || 'Something went wrong while loading your eSIMs.'}</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-6 lg:min-h-[calc(100vh-300px)]">
      {/* Tabs */}
      <Tabs defaultValue="active" className="w-full">
        {/* Desktop tabs */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center items-center justify-center gap-4 md:gap-0 ">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[28px] font-bold text-center md:text-left">My eSIMs</h1>
              <p className="text-sm text-gray-500 text-center md:text-left">View and manage any eSIMs you&apos;ve purchased</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          <TabsList className="flex gap-2 rounded-full bg-white p-1 h-auto border mb-4">
            <TabsTrigger
              value="active"
              className="px-4 py-2 rounded-full bg-secondary text-black text-sm font-medium data-[state=active]:bg-secondary data-[state=active]:text-black data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 hover:bg-yellow-200"
            >
              Active ({activeESIMs.length})
            </TabsTrigger>
            <TabsTrigger
              value="queued"
              className="px-4 py-2 rounded-full text-sm data-[state=active]:bg-secondary data-[state=active]:text-black data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 hover:bg-gray-200"
            >
              Queued ({queuedESIMs.length})
            </TabsTrigger>
            <TabsTrigger
              value="expired"
              className="px-4 py-2 rounded-full text-sm data-[state=active]:bg-secondary data-[state=active]:text-black data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 hover:bg-gray-200"
            >
              Expired
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="active" className="mt-0">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {loading ? renderLoadingState() : (error && activeESIMs.length === 0) ? (
              renderErrorState()
            ) : activeESIMs.length > 0 ? (
              activeESIMs.map((esim) => renderESIMCard(esim))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <CheckCircle className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active eSIMs</h3>
                <p className="text-gray-500">You don&apos;t have any active eSIMs at the moment.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="queued" className="mt-0">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {loading ? renderLoadingState() : (error && queuedESIMs.length === 0) ? (
              renderErrorState()
            ) : queuedESIMs.length > 0 ? (
              queuedESIMs.map((esim) => renderQueuedESIMCard(esim))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Clock className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Queued eSIMs</h3>
                <p className="text-gray-500">You don&apos;t have any eSIMs waiting to be activated.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="expired" className="mt-0">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {/* {loading ? renderLoadingState() : (error && expiredESIMs.length === 0) ? (
              renderErrorState()
            ) : expiredESIMs.length > 0 ? (
              expiredESIMs.map((esim) => renderESIMCard(esim))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <AlertCircle className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Expired eSIMs</h3>
                <p className="text-gray-500">You don&apos;t have any expired eSIMs.</p>
              </div>
            )} */}
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <AlertCircle className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Expired eSIMs</h3>
              <p className="text-gray-500">You don&apos;t have any expired eSIMs.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={topUpOpen} onOpenChange={(isOpen) => (isOpen ? setTopUpOpen(true) : closeTopUp())}>
        <DialogContent className="w-full max-w-lg rounded-3xl">
          {topUpESIM && (
            <div className="flex flex-col gap-4">
              <DialogHeader className="gap-1">
                <DialogTitle className="text-xl font-semibold">Queued eSIM Top-Up Packs</DialogTitle>
                <DialogDescription className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  For eSIM: {formatICCID(topUpESIM.iccid)}
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-2xl bg-green-50 text-green-800 px-4 py-3 text-sm flex gap-2 items-start border border-green-100">
                <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                <div>
                  <p className="font-medium">Auto-activation after current packs ends.</p>
                  <p className="text-green-700">The top-up plans will be activated in order.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 divide-y">
                {getTopUpPlans(topUpESIM).map((plan) => (
                  <div key={plan.id || `${plan.label}-${plan.duration}`} className="flex items-center justify-between px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-gray-900">{plan.label}</span>
                      <span className="text-sm text-gray-600">{plan.duration}</span>
                      {plan.note && <span className="text-xs text-gray-500">{plan.note}</span>}
                    </div>
                    <span className="text-base font-semibold text-gray-900">{plan.price}</span>
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button
                  className="w-full h-11 rounded-full bg-secondary text-black font-semibold hover:bg-yellow-300"
                  onClick={closeTopUp}
                >
                  Top Up More
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={detailOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            closeDetails()
          } else {
            setDetailOpen(true)
          }
        }}
      >
        <DialogContent className="w-full max-w-lg rounded-3xl">
          {selectedESIM && (
            <div className="flex flex-col gap-5">
              <div className="text-center space-y-1">
                <DialogTitle className="text-xl font-semibold">Thank You for Purchase</DialogTitle>
                <DialogDescription className="text-sm text-gray-600">eSim Installation</DialogDescription>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>Country</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedESIM.flag && (
                      <img
                        src={selectedESIM.flag}
                        alt={selectedESIM.countryName}
                        className="w-5 h-5 rounded-full border object-cover"
                      />
                    )}
                    <span className="font-semibold text-gray-900">{selectedESIM.countryName || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>Plan</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {selectedESIM.dataAmount || selectedESIM.planType || 'N/A'}
                    {selectedESIM.duration ? ` for ${selectedESIM.duration} days` : ''}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>ICCID</span>
                  </div>
                  <span className="inline-flex items-center gap-2 font-semibold text-gray-900">
                    {formatICCID(selectedESIM.iccid)}
                    <button
                      onClick={() => copyICCID(selectedESIM.iccid)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy ICCID"
                    >
                      {copiedICCID === selectedESIM.iccid ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </span>
                </div>
              </div>

              <div className="text-center space-y-3">
                <p className="text-sm font-semibold text-gray-900">Scan QR Code</p>
                <div className="flex justify-center">
                  <img
                    src={getQrSrc(selectedESIM)}
                    alt="eSIM QR code"
                    className="w-44 h-44 rounded-lg border bg-white object-contain"
                  />
                </div>
                <Button
                  className="w-full h-11 rounded-full bg-secondary text-black font-semibold hover:bg-yellow-300 inline-flex items-center justify-center gap-2"
                  onClick={() => handleDownloadQr(selectedESIM)}
                >
                  <Download className="w-4 h-4" />
                  Download QR code
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
