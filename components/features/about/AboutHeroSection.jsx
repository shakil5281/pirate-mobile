"use client"

import React from 'react'
import Image from 'next/image'
import { Check, Globe2, ShieldCheck, Users, Search, Flag } from "lucide-react"

export default function AboutHeroSection() {
    return (
        <section className="relative">
            {/* Background gradient matching the design */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFF7C1] to-white"></div>
            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center h-[500px] lg:h-[600px] 2xl:h-[800px] px-4 max-w-6xl 2xl:max-w-7xl mx-auto">
                {/* Left side: Title & description */}
                <div className="w-full h-full lg:w-1/2 flex flex-col items-center justify-center lg:items-start gap-3">
                    <h1 className="text-[9vw] sm:text-5xl md:text-5xl lg:text-5xl 2xl:text-6xl font-bold leading-tight">
                        <span className="text-slate-900">Empowering Travel</span><br />
                        <span className="text-slate-900">with </span>
                        <span className="text-green-500">Pirate Mobile,</span><br />
                        <span className="text-green-500">Borderless Internet</span>
                    </h1>
                    <p className="text-slate-700 text-base lg:text-md 2xl:text-lg font-normal max-w-md mb-4 leading-relaxed text-center lg:text-left">
                        Experience premium data while traveling the world with our powerful eSIM technology – your smart, seamless solution for borderless mobile internet.
                    </p>
                </div>

                {/* Right side: Two overlapping phones */}
                <div className='hidden lg:block'>
                    <div>
                        <Image
                            src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/about/mobile.png?updatedAt=1760354454398"
                            alt="About Hero"
                            width={500}
                            height={500}
                            className='mx-auto drop-shadow-2xl rounded-2xl w-[270px] sm:w-[350px] md:w-[370px] lg:w-[410px] 2xl:w-[550px] h-auto mb-0'
                            quality={100}
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
