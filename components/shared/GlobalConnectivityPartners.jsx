"use client"
import React from 'react'
import NextImage from 'next/image'
import Image from 'next/image'

const partners = [
  {
    name: "T-Mobile",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Deutsche_Telekom_2022.svg",
    alt: "T-Mobile Logo"
  },
  {
    name: "Maroc Telecom",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/49/Maroc_Telecom.svg",
    alt: "Maroc Telecom Logo"
  },
  {
    name: "Telefonica",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/79/Telef%C3%B3nica_2021_logo.svg",
    alt: "Telefonica Logo"
  },
  {
    name: "TechRadar",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/21/TechRadar_logo_%282023%29.svg",
    alt: "TechRadar Logo"
  },
  {
    name: "Bouygues",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Bouygues_Telecom_201x_logo.svg",
    alt: "Bouygues Logo"
  },
  {
    name: "Lonely Planet",
    logo: "https://upload.wikimedia.org/wikipedia/en/c/cb/Lonely_Planet.svg",
    alt: "Lonely Planet Logo"
  },
  {
    name: "WINDTRE",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Wind_Tre_logo_2020.svg",
    alt: "WINDTRE Logo"
  },
  {
    name: "Etisalat",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Eand_Logo_EN.svg",
    alt: "Etisalat Logo"
  },
  {
    name: "Verizon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Verizon_Logo_2000_to_2015.svg",
    alt: "Verizon Logo"
  },
  {
    name: "AT&T",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/31/AT%26T_logo_2016.svg",
    alt: "AT&T Logo"
  },
]

export default function GlobalConnectivityPartners() {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="font-semibold text-lg text-gray-900 mb-4">
            Our Global Connectivity Partners
          </h2>
        </div>

        {/* Infinite Scroll Container */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll">
            {/* First set of logos */}
            <div className="flex items-center justify-center gap-16 px-8 shrink-0">
              {partners.map((partner, index) => (
                <div
                  key={`first-${index}`}
                  className="shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="flex items-center justify-center w-48 h-24 p-6">
                    <Image
                      src={partner.logo}
                      alt={partner.alt}
                      width={160}
                      height={64}
                      style={{ height: 'auto' ,width: 'auto'}}
                      className="max-h-16 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Second set of logos for seamless loop */}
            <div className="flex items-center justify-center gap-16 px-8 shrink-0">
              {partners.map((partner, index) => (
                <div
                  key={`second-${index}`}
                  className="shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="flex items-center justify-center w-48 h-24 p-6">
                    <Image
                      src={partner.logo}
                      alt={partner.alt}
                      width={160}
                      height={64}
                      style={{ height: 'auto' ,width: 'auto'}}
                      className="max-h-16 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-white to-transparent"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-white to-transparent"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  )
}
