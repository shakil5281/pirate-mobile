"use client"

import React, { useState, useEffect } from 'react'
import NextImage from 'next/image'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

// Mapping of brand names to their logos
const getNetworkLogo = (brandName) => {
  if (!brandName) return null;

  const normalizedName = brandName.toLowerCase().trim();

  // Comprehensive mapping of brand names to logos
  const logoMap = {
    'verizon': 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Verizon_Logo_2000_to_2015.svg',
    'verizon wireless': 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Verizon_Logo_2000_to_2015.svg',
    'at&t': 'https://upload.wikimedia.org/wikipedia/commons/3/31/AT%26T_logo_2016.svg',
    'att': 'https://upload.wikimedia.org/wikipedia/commons/3/31/AT%26T_logo_2016.svg',
    'at&t mobility': 'https://upload.wikimedia.org/wikipedia/commons/3/31/AT%26T_logo_2016.svg',
    't-mobile': 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Deutsche_Telekom_2022.svg',
    'tmobile': 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Deutsche_Telekom_2022.svg',
    'proximus': 'https://upload.wikimedia.org/wikipedia/commons/5/53/Proximus_logo.svg',
    'base': 'https://upload.wikimedia.org/wikipedia/commons/7/72/Base_logo_2022.svg',
    'orange belgium': 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Orange_logo.svg',
    'orange': 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Orange_logo.svg',
    'stc': 'https://upload.wikimedia.org/wikipedia/en/9/91/Saudi_Telecom_Company_logo.svg',
    'saudi telecom company': 'https://upload.wikimedia.org/wikipedia/en/9/91/Saudi_Telecom_Company_logo.svg',
    'mobily': 'https://upload.wikimedia.org/wikipedia/en/4/44/Mobily_logo.svg',
    'zain': 'https://upload.wikimedia.org/wikipedia/commons/8/84/Zain_logo.svg',
    'telefonica': 'https://upload.wikimedia.org/wikipedia/commons/7/79/Telef%C3%B3nica_2021_logo.svg',
    'bouygues': 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Bouygues_Telecom_201x_logo.svg',
    'etisalat': 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Eand_Logo_EN.svg',
    'windtre': 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Wind_Tre_logo_2020.svg',
    'maroc telecom': 'https://upload.wikimedia.org/wikipedia/commons/4/49/Maroc_Telecom.svg',
    'o2 germany': 'https://upload.wikimedia.org/wikipedia/commons/6/60/O2.svg',
    'vodafone albania': 'https://upload.wikimedia.org/wikipedia/en/c/cc/Vodafone_2017_logo.svg',
    'vodafone czech republic': 'https://upload.wikimedia.org/wikipedia/commons/9/95/Vodafone_logo_2017.png',
    'albtelecom': 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Albtelecom.svg',
    'DTAC TriNet': 'https://upload.wikimedia.org/wikipedia/en/5/57/DTAC.png'

  };

  // Exact match only; if not found caller can show the provider name instead of a logo
  return logoMap[normalizedName] || null;
};

// Generate a short 2-letter label for providers without a logo match
const getShortProviderLabel = (name) => {
  if (!name) return 'NA';
  const trimmed = name.trim();
  if (!trimmed) return 'NA';

  const words = trimmed.split(/\s+/);
  const initials = words.slice(0, 2).map(word => word.charAt(0)).join('');
  const label = initials || trimmed.slice(0, 2);

  return label.substring(0, 2).toUpperCase();
};

export default function EsimNetworkPartnersSection({
  countryName = "Belgium",
  partnerInfo = {
    text: "Partner in",
    flag: null,
    region: "Flemish"
  },
  networkProviders = [],
  iso = null,
  className
}) {
  const pathname = usePathname();
  const isHajjPage = pathname === '/esim/hajj';
  const [apiProviders, setApiProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch network providers from API if ISO code is provided
  useEffect(() => {
    const fetchNetworkProviders = async () => {
      if (!iso) return;

      setIsLoading(true);
      setError(null);

      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.piratemobile.gg';
        const isoCode = typeof iso === 'string' ? iso.toUpperCase() : String(iso).toUpperCase();
        const endpoint = `${apiBaseUrl}/e-sim/country-networks?iso=${encodeURIComponent(isoCode)}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(endpoint, {
          signal: controller.signal,
          cache: 'no-store'
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        // Transform API response to component format
        // Expected structure: networks.countryNetworks[0].networks[]
        const networks = data?.networks?.countryNetworks?.[0]?.networks || [];

        const transformedProviders = networks.map((network) => {
          const brandName = network.brandName || network.name;
          return {
            name: brandName,
            logo: getNetworkLogo(brandName), // Get logo from brand name mapping
            bgColor: "bg-gray-500"
          };
        });

        setApiProviders(transformedProviders);
      } catch (err) {
        // Suppress timeout errors - they're common and expected
        if (err.name !== 'AbortError') {
          console.error('Error fetching network providers:', err);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNetworkProviders();
  }, [iso]);
  // Default network providers if none provided
  const defaultProviders = [
    {
      name: "Provider 1",
      logo: "https://via.placeholder.com/80/9333ea/ffffff?text=P1",
      bgColor: "bg-purple-600"
    },
    {
      name: "Provider 2",
      logo: "https://via.placeholder.com/80/eab308/ffffff?text=P2",
      bgColor: "bg-yellow-500"
    },
    {
      name: "Provider 3",
      logo: "https://via.placeholder.com/80/f97316/ffffff?text=P3",
      bgColor: "bg-orange-500"
    }
  ]

  // Priority: API providers > prop providers > default providers
  const displayProviders =
    apiProviders.length > 0
      ? apiProviders
      : networkProviders.length > 0
        ? networkProviders
        : defaultProviders

  // Ensure every provider either has a mapped logo or falls back to its name
  const resolvedProviders = displayProviders.map((provider) => {
    const providerName = provider.name || provider.brandName || '';
    const mappedLogo = getNetworkLogo(providerName);
    return {
      ...provider,
      name: providerName,
      logo: provider.logo || mappedLogo
    };
  });

  return (
    <section className={cn("w-full py-8 md:py-12", isHajjPage && "font-philosopher", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-gray-800 via-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 lg:p-20 shadow-xl">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            {/* Left Side - Country and Partner Info */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h2 className={cn("text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3", isHajjPage && "font-philosopher")}>
                <span className="text-white">{countryName} </span>
                <span className="text-green-400">eSim Connectivity</span>
              </h2>

              {/* Partner Info */}
              <div className={cn("flex items-center gap-2 text-gray-300 relative justify-center md:justify-start", isHajjPage && "font-philosopher")}>
                <span className="text-sm sm:text-base">{partnerInfo.text}</span>

                {/* Flag Icon */}
                {partnerInfo.flag && typeof partnerInfo.flag === 'string' && (
                  <div className="w-6 h-4 rounded overflow-hidden shrink-0">
                    <NextImage
                      src={partnerInfo.flag}
                      alt={partnerInfo.region || countryName}
                      width={40}
                      height={40}
                      className="w-6 h-6 absolute top-0 rounded-full object-cover border border-white"
                    />
                  </div>
                )}
                {/* Region/Partner Name */}
                {partnerInfo.region && (
                  <span className="text-sm sm:text-base font-medium text-white">
                    {countryName}
                  </span>
                )}
              </div>
            </div>

            {/* Right Side - Network Provider Logos */}
            <div className="flex items-center gap-3 sm:gap-4">
              {resolvedProviders.map((provider, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden shadow-lg p-2",
                    "transform transition-all duration-300 hover:scale-110 hover:shadow-2xl",
                    "border-2 border-white/10 hover:border-white/30",
                    provider.logo ? "bg-white" : "bg-gray-500"
                  )}
                  title={provider.name}
                >
                  {provider.logo ? (
                    <NextImage
                      src={provider.logo}
                      alt={provider.name}
                      width={80}
                      height={80}
                      className="object-contain p-2 w-full h-full"
                      sizes="80px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm text-center">
                      {getShortProviderLabel(provider.name)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

