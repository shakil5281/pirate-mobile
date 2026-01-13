import React from 'react';
import ReactCountryFlag from 'react-country-flag';

export default function EuropeCountriesCovered() {
  // European Countries Data - Main countries with proper flags
  const countriesData = [
    { name: 'Austria', code: 'AT' },
    { name: 'Belgium', code: 'BE' },
    { name: 'Bulgaria', code: 'BG' },
    { name: 'Croatia', code: 'HR' },
    { name: 'Cyprus', code: 'CY' },
    { name: 'Czech Republic', code: 'CZ' },
    { name: 'Denmark', code: 'DK' },
    { name: 'Estonia', code: 'EE' },
    { name: 'Finland', code: 'FI' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'Greece', code: 'GR' },
    { name: 'Hungary', code: 'HU' },
    { name: 'Iceland', code: 'IS' },
    { name: 'Ireland', code: 'IE' },
    { name: 'Italy', code: 'IT' },
    { name: 'Latvia', code: 'LV' },
    { name: 'Lithuania', code: 'LT' },
    { name: 'Luxembourg', code: 'LU' },
    { name: 'Malta', code: 'MT' },
    { name: 'Netherlands', code: 'NL' },
    { name: 'Norway', code: 'NO' },
    { name: 'Poland', code: 'PL' },
    { name: 'Portugal', code: 'PT' },
    { name: 'Romania', code: 'RO' },
    { name: 'Slovakia', code: 'SK' },
    { name: 'Slovenia', code: 'SI' },
    { name: 'Spain', code: 'ES' },
    { name: 'Sweden', code: 'SE' },
    { name: 'Switzerland', code: 'CH' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'Vatican City', code: 'VA' },
    { name: 'Liechtenstein', code: 'LI' },
    { name: 'Monaco', code: 'MC' }
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Countries Covered with{' '}
            <span className="text-[#3B82F6]">Our Europe eSIM</span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
            Traveling across Europe? With Pirate Mobile eSIM, you don't need to buy separate SIM cards in every country. One eSIM works seamlessly across 34 
            European countries, keeping you connected instantly wherever your journey takes you. Whether you're exploring historic landmarks, vibrant 
            cities, or shopping between borders, you'll stay connected without worrying about roaming charges.
          </p>
        </div>

        {/* Countries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-12">
          {countriesData.map((item, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <ReactCountryFlag
                countryCode={item.code}
                svg
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
                title={item.name}
              />
              <span className="font-medium text-gray-800 text-sm md:text-base">
                {item.name}
              </span>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm md:text-base">
            And many more countries across Europe! Get instant connectivity in 34+ countries with a single eSIM.
          </p>
        </div>
      </div>
    </section>
  );
}

