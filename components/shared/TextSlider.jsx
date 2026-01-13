"use client"

import { useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

export default function TextSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false })
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    onSelect()
  }, [emblaApi])

  const slides = [
    {
      title: "Get data packs at affordable rate in 200+ countries and regions.",
      subtitle:
        "Follow your plan by keeping track of your spending throughout the month.",
    },
    {
      title: "Instant eSIM activation with simple steps.",
      subtitle:
        "Scan, activate, and start roaming without visiting any physical store.",
    },
    {
      title: "Keep your primary number active while you travel.",
      subtitle:
        "Use eSIM for data while staying reachable on your main SIM.",
    },
  ]

  return (
    <div className="relative w-full overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {slides.map((s, idx) => (
          <div className="min-w-0 shrink-0 grow-0 basis-full px-8" key={idx}>
            <h2 className="text-2xl font-bold text-black mb-2 text-center">
              {s.title}
            </h2>
            <p className="text-black text-sm mb-8 text-center">
              {s.subtitle}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-2">
        {slides.map((_, i) => (
          <span
            key={i}
            className={
              i === selectedIndex
                ? "w-2 h-2 bg-green-500 rounded-full"
                : "w-2 h-2 bg-gray-300 rounded-full"
            }
          />
        ))}
      </div>
    </div>
  )
}


