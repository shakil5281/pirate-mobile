"use client"
import React, { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "What devices support eSIM?",
    answer: "Most modern smartphones, tablets, and some laptops support eSIM. Check your device settings to see if eSIM functionality is available before purchasing."
  },
  {
    question: "How does an eSIM work?",
    answer: "An eSIM is a digital SIM embedded in your device that lets you activate a mobile plan without a physical SIM card. You can download and activate plans through QR codes or app installations."
  },
  {
    question: "Is my phone compatible with eSIM?",
    answer: "Many recent iOS and Android devices support eSIM. Please check your device model and carrier settings to confirm compatibility with your specific device."
  },
  {
    question: "Can I have an eSIM and a physical SIM at the same time?",
    answer: "Yes, many devices support Dual SIM functionality, allowing both an eSIM and a physical SIM to be active simultaneously. This is perfect for maintaining separate personal and work numbers, or combining local and international plans."
  },
  {
    question: "How do I activate an eSIM?",
    answer: "Purchase a plan, scan the provided QR code or follow the app instructions, then enable the eSIM in your device settings. The process typically takes just a few minutes."
  },
  {
    question: "Can I switch an eSIM to a different phone?",
    answer: "Some eSIMs can be transferred depending on the carrier and plan policy. Remove or deactivate on the old device before activating on the new one. Check with your provider for specific transfer policies."
  }
]

function NumberBadge({ number, isActive }) {
  return (
    <div className={`flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-sm font-semibold mr-3 md:mr-4 ${
      isActive 
        ? "bg-green-600 text-white" 
        : "bg-green-100 text-green-700"
    }`}>
      {number}
    </div>
  )
}

export default function ESIMGuideFAQ() {
  const [openItem, setOpenItem] = useState("item-0") // First item expanded by default

  return (
    <section className="relative w-full py-16 lg:py-24" style={{ backgroundColor: '#f0f8f0' }}>
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-slate-900 mb-4">
            Frequently Asked{' '}
            <span className="text-green-600">Questions</span>
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          <Accordion 
            type="single" 
            collapsible 
            value={openItem} 
            onValueChange={setOpenItem}
            className="space-y-4"
          >
            {faqs.map((faq, index) => {
              const itemId = `item-${index}`
              const isActive = openItem === itemId

              return (
                <AccordionItem 
                  key={itemId} 
                  value={itemId} 
                  className="border-0"
                >
                  <div className={`rounded-xl bg-white transition-all ${
                    isActive 
                      ? "border-2 border-slate-800 shadow-md" 
                      : "border border-gray-200 shadow-sm"
                  }`}>
                    <AccordionTrigger className="px-4 sm:px-5 lg:px-6 py-5 lg:py-6 no-underline hover:no-underline [&>svg]:hidden">
                      <div className="flex items-start w-full">
                        <NumberBadge number={index + 1} isActive={isActive} />
                        <span className="flex-1 font-semibold text-base lg:text-lg text-slate-900 text-left leading-relaxed">
                          {faq.question}
                        </span>
                        <div className="flex-shrink-0 ml-4">
                          {isActive ? (
                            <ChevronUp className="w-5 h-5 text-slate-700" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-700" />
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 sm:px-5 lg:px-6 pb-5 lg:pb-6">
                      <div className="ml-12 md:ml-14 lg:border-l-2 border-gray-300 pl-4 lg:pl-6">
                        <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </AccordionContent>
                  </div>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

