import React from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function WhyChooseEuropeEsim() {
  const features = [
    {
      title: 'Pan-European Coverage',
      description: 'Works in 34 countries',
      position: 'top-left'
    },
    {
      title: 'High-Speed 4G/5G Data',
      description: 'Stay connected anywhere',
      position: 'top-right'
    },
    {
      title: 'Instant Activation',
      description: 'QR code setup in minutes',
      position: 'middle-left'
    },
    {
      title: 'Hassle-Free Setup',
      description: 'No KYC verification needed',
      position: 'middle-right'
    },
    {
      title: 'No Roaming Charges',
      description: 'Flat, transparent pricing',
      position: 'bottom-left'
    },
    {
      title: 'Starting at just $2.99',
      description: 'Reliable internet prices',
      position: 'bottom-right'
    }
  ];

  const positionStyles = {
    'top-left': { top: '6%', left: '4%' },
    'middle-left': { top: '50%', left: '0%', transform: 'translate(-5%, -50%)' },
    'bottom-left': { bottom: '6%', left: '4%' },
    'top-right': { top: '6%', right: '4%' },
    'middle-right': { top: '50%', right: '0%', transform: 'translate(5%, -50%)' },
    'bottom-right': { bottom: '6%', right: '4%' }
  };

  return (
    <section className="relative py-16 md:py-24 bg-[#F4F7FF]">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Why Choose{' '}
            <span className="text-[#3B82F6]">Pirate Mobile eSIM</span>
            {' '}for Europe
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto">
            Stay connected with blazing-fast internet, transparent pricing, and hassle-free setup across Europe.
          </p>
        </div>

        {/* Main Content - Features Grid with Central Image */}
        <div className="relative max-w-7xl mx-auto">
          {/* Desktop Layout - Floating Cards */}
          <div className="hidden lg:block">
            <div className="relative  min-h-[520px]">
              

              {/* Central Image */}
              <div className="relative z-10 flex items-center justify-center w-full h-full">
                <div className="relative w-[420px] aspect-square drop-shadow-xl">
                  <Image
                    src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/europe/Group%202514252.png?updatedAt=1761454876204"
                    alt="Europe eSIM Coverage Map"
                    width={420}
                    height={420}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Floating Feature Cards */}
              {features.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  feature={feature}
                  className="absolute w-[380px] xl:w-[400px] shadow-xl z-20"
                  style={positionStyles[feature.position]}
                />
              ))}
            </div>
          </div>

          {/* Mobile/Tablet Layout - Simple Grid */}
          <div className="lg:hidden space-y-8">
            {/* Center Image First on Mobile */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-[350px] aspect-square">
                <Image
                  src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/europe/Group%202514252.png?updatedAt=1761454876204"
                  alt="Europe eSIM Coverage Map"
                  width={350}
                  height={350}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {features.map((feature, index) => (
                <FeatureCard key={index} feature={feature} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12 md:mt-16 flex justify-center">
          <Link
            href="#plans"
            className="inline-flex items-center justify-center px-8 md:px-12 py-4 bg-white border-2 border-blue-600 text-blue-700 font-bold text-lg md:text-xl rounded-full shadow-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105"
          >
            <span className="text-blue-700">1 ESIM</span>
            <span className="mx-2 text-gray-700">FOR</span>
            <span className="text-blue-700">34 COUNTRIES</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Feature Card Component
function FeatureCard({ feature, className = '', style }) {
  return (
    <div
      className={`bg-white rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 ${className}`.trim()}
      style={style}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 border-2 border-blue-500 rounded-full flex items-center justify-center bg-blue-50">
            <Check className="w-5 h-5 text-blue-500 stroke-[3]" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-base mb-1 leading-tight">
            {feature.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
}

