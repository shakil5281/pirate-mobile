"use client"
import React from 'react'
import { Check } from "lucide-react"

export default function WhyESIMSection() {
  const features = [
    {
      title: "Seamless Switching, No Physical SIM",
      description: "eSIM eliminates the need for physical SIM cards, simplifying carrier switching, plan upgrades, and managing multiple lines through QR codes or app entries, without store visits, shipping delays, or hardware swaps."
    },
    {
      title: "Global Coverage, Local Control",
      description: "eSIM's advantages for travelers and remote professionals, allowing users to download local data plans to avoid expensive roaming fees and unreliable connections, and offering global plans for online access in numerous countries."
    },
    {
      title: "Dual SIM Power for Smart Connectivity",
      description: "Modern smartphones with eSIM and physical SIM support dual functionality, enabling users to maintain personal and work numbers on one device, or run local and international plans simultaneously, optimizing cost, coverage, and communication without needing two phones."
    },
    {
      title: "Future-Proof Technology",
      description: "eSIM adoption is accelerating globally, with major carriers, smartphone manufacturers, and IoT developers embracing the technology for its scalability and efficiency. Early adopters will benefit from smoother transitions, better plan options, and cutting-edge connectivity."
    }
  ]

  return (
    <section className="relative w-full py-16 lg:py-24 bg-white">
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-slate-900 mb-4">
            Why eSIM Is Changing the{' '}
            <span className="text-green-600">Way We Connect</span>
          </h2>
          <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
            The way we use mobile networks is evolving—and eSIM technology is at the heart of that transformation.
          </p>
        </div>

        {/* Features Grid - 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-6 lg:p-8 border border-gray-200 hover:shadow-lg transition-all duration-300 relative"
            >
              {/* Green checkmark icon */}
              <div className="absolute top-6 left-6 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              
              {/* Content */}
              <div className="mt-10">
                <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-base lg:text-lg text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section - Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="text-slate-600">
            <p className="text-base lg:text-lg leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p className="text-base lg:text-lg leading-relaxed mt-4">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
            </p>
          </div>
          <div className="text-slate-600">
            <p className="text-base lg:text-lg leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

