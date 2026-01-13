"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { IconBrandWhatsapp } from '@tabler/icons-react'
import AddressIcon from '@/components/icons/AddressIcon'
import MessageIcon from '@/components/icons/MessageIcon'

export default function ContactInfo() {
  return (
    <div className="h-full md:p-10 bg-transparent border-0 shadow-none md:bg-white/95 md:border md:border-[#FBEBA6] md:rounded-[28px] md:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.25)]">
      <div className="space-y-4 md:space-y-8">
        {/* Our Address */}
        <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-5 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)] md:shadow-none md:border-0 md:bg-transparent md:px-0 md:py-0 md:gap-8">
          <AddressIcon size={40} />
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Our Address</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Avenue House, St. Julians Avenue, ST. Peters Port, Guernsey, GY11WA
            </p>
          </div>
        </div>

        {/* Email Address */}
        <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-5 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)] md:shadow-none md:border-0 md:bg-transparent md:px-0 md:py-0 md:gap-8">
          <MessageIcon size={30} />
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Email Address</h3>
            <p className="text-sm text-slate-600">
              info@piratemobile.gg
            </p>
          </div>
        </div>

        {/* Message us via Chat */}
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)] md:border-0 md:bg-[#F5F5F5] md:rounded-[24px] md:shadow-none md:px-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">Message us via Chat</h3>
          <Button
            onClick={() => window.open('https://wa.me/34655877579', '_blank')}
            className="w-full h-[54px] rounded-full bg-[#34C759] hover:bg-[#2EB24F] text-white font-medium text-base flex items-center justify-center gap-2 transition-colors duration-200"
          >
            <IconBrandWhatsapp className="w-5 h-5" />
            <span>+34 655 87 75 79</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
