import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function EuropeHeroSection() {
  return (
    <section
      className="relative"
      style={{ 
        backgroundImage: 'url(https://ik.imagekit.io/odc49ttmc/Pirate-mobile/europe/Content%20Container.png?updatedAt=1760887177453)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Hero Content */}
      <div className="relative z-20 w-full max-w-6xl 2xl:max-w-7xl px-4 flex flex-col lg:flex-row items-center justify-between mx-auto h-fit">
        {/* Textual Content */}
        <div className="flex flex-col justify-center items-center lg:items-start h-[600px] lg:h-screen 2xl:h-[740px]">
          <h1 className="text-white text-4xl md:text-4xl lg:text-5xl 2xl:text-6xl font-semibold leading-14 mb-6 max-w-2xl md:max-w-3xl w-full text-center lg:text-left">
            Best eSIM for{' '} <br />
            <span className="text-primary">Europe </span> - Travel Smart
            <br />
            {' '} with Pirate Mobile
          </h1>
          <p className="mb-7 text-white text-base md:text-lg font-medium max-w-2xl text-center lg:text-left">
            Enjoy seamless connectivity across Europe with affordable, fast, and reliable eSIM plans data only. Enjoy borderless data in 34 EU countries with one eSIM – fast, reliable, affordable, no KYC required.
          </p>
          <Link
            href="#plans"
            className="rounded-full px-20 lg:px-14 py-3 bg-white font-semibold text-lg shadow-lg hover:bg-[#e2e2e2] transition"
          >
            Buy eSIM Now
          </Link>
        </div>

        {/* Phone Mockup */}
        <div className="absolute right-0 bottom-0 hidden lg:block">
          <Image
          src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/europe/06%202.png?updatedAt=1760887126531"
          alt="eSIM plans phone screen"
          width={600}
          height={1000}
          className="object-cover size-100 2xl:size-135"
          priority
        />
        </div>
      </div>
    </section>
  );
}
