import React from 'react'

export default function ContactHeroSection() {
  return (
    <section className="relative w-full py-4 pt-32 px-4 sm:px-6 lg:px-8">
      {/* Background gradient matching the design */}
      <div className="absolute inset-0 "></div>
      
      <div className="relative z-10 mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-2">
          Let&apos;s Connect -
        </h1>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-500 mb-6">
          We&apos;re Here to Help!
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mx-auto leading-relaxed">
          Got questions about our eSIM plans? We&apos;re here 24/7 - just send us a message and we&apos;ll reply quickly!
        </p>
      </div>
    </section>
  )
}
