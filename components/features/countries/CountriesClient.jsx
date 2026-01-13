"use client"

import React, { useEffect, useMemo, useState, useDeferredValue } from 'react'
import { Button } from '@/components/ui/button'
import { EsimCard, BelgiumFlag, EgyptFlag, FranceFlag, GermanyFlag, JapanFlag, SpainFlag } from '@/components/card/esim-card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import Image from 'next/image'
import Link from 'next/link'

const FLAG_MAP = {
  Belgium: BelgiumFlag,
  Egypt: EgyptFlag,
  France: FranceFlag,
  Germany: GermanyFlag,
  Japan: JapanFlag,
  Spain: SpainFlag,
}

export default function CountriesClient({ data }) {
  const [query, setQuery] = useState('')
  const [range, setRange] = useState('all')
  const [tab, setTab] = useState('all')
  const [visibleCountries, setVisibleCountries] = useState([])

  const COUNTRIES = useMemo(() => data?.countries || [], [data])
  const POPULAR_COUNTRIES = useMemo(() => data?.popularCountries || [], [data])
  const deferredQuery = useDeferredValue(query)

  const popularSet = useMemo(() => new Set(POPULAR_COUNTRIES.filter(c => c?.name).map(c => c.name)), [POPULAR_COUNTRIES])
  // Regional plans: show Europe card
  const REGIONAL_CARDS = useMemo(() => ([
    {
      id: 'europe',
      name: 'Europe',
      flag: 'https://flagcdn.com/w80/eu.png',
      region: 'Regional',
      pricing: null,
    }
  ]), [])


  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()

    // First filter by tab
    let source = COUNTRIES
    if (tab === 'popular') {
      source = COUNTRIES.filter(c => popularSet.has(c.name))
    } else if (tab === 'regional') {
      source = REGIONAL_CARDS
    }

    // Then filter by search query
    if (q) {
      source = source.filter(c => c?.name && c.name.toLowerCase().includes(q))
    }

    // Finally filter by range
    if (range !== 'all') {
      const [start, end] = range.split('~')
      if (start && end) {
        source = source.filter(c => {
          const first = c?.name?.[0]?.toUpperCase()
          return first && first >= start && first <= end
        })
      }
    }

    return source
  }, [COUNTRIES, deferredQuery, range, tab, popularSet, REGIONAL_CARDS])

  // Render large "All" lists in chunks to reduce tab-switch lag
  useEffect(() => {
    const isAllTab = tab === 'all'
    const needsChunking = isAllTab && filtered.length > 80
    const CHUNK_SIZE = 60

    let cancelled = false
    let timeoutId = null

    if (!needsChunking) {
      setVisibleCountries(filtered)
      return () => {
        if (timeoutId) clearTimeout(timeoutId)
      }
    }

    setVisibleCountries([])

    const renderChunk = (startIndex = 0, acc = []) => {
      if (cancelled) return
      const nextChunk = filtered.slice(startIndex, startIndex + CHUNK_SIZE)
      const nextAcc = [...acc, ...nextChunk]
      setVisibleCountries(nextAcc)

      if (startIndex + CHUNK_SIZE < filtered.length) {
        timeoutId = setTimeout(() => renderChunk(startIndex + CHUNK_SIZE, nextAcc), 0)
      }
    }

    renderChunk(0, [])

    return () => {
      cancelled = true
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [filtered, tab])

  return (
    <div>
      <div className=''>
        {/* Hero */}
        <div className='bg-linear-to-t from-[#fffff] to-[#FFFAD6] h-[420px] lg:h-[470px] flex items-center justify-end flex-col w-full flex-wrap gap-6'>
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
              Connect Globally
            </h1>
            <div className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
              in <span className='lg:text-primary'>190+ Countries Instantly</span>
            </div>
            <p className="mt-4 text-gray-600 text-sm md:text-base px-4">Stay connected wherever you travel with fast, secure data—no roaming fees.</p>
          </div>

          {/* Search */}
          <div className="w-full max-w-3xl px-4">
            <div className="flex items-center gap-3 rounded-full bg-white h-12 lg:h-14 sm:h-14 px-2 shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
              {/* Location Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 shrink-0">
                <Image
                  src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/home/maps-global-01.svg?updatedAt=1760169285456"
                  alt="Search"
                  width={20}
                  height={20} />
              </div>

              {/* Input Field */}
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for destination"
                className="h-full outline-none bg-transparent text-sm md:text-base text-gray-900 placeholder-gray-500 w-full"
              />

              {/* Search Button */}
              <Button className="h-10 sm:h-11 rounded-full bg-secondary text-black hover:bg-secondary-foreground !px-6 !sm:px-12 flex items-center gap-2 font-medium">
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
                <span className='hidden md:flex'>Search</span>
              </Button>
            </div>
            <div className="mt-3 text-xs text-center text-gray-600">
              <Link href="#" className="underline-offset-4 hover:underline">See if your device can use our eSIM</Link>
            </div>
          </div>
        </div>

        {/* Tabs and Filters */}
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8'>
          <div>
            <h2 className='text-2xl sm:text-[32px] lg:text-4xl font-semibold leading-tight text-center'>All Destinations</h2>
          </div>
          <Tabs value={tab} onValueChange={setTab} className="mt-4">
            <div className="flex items-center justify-center lg:px-4">
              <TabsList className="bg-white rounded-full border shadow-md max-w-full p-1 h-11 xs:h-12 md:h-14 gap-1 xs:gap-2 flex flex-wrap justify-center">
                <TabsTrigger
                  value="popular"
                  className="px-2 xs:px-2 md:px-8 py-1.5 xs:py-2 md:py-3 rounded-full text-xs xs:text-sm md:text-base data-[state=active]:bg-secondary data-[state=active]:text-black min-w-[90px] md:min-w-[160px] text-center"
                >
                  Popular <span className='hidden md:flex'> Countries </span>
                </TabsTrigger>
                <TabsTrigger
                  value="all"
                  className="px-2 xs:px-2 md:px-8 py-1.5 xs:py-2 md:py-3 rounded-full text-xs xs:text-sm md:text-base data-[state=active]:bg-secondary data-[state=active]:text-black min-w-[90px] md:min-w-[160px] text-center"
                >
                  All <span className='hidden md:flex'> Countries </span>
                </TabsTrigger>
                <TabsTrigger
                  value="regional"
                  className="px-2 xs:px-2 md:px-8 py-1.5 xs:py-2 md:py-3 rounded-full text-xs xs:text-sm md:text-base data-[state=active]:bg-secondary data-[state=active]:text-black min-w-[90px] md:min-w-[160px] text-center"
                >
                  Regional <span className='hidden md:flex'> Plans
                  </span>             </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-4">
              <div className="pt-2">
                <div className="grid grid-cols-5 text-center text-sm text-gray-600">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'A~G', label: 'A - G' },
                    { key: 'H~N', label: 'H - N' },
                    { key: 'O~T', label: 'O - T' },
                    { key: 'U~Z', label: 'U - Z' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setRange(key)}
                      className={`relative pb-3 cursor-pointer ${range === key ? 'text-green-700 border-b-2 border-green-500' : 'border-b border-gray-200'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="popular" className="mt-4">
              <div className="pt-2">
                <div className="grid grid-cols-5 text-center text-sm text-gray-600">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'A~G', label: 'A - G' },
                    { key: 'H~N', label: 'H - N' },
                    { key: 'O~T', label: 'O - T' },
                    { key: 'U~Z', label: 'U - Z' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setRange(key)}
                      className={`relative pb-3 cursor-pointer ${range === key ? 'text-green-700 border-b-2 border-green-500' : 'border-b border-gray-200'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="regional" className="mt-4">
              <div className="pt-2">
                <div className="grid grid-cols-5 text-center text-sm text-gray-600">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'A~G', label: 'A - G' },
                    { key: 'H~N', label: 'H - N' },
                    { key: 'O~T', label: 'O - T' },
                    { key: 'U~Z', label: 'U - Z' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setRange(key)}
                      className={`relative pb-3 cursor-pointer ${range === key ? 'text-green-700 border-b-2 border-green-500' : 'border-b border-gray-200'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>


          {/* Grid */}
          <div className="mt-8">
            {visibleCountries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No countries found matching your criteria.</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters.</p>
                {COUNTRIES.length === 0 && (
                  <p className="text-red-500 text-sm mt-2">No countries data loaded from API.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {visibleCountries.map((c, idx) => {
                  const Flag = FLAG_MAP[c.name] || JapanFlag
                  const pricing = c.pricing;
                  const displayPrice = pricing ? pricing.price : 4.50;
                  const displayDuration = pricing?.validity || "7 Days";

                  return (
                    <EsimCard
                      key={`${c.id}-${idx}`}
                      country={c.name}
                      price={displayPrice}
                      duration={displayDuration}
                      flag={c.flag ? <Image src={c.flag} alt={c.name} width={48} height={32} className="w-12 h-8 object-cover rounded absolute overflow-hidden lg:bottom-1 bottom-2 lg:scale-130 scale-150" /> : <Flag />}
                      region={c.region}
                      className="w-full"
                    />
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
