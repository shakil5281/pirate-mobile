'use client';

import React, { useEffect, useState } from 'react';
import devicesData from '@/data/devices.json';
import CompatibleDevicesList from './CompatibleDevicesList';
import CompatibleDevicesHeader from './CompatibleDevicesHeader';


const CompatibleDevicesPageClient = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDevices, setFilteredDevices] = useState(devicesData.devices);
  const [expandedBrands, setExpandedBrands] = useState(new Set(['Samsung']));

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDevices(devicesData.devices);
      return;
    }

    const filtered = devicesData.devices
      .map((brand) => ({
        ...brand,
        models: brand.models.filter((model) =>
          model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          brand.brand.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((brand) => brand.models.length > 0);

    setFilteredDevices(filtered);
  }, [searchQuery]);

  const toggleBrand = (brandName) => {
    setExpandedBrands((prev) => {
      const updated = new Set(prev);
      if (updated.has(brandName)) {
        updated.delete(brandName);
      } else {
        updated.add(brandName);
      }
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <CompatibleDevicesHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        brandCount={filteredDevices.length}
      />
      <CompatibleDevicesList
        devices={filteredDevices}
        expandedBrands={expandedBrands}
        onToggleBrand={toggleBrand}
      />
    </div>
  );
};

export default CompatibleDevicesPageClient;
