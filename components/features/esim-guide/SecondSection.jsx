"use client"
import React from 'react'
import { Globe, Zap, Shield, Headphones, Smartphone, Wifi } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'

export default function SecondSection() {
  const features = [
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Connect seamlessly in over 200 countries with our extensive network coverage. No matter where you travel, stay connected.",
      color: "text-blue-600 bg-blue-50"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Experience blazing-fast 4G/5G speeds wherever you go. Stream, browse, and work without interruptions.",
      color: "text-yellow-600 bg-yellow-50"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your data is protected with enterprise-grade security. Trust in our reliable network infrastructure.",
      color: "text-green-600 bg-green-50"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Our dedicated support team is available around the clock via live chat and email to assist you anytime.",
      color: "text-purple-600 bg-purple-50"
    },
    {
      icon: Smartphone,
      title: "Easy Setup",
      description: "Install and activate your eSIM in minutes. No physical SIM cards needed, just scan and connect.",
      color: "text-orange-600 bg-orange-50"
    },
    {
      icon: Wifi,
      title: "Affordable Plans",
      description: "Choose from flexible data plans that fit your travel needs and budget. Save up to 50% compared to roaming.",
      color: "text-pink-600 bg-pink-50"
    }
  ]

  return (
    <section className="relative w-full py-16 lg:py-24 bg-white">
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-slate-900 mb-4">
            Why Choose <span className="text-green-600">Pirate Mobile</span>
          </h2>
          <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
            Experience the future of mobile connectivity with our comprehensive eSIM solutions designed for modern travelers.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Card 
                key={index} 
                className="border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-green-300"
              >
                <CardHeader>
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-slate-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional CTA Section */}
        <div className="mt-16 lg:mt-20 text-center">
          <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl p-8 lg:p-12 border border-green-100">
            <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
              Get your eSIM today and experience seamless connectivity across the globe. No contracts, no hidden fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/countries"
                className="inline-flex items-center justify-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all hover:scale-105 shadow-lg"
              >
                Browse Countries
              </a>
              <a 
                href="/download-app"
                className="inline-flex items-center justify-center px-8 py-3 bg-white hover:bg-gray-50 text-green-600 font-semibold rounded-full border-2 border-green-600 transition-all hover:scale-105"
              >
                Download App
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

