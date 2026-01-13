"use client"
import React, { useState, memo, useEffect, useRef } from 'react'
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import Link from 'next/link'




const MainHero = memo(function MainHero() {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  // Fetch countries data
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true)
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.piratemobile.gg';
        const response = await fetch(`${apiBaseUrl}/e-sim/countries`);
        
        if (response.ok) {
          const data = await response.json();
          setCountries(data.countries || []);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoading(false)
      }
    };

    fetchCountries();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter countries based on search query
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(query.toLowerCase())
  );

  // Helper function to generate proper slug from country name
  const generateSlug = (country) => {
    if (country.slug) return country.slug;
    if (country.iso) return country.iso.toLowerCase();
    return country.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleCountryClick = (countryName) => {
    setQuery(countryName);
    setIsDropdownOpen(false);
  };

  return (
    <section className="relative w-full min-h-[500px] lg:min-h-[600px] 2xl:min-h-[800px] flex items-end justify-center px-4 pt-12 top pb-8 lg:pb-0">
      {/* Background image with gradient overlay - Optimized */}
      <div className="absolute inset-0 z-10 w-full h-full hidden lg:block">
        <Image
          src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/home/Content%20Container.png?updatedAt=1760168525359"
          alt="Background pattern"
          fill
          className="object-contain object-center"
          priority={true}
          quality={100}
          sizes="100vw"
        />
      </div>
      {/* Gradient overlay for better text readability */}
      <div
        className="absolute inset-0 bg-gradient-to-br lg:bg-gradient-to-tr from-[#FFF7C1] via-[#FFFDE9] to-[#FFFDE7]"
      ></div>

      {/* Content container */}
      <div className="relative z-10 flex w-full max-w-6xl 2xl:max-w-7xl mx-auto h-full">

        {/* Left side: Text & Search */}
        <div className="w-full flex flex-col items-center lg:items-start text-center lg:text-left  h-full lg:pb-12 2xl:pb-28">
          <h1 className="font-bold text-[9vw] sm:text-5xl lg:text-5xl 2xl:text-[64px] text-slate-900 leading-tight mb-3">
            Travel Freely<br />
            Connect Instantly<br />
            <span className="text-green-500">
              Anywhere, Anytime
            </span>
          </h1>
          <p className="mt-2 text-slate-700 text-base lg:text-lg font-medium max-w-xl mb-7">
            Get your digital SIM card in minutes and stay connected in over 190 countries. No more searching for local SIMs.
          </p>

          {/* Search bar with dropdown */}
          <div className="w-full max-w-lg mb-4 relative">
            <div
              ref={inputRef}
              className="w-full flex items-center bg-white shadow-md border border-gray-200 p-1 rounded-full overflow-hidden"
          >
            {/* Location Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 ml-1">
                <Image 
                  src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/home/maps-global-01.svg?updatedAt=1760169285456" 
                  alt="Search" 
                  width={20} 
                  height={20} 
                />
            </div>

            {/* Search Input */}
              <input
                className="flex-1 px-2 py-2 border-none outline-none shadow-none bg-transparent text-gray-700 placeholder:text-gray-400"
                type="text"
              placeholder="Search for destination"
              value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={handleInputFocus}
            />

            {/* Search Button */}
            <Button
              size="lg"
              className="ml-1 px-6 py-3 bg-secondary hover:bg-secondary-foreground text-slate-900 font-semibold shadow-none flex items-center gap-2 rounded-full"
            >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-gray-700"
                >
                  <path
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              <span className='hidden md:block'>Search</span>
            </Button>
            </div>

            {/* Dropdown with countries list */}
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-200 max-h-[400px] overflow-y-auto z-50"
              >
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading countries...</div>
                ) : filteredCountries.length > 0 ? (
                  <div className="py-2">
                    {filteredCountries.map((country, index) => (
                      <Link
                        key={`${country.id}-${country.name}-${index}`}
                        href={`/esim/${generateSlug(country)}`}
                        onClick={() => handleCountryClick(country.name)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        {country.flag && (
                          <Image
                            src={country.flag}
                            alt={country.name}
                            width={32}
                            height={24}
                            className="w-8 h-6 object-cover rounded"
                          />
                        )}
                        <span className="text-gray-900 font-medium">{country.name}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {query ? 'No countries found' : 'Start typing to search countries'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Feature Highlights */}
          <div className="flex flex-wrap gap-1.5 md:gap-4 text-slate-700 text-sm font-normal justify-center md:justify-start">
            <span className="flex items-center gap-1.5 py-[0.4rem] rounded-full">
              <Check className="w-4 h-4 border rounded-full border-slate-700 p-0.5" /> Global Coverage
            </span>
            <span className="flex items-center gap-1.5 py-[0.4rem] rounded-full">
              <Check className="w-4 h-4 border rounded-full border-slate-700 p-0.5" /> 190+ Country
            </span>
            <span className="flex items-center gap-1.5 py-[0.4rem] rounded-full">
              <Check className="w-4 h-4 border rounded-full border-slate-700 p-0.5" /> 24/7 Support
            </span>
          </div>
        </div>

        {/* Right side: Mobile phone visual - Optimized */}
        <div className="absolute right-0 bottom-0 w-full md:w-1/2 lg:flex justify-end items-end min-h-[300px] mb-0 hidden">
          <Image
            width={637}
            height={818}
            src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/home/Group%201171275346.png?updatedAt=1760260356476"
            alt="Mobile phone eSIM preview"
            style={{ height: 'auto' }}
            className='mx-auto w-[270px] sm:w-[350px] md:w-[370px] lg:w-[410px] 2xl:w-[637px] h-auto mb-0'
            priority
            quality={100}
            sizes="(max-width: 768px) 270px, (max-width: 1024px) 370px, (max-width: 1536px) 410px, 637px"
          />
        </div>
      </div>
    </section>
  )
})

export default MainHero
