"use client"

import React, { useMemo, useState } from 'react'
import { EsimCard, BelgiumFlag, EgyptFlag, FranceFlag, GermanyFlag, JapanFlag, SpainFlag } from '@/components/card/esim-card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import Link from 'next/link'
import Image from 'next/image'

const FLAG_MAP = {
  Belgium: BelgiumFlag,
  Egypt: EgyptFlag,
  France: FranceFlag,
  Germany: GermanyFlag,
  Japan: JapanFlag,
  Spain: SpainFlag,
}

export default function PopularDestinations({ data = { countries: [], popular: [], regional: [] } }) {
  const [tab, setTab] = useState('popular')

  const countries = useMemo(() => data.countries || [], [data])
  const popularSet = useMemo(() => new Set(data.popular || []), [data])

  // Europe card for regional plans
  const europeCard = useMemo(() => ({
    name: 'Europe',
    price: '4.50',
    duration: '7 days',
    flag: 'https://flagcdn.com/w80/eu.png'
  }), [])

  const list = useMemo(() => {
    if (tab === 'regional') return [europeCard]
    return countries.filter(c => popularSet.has(c.name))
  }, [tab, countries, popularSet, europeCard])


  return (
    <section className="bg-white md:bg-[#F6FFF8]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-[32px] lg:text-5xl font-semibold leading-tight mb-4">
            Pick a Vacation <span className="text-green-600">Destination</span>
          </h2>
          <p className="text-sm text-gray-600">
            Choose your destination first, then a data plan according to your needs.
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="w-full bg-white rounded-full border shadow-none h-12 flex max-w-sm mx-auto ">
              <TabsTrigger value="popular" className="flex-1 h-10 rounded-full data-[state=active]:bg-secondary  data-[state=active]:text-black text-sm font-semibold px-4">Popular Countries</TabsTrigger>
              <TabsTrigger value="regional" className="flex-1 h-10 rounded-full data-[state=active]:bg-secondary  data-[state=active]:text-black text-sm font-semibold px-4">Regional Plans</TabsTrigger>
            </TabsList>
            <TabsContent value="popular" className="mt-6">
              {list.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No popular countries available at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 lg:gap-6 auto-rows-fr">
                  {list.slice(0, 12).map((c, idx) => {
                    const Flag = FLAG_MAP[c.name] || JapanFlag
                    return (
                      <div key={`${c.name}-${idx}`} className="h-full">
                        <EsimCard
                          country={c.name}
                          price={c.price}
                          duration={c.duration}
                          flag={<Flag />}
                          className="w-full h-full"
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>
            <TabsContent value="regional" className="mt-6">
              {list.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No regional countries available at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 lg:gap-6 auto-rows-fr">
                  {list.map((c, idx) => (
                    <div key={`${c.name}-${idx}`} className="h-full">
                      <EsimCard
                        country={c.name}
                        price={c.price}
                        duration={c.duration}
                        flag={
                          c.flag ? (
                            <Image 
                              src={c.flag} 
                              alt={c.name} 
                              width={48} 
                              height={32} 
                              className="w-full h-full object-cover" 
                              unoptimized
                            />
                          ) : (
                            <JapanFlag />
                          )
                        }
                        className="w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-10 text-center">
          <Link href="/countries" className="inline-flex h-11 items-center rounded-full bg-secondary px-6 text-sm font-medium text-black hover:bg-secondary-foreground duration-300 transition-colors">See All Countries</Link>
        </div>
      </div>
    </section>
  )
}
