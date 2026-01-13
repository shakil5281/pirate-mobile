"use client"

import React, { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import QRCode from 'react-qr-code'
import Image from 'next/image'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const qrRef = useRef(null)

  const orderId = searchParams.get('orderID') || searchParams.get('token')
  const bundleId = searchParams.get('bundleId')

  // Sample eSIM data (replace with actual API data)
  const [esimData, setEsimData] = useState({
    country: 'Belgium',
    countryCode: 'BE',
    plan: '1GB for 7 days',
    iccid: 'ERATOS8020200092924',
    qrCodeData: 'LPA:1$example.com$ACTIVATION_CODE_HERE'
  })

  useEffect(() => {
    // Fetch order details if orderID is available
    if (orderId) {
      setLoading(true)
      fetch(`/api/paypal/capture-order?orderID=${orderId}`)
        .then(res => res.json())
        .then(data => {
          setOrderDetails(data)
          setLoading(false)
          // Here you would fetch the actual eSIM data based on the order
          // fetchEsimData(data.orderID)
        })
        .catch(err => {
          console.error('Error fetching order details:', err)
          setLoading(false)
        })
    }
  }, [orderId])

  const handleDownloadQR = () => {
    const svg = qrRef.current.querySelector('svg')
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new window.Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = `eSIM-QR-${esimData.iccid}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className="min-h-screen bg-[#FFFEF2] pt-28 pb-12 px-4">
      <div className="max-w-lg mx-auto">
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mb-2">
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                </div>
                <span className="text-xs font-medium text-green-700">Choose Plan</span>
              </div>

              {/* Connector 1 */}
              <div className="w-16 sm:w-20 md:w-24 h-0.5 bg-green-500 mb-6 mx-1"></div>

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mb-2">
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                </div>
                <span className="text-xs font-medium text-green-700">Confirm & Pay</span>
              </div>

              {/* Connector 2 */}
              <div className="w-16 sm:w-20 md:w-24 h-0.5 bg-green-500 mb-6 mx-1"></div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mb-2">
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                </div>
                <span className="text-xs font-medium text-green-700">Activate & Use</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              Thank You for Purchase
            </h1>
            <p className="text-sm text-gray-600">eSim Installation</p>
          </div>

          {/* eSIM Details */}
          <div className="space-y-3 mb-6">
            {/* Country */}
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">Country</span>
              </div>
              <div className="flex items-center gap-2">
                <Image 
                  src={`https://flagcdn.com/w40/${esimData.countryCode.toLowerCase()}.png`}
                  alt={esimData.country}
                  width={24}
                  height={16}
                  className="rounded object-cover"
                />
                <span className="font-semibold text-gray-900 text-sm">{esimData.country}</span>
              </div>
            </div>

            {/* Plan */}
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm">Plan</span>
              </div>
              <span className="font-semibold text-gray-900 text-sm">{esimData.plan}</span>
            </div>

            {/* iCCID */}
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span className="text-sm">iCCID</span>
              </div>
              <span className="font-mono text-xs text-gray-900">{esimData.iccid}</span>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="text-center mb-6">
            <p className="text-xs font-medium text-gray-700 mb-3">Scan QR Code</p>
            <div 
              ref={qrRef}
              className="inline-block p-3 bg-white border-2 border-gray-100 rounded-xl"
            >
              <QRCode
                value={esimData.qrCodeData}
                size={140}
                level="H"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Download Button */}
          <Button
            onClick={handleDownloadQR}
            className="w-full bg-secondary hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg text-sm transition-all duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Download QR code
          </Button>
        </div>
      </div>
    </div>
  )
}

