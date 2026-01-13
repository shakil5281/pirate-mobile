"use client"

import React, { useEffect, useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const defaultFaqs = [
  {
    q: "What devices support eSIM?",
    a: "Most modern smartphones, tablets, and some laptops support eSIM. Check your device settings to see if eSIM functionality is available before purchasing.",
  },
  {
    q: "How does an eSIM work?",
    a: "An eSIM is a digital SIM embedded in your device that lets you activate a mobile plan without a physical SIM card.",
  },
  {
    q: "Is my phone compatible with eSIM?",
    a: "Many recent iOS and Android devices support eSIM. Please check your device model and carrier settings.",
  },
  {
    q: "Can I have an eSIM and a physical SIM at the same time?",
    a: "Yes, many devices support Dual SIM functionality, allowing both an eSIM and a physical SIM to be active.",
  },
  {
    q: "How do I activate an eSIM?",
    a: "Purchase a plan, scan the provided QR code or follow the app instructions, then enable the eSIM in your device settings.",
  },
  {
    q: "Can I switch an eSIM to a different phone?",
    a: "Some eSIMs can be transferred depending on the carrier and plan policy. Remove or deactivate on the old device before activating on the new one.",
  },
]

function NumberBadge({ index, active }) {
  return (
    <span className={
      `inline-flex items-center justify-center rounded-full text-[13px] font-semibold mr-3 ` +
      `${active ? "bg-green-600 text-white" : "bg-green-100 text-green-700"} ` +
      `size-8 md:size-9`
    }>
      {index}
    </span>
  )
}

export default function Faq({ countrySlug, faqs }) {
  const [open, setOpen] = useState("item-0")
  const [items, setItems] = useState(defaultFaqs)
  const pathname = usePathname();
  const isHajjPage = pathname === '/esim/hajj';

  useEffect(() => {
    // If faqs prop is provided, use it directly
    if (faqs && Array.isArray(faqs)) {
      const formattedFaqs = faqs.map(f => ({ q: f.question, a: f.answer }))
      setItems(formattedFaqs)
      return
    }

    let active = true
    async function load() {
      if (!countrySlug) {
        setItems(defaultFaqs)
        return
      }
      try {
        const res = await fetch(`/api/country-content/${countrySlug}`, { cache: 'no-store' })
        if (!res.ok) {
          setItems(defaultFaqs)
          return
        }
        const data = await res.json()
        const faqs = Array.isArray(data?.faqs)
          ? data.faqs.map(f => ({ q: f.question, a: f.answer }))
          : defaultFaqs
        if (active) setItems(faqs)
      } catch (_) {
        if (active) setItems(defaultFaqs)
      }
    }
    load()
    return () => { active = false }
  }, [countrySlug, faqs])
  return (
    <section className={cn("bg-white py-12 sm:py-16", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className={cn("text-center text-[28px] leading-[34px] sm:text-[32px] sm:leading-[40px] font-bold", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>
          Frequently Asked <span className="text-green-600">Questions</span>
        </h2>

        <div className="mt-6">
          <Accordion value={open} onValueChange={setOpen} type="single" collapsible className="space-y-4">
            {items.map((item, idx) => {
              const id = `item-${idx}`
              const active = open === id
              return (
                <AccordionItem key={id} value={id} className="border-0">
                  <div className={`rounded-[16px] bg-white shadow-sm transition-colors ` +
                    `${active ? "border-2 border-[#35B34B]" : "border border-[#E8E8E8]"}`}>
                    <AccordionTrigger className="px-4 sm:px-5 py-5 no-underline hover:no-underline cursor-pointer">
                      <div className="flex md:items-start items-center">
                        <div className="flex-shrink-0 hidden md:block">
                          <NumberBadge index={idx + 1} active={active} />
                        </div>
                        <span className={cn(`font-semibold text-[16px] pt-1.5 leading-6 ${active ? "text-[#0b1221]" : "text-[#0b1221]"}`, isHajjPage && "font-[family-name:var(--font-philosopher)]")}>
                          {item.q}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="md:px-4 sm:px-5 pt-0 lg:pl-12">
                      <div className={cn("mt-2 lg:border-l-2 border-[#8F9BAF] pl-4 text-[14px] leading-6 text-gray-700", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>
                        {item.a}
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


