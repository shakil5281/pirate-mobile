'use client';

import React from 'react';
import { ChevronDown, ChevronUp, Smartphone } from 'lucide-react';

const DeviceCard = ({ brand, models, isExpanded, onToggle }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          <Smartphone className="w-4 h-4 text-gray-600" />
        </div>
        <span className="text-lg font-semibold text-gray-900">{brand}</span>
      </div>
      {isExpanded ? (
        <ChevronUp className="w-5 h-5 text-gray-500" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-500" />
      )}
    </button>

    {isExpanded && (
      <div className="border-t border-gray-100 p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {models.map((model, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Smartphone className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700 truncate">
                {model.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const CompatibleDevicesList = ({ devices, expandedBrands, onToggleBrand }) => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <div className="space-y-4">
      {devices.map((brand) => (
        <DeviceCard
          key={brand.brand}
          brand={brand.brand}
          models={brand.models}
          isExpanded={expandedBrands.has(brand.brand)}
          onToggle={() => onToggleBrand(brand.brand)}
        />
      ))}
    </div>

    <div className="mt-12 sm:mt-16 bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
        About eSIM Compatibility
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>- Device must support eSIM technology</li>
            <li>- Device must be carrier-unlocked</li>
            <li>- Compatible with iOS 12.1+ or Android 8.0+</li>
            <li>- QR code scanning capability</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Benefits</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>- No physical SIM card needed</li>
            <li>- Instant activation</li>
            <li>- Multiple profiles on one device</li>
            <li>- Easy switching between carriers</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default CompatibleDevicesList;
