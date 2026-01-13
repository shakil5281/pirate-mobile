'use client';
import React from 'react';
import Image from 'next/image';

export default function HajjConnectivityBanner() {
  const partners = [
    {
      id: 1,
      name: "Zain Saudi Arabia",
      logo: "https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Hajj/Vector.svg?updatedAt=1761391318432",
    },
    {
      id: 2,
      name: "Mobily Saudi Arabia",
      logo: "https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Hajj/Mobily_Logo%201.svg?updatedAt=1761391333860",
    }
  ];

  return (
    <section className="py-8 md:py-12 px-4 font-[family-name:var(--font-philosopher)]">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#22722F] to-[#3F6B2C] rounded-3xl px-8 md:px-12 py-10 md:py-12 shadow-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Text Content */}
            <div className="flex-1 text-white">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Hajj{' '}
                <span className="text-[#CBC72C]">eSim</span>{' '}
                Connectivity
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-white/90 max-w-2xl">
                Stay connected during your Hajj journey with our reliable eSIM partners. Enjoy seamless, fast, and affordable connectivity across Saudi Arabia without the hassle of physical SIM cards.
              </p>
            </div>

            {/* Partner Logos */}
            <div className="flex items-center gap-4 lg:gap-6">
              {partners.map((partner, index) => (
                <div 
                  key={partner.id}
                  className="relative group"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`
                  }}
                >
                  {/* Logo Container */}
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-8 bg-white flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={80}
                      height={80}
                      className="w-16 h-16 md:w-20 md:h-20 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    {/* Fallback logo if image fails */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {partner.fallbackLogo}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

