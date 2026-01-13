'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Wifi, Battery, QrCode, Smartphone, Globe, CheckCircle } from 'lucide-react'
import NextImage from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function ESimAppBanner() {
    const [activeTab, setActiveTab] = useState('Active')
    const pathname = usePathname();
    const isHajjPage = pathname === '/esim/hajj';

    return (
        <div className={cn('mx-4 my-12 lg:my-24')}>
            <div
                className="w-full max-w-6xl 2xl:max-w-7xl  lg:mx-auto flex items-center justify-center relative sm:px-8 lg:px-12 rounded-2xl sm:rounded-3xl lg:rounded-lg overflow-hidden bg-transparent"
                style={{
                    backgroundImage: 'url(https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Pay/appBackground.png?updatedAt=1760442394730)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    minHeight: '400px'
                }}
            >
                <section className="w-full relative z-10 md:py-12 lg:py-16">
                    <div className=" gap-8 lg:gap-12 xl:gap-16">
                        {/* Left Column - Text and Download Options */}
                        <div className="flex-1 space-y-6 sm:space-y-8 lg:space-y-10 text-center lg:text-left">
                            {/* Main Heading */}
                            <div className="space-y-3 sm:space-y-4">
                                <h1 className={cn("text-3xl sm:text-3xl md:text-4xl  font-semibold text-gray-900 leading-tight", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>
                                    Download the App and
                                    <br />
                                    <span className="">Manage Your Plan Easily</span>
                                </h1>

                                <p className={cn("text-sm sm:text-base lg:text-md text-gray-700 max-w-2xl mx-auto lg:mx-0", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>
                                    Get affordable mobile data in 200+ <span className='block lg:inline'> countries, with no roaming fees </span>
                                </p>
                            </div>

                            {/* App Download Buttons */}
                            <div className="flex flex-row sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start items-center">
                                {/* App Store Buttons */}
                                <div className="flex flex-col gap-3 sm:gap-4">
                                    <Link href="#" className="transition-transform hover:scale-105">
                                        <NextImage
                                            src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Pay/Play%20Store.png?updatedAt=1760327345388"
                                            alt="Download on Google Play"
                                            width={140}
                                            height={60}
                                            className="w-32 sm:w-36 lg:w-40 h-auto"
                                        />
                                    </Link>
                                    <Link href="#" className="transition-transform hover:scale-105">
                                        <NextImage
                                            src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Pay/App%20Store.png?updatedAt=1760327345328"
                                            alt="Download on App Store"
                                            width={140}
                                            height={60}
                                            className="w-32 sm:w-36 lg:w-40 h-auto"
                                        />
                                    </Link>
                                </div>

                                {/* QR Code */}
                                <div className="flex justify-center lg:justify-start">
                                    <div className="bg-white p-1 rounded-lg shadow-lg">
                                        <NextImage
                                            src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Pay/pngwing.com%20(7)%202.png?updatedAt=1760420177536"
                                            alt="QR Code for App Download"
                                            width={80}
                                            height={80}
                                            className="w-20 h-20 sm:w-28 sm:h-28 object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Phone Mockup */}
                        <div className="flex-1 lg:flex-none lg:w-1/2 lg:flex justify-center lg:justify-end hidden">
                            <div className="absolute right-0 bottom-0">
                                <NextImage
                                    src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Download-app/Frame%202608713.png?updatedAt=1761121834552"
                                    alt="App Hero Image"
                                    width={574}
                                    height={523}
                                    priority
                                    className="w-64 sm:w-80 md:w-96 lg:w-[470px] xl:w-[500px] 2xl:w-[500px] h-auto object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
