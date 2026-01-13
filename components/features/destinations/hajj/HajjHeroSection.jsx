import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function HajjHeroSection() {
  return (
    <section
      className="relative"
      style={{ 
        backgroundImage: 'url(https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Hajj/Content%20Container.png?updatedAt=1760589421160)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Hero Content */}
      <div className="relative z-20 w-full  h-[500px] sm:h-[600px] 2xl:h-[740px] flex justify-center items-end sm:max-w-md pb-12 sm:pb-20 lg:pb-0 px-4 md:px-8 lg:max-w-6xl 2xl:max-w-7xl lg:justify-start lg:items-center mx-auto">
        {/* Textual Content */}
        <div className="">
          <h1 className="text-white text-3xl sm:text-4xl md:text-4xl 2xl:text-5xl font-semibold 2xl:font-bold leading-tight mb-6 max-w-xl font-[family-name:var(--font-philosopher)]">
            Stay Connected During{' '}
            <span className="text-[#CBC72C]">Umrah &amp; Hajj</span>{' '}
            With an
            <br className="hidden md:block" />
            <span className="text-[#32C38C] font-bold"> Affordable Saudi Arabia eSIM</span>
          </h1>
          <ul className="mb-7 space-y-3 text-white text-base md:text-lg font-normal font-[family-name:var(--font-philosopher)]">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 border border-white rounded-full p-0.5" />
              Active within 5 minutes
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 border border-white rounded-full p-0.5" />
              Enjoy Uninterrupted Data in Saudi Arabia
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 border border-white rounded-full p-0.5" />
              Stay Connected Everywhere
            </li>
          </ul>
          <Link
            href="#plans"
            className="inline-block rounded-full px-8 py-3 bg-white text-[#0C5341] font-bold text-md shadow-lg hover:bg-[#e2e2e2] transition"
          >
            Buy eSIM Now
          </Link>
        </div>

        {/* Phone Mockup */}
        <div className="absolute right-0 bottom-0 hidden lg:block">
          <Image
          src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Hajj/hajjHeroSectionmobile_URwRxCd2d?updatedAt=1761820832408"
          alt="eSIM plans phone screen"
          width={800}
          height={1000}
          className="object-cover w-[700px] h-fit 2xl:w-[800px]"
          quality={100}
          priority
        />
        </div>
      </div>
    </section>
  );
}
