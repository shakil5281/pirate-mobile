import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

const DeviceBrandCard = ({ brand, models, isExpanded, onToggle }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Brand Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Smartphone className="w-4 h-4 text-gray-600" />
          </div>
          <span className="text-lg font-semibold text-gray-900">{brand}</span>
          <span className="text-sm text-gray-500">({models.length} models)</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {/* Models Grid */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {models.map((model, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <Smartphone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {model.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {model.year}
                    {model.dualSim && (
                      <span className="ml-2 text-green-600 font-medium">Dual SIM</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { DeviceBrandCard };
