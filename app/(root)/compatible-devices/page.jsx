import React from 'react';
import CompatibleDevicesPageClient from '@/components/features/compatible-devices/CompatibleDevicesPageClient';


export const metadata = {
  title: 'Compatible Devices | Pirate Mobile',
  description: 'Browse devices that support eSIM technology and are compatible with piratemobile.',
};

const CompatibleDevicesPage = () => {
  return <CompatibleDevicesPageClient />;
};

export default CompatibleDevicesPage;
