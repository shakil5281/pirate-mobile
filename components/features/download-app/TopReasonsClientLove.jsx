'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

export default function TopReasonsClientLove() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [itemsPerView, setItemsPerView] = useState(3)

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1) // Mobile: 1 item
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2) // Tablet: 2 items
      } else {
        setItemsPerView(3) // Desktop: 3 items
      }
    }

    handleResize() // Set initial value
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const slides = [
    {
      title: "Pirate Mobile App Now Available on iOS and Android",
      content: (
        <div className="flex justify-center">
          <Image
            src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Download-app/Block%203.png?updatedAt=1760329494934"
            alt="Pirate Mobile App Features"
            width={400}
            height={300}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto"
          />
        </div>
      )
    },
    {
      title: "Choose Your Destination Across 200+ Countries",
      content: (
        <div className="flex justify-center">
          <Image
            src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Download-app/Block%203.png?updatedAt=1760329494934"
            alt="Destination Selection"
            width={400}
            height={300}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto"
          />
        </div>
      )
    },
    {
      title: "Pirate Mobile Offers Flexible Data Plans in 200+ Destinations",
      content: (
        <div className="flex justify-center">
          <Image
            src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Download-app/Block%203.png?updatedAt=1760329494934"
            alt="Data Plans"
            width={400}
            height={300}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto"
          />
        </div>
      )
    },
    {
      title: "Instant eSIM Activation in Just 3 Steps",
      content: (
        <div className="flex justify-center">
          <Image
            src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Download-app/Block%203.png?updatedAt=1760329494934"
            alt="eSIM Activation"
            width={400}
            height={300}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto"
          />
        </div>
      )
    },
    {
      title: "Stay Connected with Global Coverage",
      content: (
        <div className="flex justify-center">
          <Image
            src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Download-app/Block%203.png?updatedAt=1760329494934"
            alt="Global Coverage"
            width={400}
            height={300}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto"
          />
        </div>
      )
    }
  ]

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const maxSlides = slides.length - itemsPerView + 1
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % maxSlides)
    }, 4000) // Auto-slide every 4 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, slides.length, itemsPerView])


  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  return (
    <section className="py-16 bg-green-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Client Avatars - Overlapping Design with Staggered Position */}
          <div className="flex justify-center items-center mb-8">
            <div className="flex items-center">
              {/* Avatar 1 - Top */}
              <div className="relative w-12 h-12 2xl:w-14 2xl:h-14 rounded-full border-3 border-green-50 overflow-hidden  z-10">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format"
                  alt="Happy client 1"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Avatar 2 - Bottom */}
              <div className="relative w-12 h-12 2xl:w-14 2xl:h-14 rounded-full border-3 border-green-50 overflow-hidden  -ml-4 lg:-ml-4 z-20">
                <Image
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&auto=format"
                  alt="Happy client 2"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Avatar 3 - Top */}
              <div className="relative w-12 h-12 2xl:w-14 2xl:h-14 rounded-full border-3 border-green-50 overflow-hidden  -ml-4 lg:-ml-4 z-30">
                <Image
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&auto=format"
                  alt="Happy client 3"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Plus Button - Bottom */}
              <div className="relative w-12 h-12 2xl:w-14 2xl:h-14 rounded-full border-3 border-green-50 bg-secondary flnter justify-center -ml-4 lg:-ml-4 z-50 hover:bg-secondary-foreground transition-colors duration-300 cursor-pointer">
                <span className="text-gray-900 font-bold text-3xl sm:text-4xl">+</span>
              </div>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl 2xl:text-5xl font-semibold mb-6 max-w-3xl mx-auto">
            Top Reasons Why{' '}
            <span className="text-green-600">32,000+</span>{' '}
            Clients Love Using Pirate Mobile eSIM
          </h2>
        </div>

        {/* Carousel - Show 3 items at a time with auto-slide */}
        <div className="max-w-6xl 2xl:max-w-7xl mx-auto">
          {/* Carousel Container */}
          <div className="relative">
            {/* Slide Content - Fully responsive design */}
            <div
              className="overflow-hidden"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * (100 / itemsPerView)}%)`
                }}
              >
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 ${itemsPerView === 1 ? 'w-full' :
                        itemsPerView === 2 ? 'w-1/2' :
                          'w-1/3'
                      }`}
                  >
                    <div className={`${itemsPerView === 1 ? 'px-2' :
                        itemsPerView === 2 ? 'px-3' :
                          'px-4'
                      }`}>
                      <div className="flex justify-center">
                        {slide.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination Dots - Interactive navigation */}
          <div className="flex justify-center items-center space-x-2 mt-4 sm:mt-6 md:mt-8">
            {Array.from({ length: slides.length - itemsPerView + 1 }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${index === currentSlide
                    ? 'w-6 sm:w-8 h-2 sm:h-3 bg-green-500 rounded-full'
                    : 'w-2 sm:w-3 h-2 sm:h-3 bg-gray-300 rounded-full hover:bg-gray-400'
                  }`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
