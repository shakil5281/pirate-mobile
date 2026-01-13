'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Globe, Smartphone, CheckCircle, Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AppHeroSection() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <div className="min-h-screen pt-16 2xl:min-h-[799px] flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, rgba(255, 253, 233, 0.9) 0%, rgba(255, 248, 186, 0.63) 40%, rgba(255, 249, 205, 0.28) 61%, rgba(255, 253, 233, 0.9) 78%, rgba(255, 253, 233, 1) 100%)'
        }}>
            {/* Hero Section */}
            <section className="max-w-full md:max-w-6xl 2xl:max-w-7xl  mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Text and CTAs */}
                    <div className="space-y-8">
                        {/* Main Heading */}
                        <div className="space-y-4">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl 2xl:text-[64px] font-semibold 2xl:font-bold leading-tight text-center lg:text-left">
                                <span className="text-gray-900">Best eSIM App for</span>
                                <br />
                                <span className="text-green-600">International Travel</span>
                            </h1>

                            <p className="text-base sm:text-md text-gray-600 max-w-lg 2xl:text-[20px] 2xl:font-medium text-center lg:text-left">
                                Pirate Mobile provides prepaid travel data across 200+ countries.
                                Enjoy a steady, affordable internet connection anywhere you travel.
                            </p>
                        </div>

                        {/* App Download Buttons */}
                        <div className="flex flex-row gap-4 justify-center lg:justify-start">
                            <Link href="/">
                                <Image
                                    src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Pay/Play%20Store.png?updatedAt=1760327345388"
                                    alt="Google Play"
                                    width={197}
                                    height={59}
                                    className=' lg:w-[150px] lg:h-[50px] 2xl:w-[197px] 2xl:h-[59px] w-[140px] h-[42px]'
                                />
                            </Link>
                            <Link href="/">
                                <Image
                                    src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Pay/App%20Store.png?updatedAt=1760327345328"
                                    alt="Google Play"
                                    width={197}
                                    height={59}
                                    className=' lg:w-[150px] lg:h-[50px] 2xl:w-[197px] 2xl:h-[59px] w-[140px] h-[42px]'
                                />
                            </Link>


                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-2 justify-center lg:justify-start">
                            <div className="flex items-center space-x-1">
                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            </div>
                            <span className="text-gray-700 font-medium">4.9 From 32K+ Reviews</span>
                        </div>
                    </div>

                    {/* Right Column - Phone Mockups */}
                    <div className='flex justify-center lg:justify-center'>
                        <Image
                            src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Download-app/appDownloadScan.png?updatedAt=1760331255483"
                            alt="App Hero Image"
                            width={574}
                            height={523}
                            priority
                            className='size-90  2xl:w-[574px] 2xl:h-[523px] object-contain'
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}
