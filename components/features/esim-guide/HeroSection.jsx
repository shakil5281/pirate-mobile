"use client"
import React from 'react'
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[520px] lg:min-h-[600px] 2xl:min-h-[730px] flex  items-center justify-center px-4 pt-14 pb-14 lg:pt-24 lg:pb-0 overflow-hidden">
      {/* Desktop background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'url(https://ik.imagekit.io/odc49ttmc/Pirate-mobile/guide/background-guide.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />


      {/* Content container */}
      <div className="relative z-10 flex w-full max-w-6xl 2xl:max-w-7xl mx-auto h-full">
        <div className="w-full h-full flex flex-col lg:flex-row items-center  justify-between gap-10 lg:gap-12">
          
          {/* Left side: Text & Content */}
          <div className="">
            {/* Main Heading */}
            <h1 className="font-bold text-[32px] sm:text-[38px] lg:text-5xl 2xl:text-[56px] text-slate-900 leading-[1.15] sm:leading-[1.1]">
              Explore New Places,<br />
              Without{' '}
              <span className="text-green-600">Roaming Fees</span>
            </h1>

            {/* Benefits List */}
            <div className="flex flex-col gap-4 w-full max-w-xl">
              <div className="flex items-center gap-3 text-slate-800">
                <Check className="w-5 h-5 text-gray-900 shrink border rounded-full border-gray-900 p-0.5" />
                <span className="text-[15px] sm:text-base lg:text-lg font-medium">
                  Save up to 50% on roaming
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-800">
                <Check className="w-5 h-5 text-gray-900 shrink border rounded-full border-gray-900 p-0.5" />
                <span className="text-[15px] sm:text-base lg:text-lg font-medium">
                  Fast and Reliable Network - 4G/5G in nearly 200 countries
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-800">
                <Check className="w-5 h-5 text-gray-900 shrink border rounded-full border-gray-900 p-0.5" />
                <span className="text-[15px] sm:text-base lg:text-lg font-medium">
                  24/7 Customer Support - on live chat and email
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2 sm:pt-4 w-full">
              <Link href="/countries">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-[#FFDD4D] hover:bg-[#F2CF45] lg:bg-secondary lg:hover:bg-secondary-foreground text-slate-900 font-semibold px-8 py-6 text-lg rounded-full shadow-2xl border border-gray-400"
                >
                  Buy eSim Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side: Visual Element */}
          <div className="w-full lg:w-1/2 lg:flex justify-center lg:justify-end items-center hidden">
            <div className="relative w-full max-w-md lg:max-w-lg 2xl:max-w-xl">
              <Image
                src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/guide/mobile-with-man.png"
                alt="eSIM mobile app preview"
                width={900}
                height={1200}
                className="w-full h-auto"
                priority
                quality={100}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 900px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

