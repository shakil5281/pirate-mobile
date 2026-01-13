"use client"

import React, { useEffect } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import NextImage from "next/image"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { MoveRight } from "lucide-react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

const testimonials = [
  {
    name: "Chayakon",
    country: "Thailand",
    avatar: "https://ik.imagekit.io/odc49ttmc/Pirate-mobile/avater/avater.jpg?updatedAt=1760182205655",
    text: "This was just what I want, it not the first time that I used Pirate Mobile eSIM. I will definitely return next time for traveling to Taiwan tw. Thx",
    location: "Taiwan",
    date: "28th July 2025",
    rating: 5
  },
  {
    name: "YaYa Nang NaNa",
    country: "Thailand",
    avatar: "https://ik.imagekit.io/odc49ttmc/Pirate-mobile/avater/avater.jpg?updatedAt=1760182205655",
    text: "มันใช้ดีมาก ฉันเคยใช้ในเมืองไทยและไต้หวันมาแล้ว",
    location: "Thailand",
    date: "15th August 2025",
    rating: 5
  },
  {
    name: "Anna de Groot",
    country: "Netherlands",
    avatar: "https://ik.imagekit.io/odc49ttmc/Pirate-mobile/avater/avater.jpg?updatedAt=1760182205655",
    text: "Just what I needed!",
    location: "Europe",
    date: "22nd September 2025",
    rating: 5
  },
  {
    name: "宋干蘭",
    country: "Taiwan",
    avatar: "https://ik.imagekit.io/odc49ttmc/Pirate-mobile/avater/avater.jpg?updatedAt=1760182205655",
    text: "I love Pirate Mobile so much good choice for travelling Good Good Good",
    location: "Taiwan",
    date: "5th October 2025",
    rating: 5
  },
  {
    name: "Lake Noochalung",
    country: "Thailand",
    avatar: "https://ik.imagekit.io/odc49ttmc/Pirate-mobile/avater/avater.jpg?updatedAt=1760182205655",
    text: "Great Service 👍 Never had an issue with the service during time for travel. It was smooth coverage. Thanks",
    location: "Thailand",
    date: "12th October 2025",
    rating: 5
  }
]

function Stars({ count = 5 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "text-secondary text-sm",
            i < count ? "opacity-100" : "opacity-30"
          )}
        >
          ★
        </span>
      ))}
    </div>
  )
}

function Card({ t, isHajjPage }) {
  return (
    <div className={cn("w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm h-full min-h-[280px] flex flex-col", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>
      {/* Profile Section */}
      <div className="flex items-center gap-3 mb-4">
        <NextImage
          src={t.avatar}
          alt={t.name}
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
        <div>
          <p className={cn("text-sm font-semibold text-gray-900", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>{t.name}</p>
          <p className={cn("text-xs text-gray-500", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>From {t.country}</p>
        </div>
      </div>

      {/* Quote Section */}
      <div className="flex-1 mb-4">
        <p className={cn("text-sm leading-relaxed text-gray-700", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>&quot;{t.text}&quot;</p>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto flex items-center justify-between">
        <div className="text-xs">
          <div className={cn("font-medium text-gray-900", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>{t.location}</div>
          <div className={cn("text-gray-500 mt-1", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>{t.date}</div>
        </div>
        <Stars count={t.rating} />
      </div>
    </div>
  )
}

export default function Testimonials() {
  const plugins = [Autoplay({ delay: 4000, stopOnInteraction: false })]
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, plugins)
  const pathname = usePathname();
  const isHajjPage = pathname === '/esim/hajj';

  useEffect(() => {
    // no-op: ensure embla attaches once mounted
  }, [])

  return (
    <section className={cn("bg-[#F6FFF8] py-12 sm:py-16", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col justify-center items-center lg:flex-row lg:items-start lg:justify-between mb-8">
          <div className="lg:flex-1">
            <h2 className={cn("text-[32px] sm:text-[40px] lg:text-[48px] font-semibold leading-tight text-center lg:text-left", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>
              Loved by <br className="lg:hidden block" /> <span className="text-green-600">Thousands of</span><br className="hidden lg:block" />
              <span className="text-green-600">Travelers</span>
            </h2>
          </div>
          <div className="mt-4 lg:mt-0 lg:max-w-lg">
            <p className={cn("text-gray-600 text-sm sm:text-base text-center lg:text-left", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>
              Here the beautiful story from our worldwide customer that have been travelling around the world without lost connections.
            </p>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="mb-8">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-4 md:gap-8 px-6">
              {testimonials.map((t, idx) => (
                <div key={idx} className="flex-none w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
                  <Card t={t} isHajjPage={isHajjPage} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-0 md:border px-8 py-4 rounded-full justify-center items-center">
          <div className="items-center gap-4 hidden md:flex">
            <div className="flex items-center gap-2">
              <Image
                src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/trustpilot-seeklogo%201.svg?updatedAt=1761623058415"
                alt="Trustpilot"
                width={24}
                height={24}
                className="w-36 h-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("text-gray-900 font-medium", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>Ratings 4.9</span>
              <span className="text-secondary text-lg">★</span>
            </div>
          </div>
          <Link href="https://www.trustpilot.com/review/www.piratemobile.gg" target="_blank" className={cn("inline-flex items-center justify-center rounded-full cursor-pointer text-white text-sm font-medium px-6 py-3 transition-colors bg-secondary font-manrope text-black", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>
            Read More User Stories
            <span className="ml-2"><MoveRight strokeWidth={2} className="w-4 h-4" /></span>
          </Link>
        </div>
      </div>
    </section>
  )
}


