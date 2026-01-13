"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Home, Star, Smartphone } from "lucide-react"
import { DeviceCompatibilityDialog } from "@/components/features/compatible-devices/DeviceCompatibilityDialog"

export default function EsimHeroSection({
  countryName = "Belgium",
  countrySlug = "belgium",
  flagUrl = "/flags/belgium.png",
  heroImageUrl = "https://images.unsplash.com/photo-1559113202-c916b8e44373?q=80&w=2070",
  description = "Get an eSIM for Belgium and enjoy reliable and affordable Internet access on your trip.",
  trustpilotRating = 4.9,
  reviewCount = "32K+"
}) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <section className="relative w-full">
        <div className="inset-0 bg-gradient-to-t from-white to-[#FFFBDB]">
          <div className="pt-24 px-4 sm:px-6 md:px-10">
            <div className="max-w-7xl mx-auto pt-4">
              <div className="rounded-full px-4 py-2 w-fit bg-gray-100 animate-pulse h-10"></div>
            </div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
            <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden rounded-2xl bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative w-full">
      {/* Gradient Background */}
      <div className="inset-0 bg-gradient-to-t from-white to-[#FFFBDB]">
        {/* Breadcrumb */}
        <div className="pt-24 px-4 sm:px-6 md:px-10">
          <div className="max-w-7xl mx-auto pt-4">
            <Breadcrumb>
              <BreadcrumbList className=" rounded-full px-4 py-2 w-fit">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/"
                      className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Home className="w-4 h-4" />
                      <span className="sm:inline hidden">Home</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/countries"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Countries
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-gray-900 font-medium">
                    {countryName}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative max-w-6xl 2xl:max-w-7xl  mx-auto px-4 pt-5">
          {/* Hero Background Image */}
          <div className="relative w-full h-64 sm:h-72 md:h-80  overflow-hidden rounded-2xl">
          <Image
              src={heroImageUrl}
              alt={`${countryName} hero`}
              width={1200}
              height={400}
              className="object-cover w-full h-full "
              priority={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              quality={100}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            <div className="absolute top-0 left-0 w-full h-full flex items-end justify-center gap-4 pb-5 md:hidden">
              <div className="flex items-center justify-center">
                <Image
                  src={flagUrl}
                  alt={`${countryName} flag`}
                  width={80}
                  height={80}
                  className="w-12 h-12 rounded-full object-cover border border-white"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">{countryName}</h1>
            </div>
          </div>

          {/* Info Card */}
          <div className="relative hidden md:block -mt-16 sm:-mt-20 md:-mt-16 bg-white rounded-2xl shadow-2xl max-w-5xl mx-auto">
            <div className="flex justify-center items-center flex-row py-4 px-8 gap-6 sm:gap-8">

              {/* Flag */}
              <div className="flex-shrink-0">
                <Image
                  src={flagUrl}
                  alt={`${countryName} flag`}
                  width={80}
                  height={80}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border border-gray-200 shadow-sm"
                />
              </div>

              {/* Country Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {countryName}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Right Side (Trustpilot + CTA) */}
              <div className="flex flex-col w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-gray-200 pt-6 sm:pt-0 sm:pl-8 gap-2">
                {/* TrustPilot Info */}
                <div className="flex flex-row text-center sm:text-right gap-2">
                  <div className="flex flex-col">
                    <div className="flex gap-1">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Star className="w-3.5 h-3.5 text-white fill-white" />
                      </div>
                      <span className="font-semibold text-gray-900">Trustpilot</span>
                    </div>
                    <div className="flex items-center flex-row">
                      <span className="text-lg font-bold text-gray-900">
                        {trustpilotRating.toFixed(1)}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-4 h-4 text-green-500 fill-green-500" />
                        <Star className="w-4 h-4 text-green-500 fill-green-500" />
                        <Star className="w-4 h-4 text-green-500 fill-green-500" />
                        <Star className="w-4 h-4 text-green-500 fill-green-500" />
                        <Star className="w-4 h-4 text-green-500 fill-green-500" />
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 w-full sm:w-auto"
                  >
                    See Reviews
                  </Button>
                </div>

                {/* Device Compatibility */}
                <DeviceCompatibilityDialog>
                  <button
                    type="button"
                    className="group flex flex-row items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-green-600"
                  >
                    <Smartphone className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span className="border-b border-dashed border-gray-400 group-hover:border-green-600">
                      Check Device Compatibility
                    </span>
                  </button>
                </DeviceCompatibilityDialog>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 w-full pt-5 lg:hidden">
            {/* Trustpilot Row */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {/* Trustpilot Star Icon */}
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                className="mr-1"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M14.028 1.875l3.47 7.499 8.175.664c.768.062 1.083 1.02.497 1.501l-6.383 5.209 1.968 7.94c.184.742-.632 1.342-1.289.93l-7.04-4.395-7.025 4.41c-.658.413-1.474-.319-1.29-1.06l1.968-7.925-6.384-5.223c-.586-.48-.271-1.439.497-1.5l8.175-.663 3.473-7.497c.308-.666 1.237-.666 1.545 0z"
                  fill="#07B276"
                />
              </svg>
              <span className="font-semibold text-black text-lg">Trustpilot</span>
              <span className="text-gray-600 ml-1">TrustScore</span>
              <span className="font-semibold text-gray-900 ml-1">4.9</span>
              {/* Yellow star */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="text-[#FFC200] mx-1"
                aria-hidden="true"
              >
                <path d="M10 1.75l2.41 5.16 5.66.46c.53.04.75.7.35 1.04l-4.42 3.6 1.36 5.57c.13.53-.45.95-.93.66l-4.43-2.77-4.41 2.8c-.48.3-1.06-.17-.94-.7l1.37-5.57-4.44-3.62c-.4-.33-.17-1 .36-1.04l5.64-.46L10 1.75z" />
              </svg>
              <Link
                href="https://www.trustpilot.com/review/piratemobile.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 font-semibold ml-2 mr-1 underline underline-offset-2 transition-colors"
              >
                See Reviews &rsaquo;
              </Link>
            </div>
            {/* Device Compatibility Button */}
            <DeviceCompatibilityDialog>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-2 text-base font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="text-[#22223B]"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect x="4" y="2.5" width="12" height="15" rx="3" stroke="#22223B" strokeWidth="1.5" />
                  <rect x="8.25" y="14.75" width="3.5" height="1.5" rx=".75" stroke="#22223B" strokeWidth="1.2" />
                </svg>
                <span>Check Device Compatibility</span>
              </button>
            </DeviceCompatibilityDialog>
          </div>
        </div>
      </div>
    </section>
  )
}
