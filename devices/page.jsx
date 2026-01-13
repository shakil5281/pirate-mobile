'use client';

import React, { useState, useEffect } from 'react';
import { DeviceSearch, DeviceBrandCard } from '@/components/devices';
import { Skeleton } from '@/components/ui/skeleton';
import Head from 'next/head';

const DevicesPage = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBrands, setExpandedBrands] = useState(new Set());

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async (search = '') => {
    try {
      setLoading(true);
      const url = search 
        ? `/api/devices?search=${encodeURIComponent(search)}`
        : '/api/devices';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch devices');
      }
      
      const data = await response.json();
      setDevices(data.devices || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchDevices(query);
  };

  const toggleBrand = (brand) => {
    const newExpanded = new Set(expandedBrands);
    if (newExpanded.has(brand)) {
      newExpanded.delete(brand);
    } else {
      newExpanded.add(brand);
    }
    setExpandedBrands(newExpanded);
  };

  const DeviceSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div>
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="w-5 h-5" />
      </div>
    </div>
  );

  if (error) {
    return (
      <>
        <Head>
          <title>Error Loading Devices | PIRATE eSIM</title>
          <meta name="description" content="There was an error loading the device compatibility information." />
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Devices</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button 
              onClick={() => fetchDevices(searchQuery)}
              className="bg-secondary hover:bg-yellow-500 text-gray-900 font-medium px-6 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>eSIM Compatible Devices | PIRATE eSIM</title>
        <meta name="description" content="Check if your device supports eSIM technology. Find compatible smartphones from Apple, Samsung, Google Pixel, and more brands." />
        <meta name="keywords" content="eSIM compatible devices, eSIM support, smartphone compatibility, iPhone eSIM, Samsung eSIM, Google Pixel eSIM, device compatibility, carrier unlocked, mobile data, travel eSIM" />
        <meta property="og:title" content="eSIM Compatible Devices | PIRATE eSIM" />
        <meta property="og:description" content="Check if your device supports eSIM technology. Find compatible smartphones from Apple, Samsung, Google Pixel, and more brands." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="eSIM Compatible Devices | PIRATE eSIM" />
        <meta name="twitter:description" content="Check if your device supports eSIM technology. Find compatible smartphones from Apple, Samsung, Google Pixel, and more brands." />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Devices that{' '}
              <span className="text-green-600">Support eSIMs</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Only devices that are carrier-unlocked and support eSIM technology can use piratemobile.
            </p>
            
            {/* Search Bar */}
            <DeviceSearch onSearch={handleSearch} loading={loading} />
          </div>

          {/* Devices List */}
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <DeviceSkeleton key={index} />
                ))}
              </div>
            ) : devices.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No devices found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery 
                    ? `No devices match "${searchQuery}". Try a different search term.`
                    : 'No devices available at the moment.'
                  }
                </p>
                {searchQuery && (
                  <button
                    onClick={() => handleSearch('')}
                    className="text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {devices.map((brand, index) => (
                  <DeviceBrandCard
                    key={brand.brand}
                    brand={brand.brand}
                    models={brand.models}
                    isExpanded={expandedBrands.has(brand.brand)}
                    onToggle={() => toggleBrand(brand.brand)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="mt-12 sm:mt-16 bg-white rounded-xl p-6 sm:p-8 shadow-sm max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              About eSIM Compatibility
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Device must support eSIM technology</li>
                  <li>• Device must be carrier-unlocked</li>
                  <li>• Compatible with iOS 12.1+ or Android 8.0+</li>
                  <li>• QR code scanning capability</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Benefits</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• No physical SIM card needed</li>
                  <li>• Instant activation</li>
                  <li>• Multiple profiles on one device</li>
                  <li>• Easy switching between carriers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DevicesPage;