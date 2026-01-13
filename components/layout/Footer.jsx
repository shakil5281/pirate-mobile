import React from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import LinkedinIcon from '../icons/LinkedinIcon';
import TiktokIcon from '../icons/TiktokIcon';
import InstagramIcon from '../icons/InstagramIcon';
import FacebookIcon from '../icons/FacebookIcon';

export default function Footer() {
  return (
    <footer className="bg-[#15191e] relative">
      {/* Top Section */}
      <div className="py-16">
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* Pirate Mobile Limited Column */}
            <div className="space-y-4">
              <h3 className="text-[18px] font-semibold text-white mb-3">Pirate Mobile Limited</h3>
              <p className="text-gray-300 text-[14px] leading-6">
                Pirate Mobile Limited is a Guernsey-registered company (No. 71908) with its office at Avenue House, St. Julian&apos;s Avenue. St. Peter Port, Guernsey, GY1 1WA.
              </p>

              {/* Social Media Icons */}
              <div className="flex space-x-3 mt-6">
                <div className="group overflow-hidden rounded-full">
                  <Link href="https://www.facebook.com/piratemobileofficial" target="_blank">
                    <FacebookIcon className="text-[#A3A3A3] border border-[#A3A3A3] duration-150 overflow-hidden rounded-full group-hover:bg-secondary cursor-pointer group-hover:border-secondary transition-colors group-hover:text-black" />
                  </Link>
                </div>
                <div className="group overflow-hidden rounded-full">
                  <Link href="https://www.instagram.com/piratemobileofficial" target="_blank">
                    <InstagramIcon className="text-[#A3A3A3] border border-[#A3A3A3] duration-150 overflow-hidden rounded-full group-hover:bg-secondary cursor-pointer group-hover:border-secondary transition-colors group-hover:text-black" />
                  </Link>
                </div>
                <div className="group overflow-hidden rounded-full">
                  <Link href="https://www.linkedin.com/company/pirate-mobile/?originalSubdomain=gg" target="_blank">
                    <LinkedinIcon className="text-[#A3A3A3] border border-[#A3A3A3] duration-150 overflow-hidden rounded-full group-hover:bg-secondary cursor-pointer group-hover:border-secondary transition-colors group-hover:text-black" />
                  </Link>
                </div>
                <div className="group overflow-hidden rounded-full">
                  <Link href="https://www.tiktok.com/@piratemobileofficial" target="_blank">
                    <TiktokIcon className="text-[#A3A3A3] border border-[#A3A3A3] duration-150 overflow-hidden rounded-full group-hover:bg-secondary cursor-pointer group-hover:border-secondary transition-colors group-hover:text-black" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Link Column */}
            <div className="space-y-4">
              <h3 className="text-[18px] font-semibold text-white mb-3">Quick Link</h3>
              <ul className="space-y-3 text-[14px]">
                <li>
                  <Link href="/about-us" className="text-gray-300 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/countries" className="text-gray-300 hover:text-white transition-colors">
                    Countries
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="text-gray-300 hover:text-white transition-colors">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resource Column */}
            <div className="space-y-4">
              <h3 className="text-[18px] font-semibold text-white mb-3">Resource</h3>
              <ul className="space-y-3 text-[14px]">
                <li>
                  <Link href="/compatible-devices" className="text-gray-300 hover:text-white transition-colors">
                    View eSIM-Compatible Devices
                  </Link>
                </li>
                <li>
                  <Link href="/esim/hajj" className="text-gray-300 hover:text-white transition-colors">
                    Hajj eSIM
                  </Link>
                </li>
                <li>
                  <Link href="/esim-guide-landing" className="text-gray-300 hover:text-white transition-colors">
                    eSIM Guide Landing
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-conditions" className="text-gray-300 hover:text-white transition-colors">
                    Terms and Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div className="space-y-4">
              <h3 className="text-[18px] font-semibold text-white mb-3">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#A3A3A3] duration-150 shrink-0" />
                  <Link href="tel:+34655877579" className="text-gray-300 hover:text-white transition-colors text-[14px]">
                    +34655877579
                  </Link>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#A3A3A3] duration-150 shrink-0" />
                  <Link href="mailto:info@piratemobile.gg" className="text-gray-300 hover:text-white transition-colors text-[14px]">
                    info@piratemobile.gg
                  </Link>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#A3A3A3] duration-150 shrink-0 mt-1" />
                  <span className="text-gray-300 text-[14px] leading-6">
                    Avenue House, St. Julian&apos;s Avenue, St. Peter Port, Guernsey, GY1 1WA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Centered round logo overlapping divider */}
      <div className="absolute left-1/2 lg:top-[calc(100%-80px)] -translate-x-1/2 -translate-y-1/2 bg-[#E9E9E9] p-2 rounded-full">
        <div className="bg-[#0e1115] rounded-full p-2 shadow-lg border border-gray-700">
          <NextImage
            src="https://ik.imagekit.io/odc49ttmc/public/logo/main_logo.png?updatedAt=1754489823979"
            alt="Pirate"
            width={96}
            height={96}
            className="rounded-full"
            quality={100}
            priority
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 bg-[#E9E9E9] py-6 pt-20 lg:pt-6">
        <div className="container mx-auto px-6 md:px-8 flex justify-center items-center gap-4 md:flex-row flex-col-reverse md:items-center md:justify-between">
          <p className="text-gray-900 text-[14px] text-center">Copyright © 2025 Pirate Mobile Limited. All right reserved</p>

          {/* Payment Method Logos */}
          <div className="flex items-center gap-2">
            {/* PayPal Logo */}
            <div className="w-14 h-8 rounded flex items-center justify-center">
              <NextImage
                src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Pay/image%208.png?updatedAt=1760259222884"
                alt="PayPal"
                width={50}
                height={30}
                className="object-contain"
                quality={100}
              />
            </div>

            {/* Mastercard Logo */}
            <div className="w-14 h-8 rounded flex items-center justify-center">
              <NextImage
                src="https://ik.imagekit.io/odc49ttmc/public/images/footer/Mastercard_2019_logo.svg?updatedAt=17544898{4087"
                alt="Mastercard"
                width={40}
                height={30}
                className="object-contain"
                quality={100}
              />
            </div>

            {/* VISA Logo */}
            <div className="w-14 h-8 rounded flex items-center justify-center">
              <NextImage
                src="https://ik.imagekit.io/odc49ttmc/public/images/footer/Visa_2021.svg?updatedAt=1754489847884"
                alt="VISA"
                width={40}
                height={30}
                className="object-contain"
                quality={100}
              />
            </div>

            {/* Google Pay Logo */}
            <div className="w-14 h-8 rounded flex items-center justify-center">
              <NextImage
                src="https://ik.imagekit.io/odc49ttmc/public/images/footer/Google_Pay_Logo.svg?updatedAt=1754489841203"
                alt="Google Pay"
                width={40}
                height={30}
                className="object-contain"
                quality={100}
              />
            </div>

            {/* Apple Pay Logo */}
            <div className="w-14 h-8 rounded flex items-center justify-center">
              <NextImage
                src="https://ik.imagekit.io/odc49ttmc/public/images/footer/Apple_Pay_logo.svg?updatedAt=1754489839519"
                alt="Apple Pay"
                width={40}
                height={30}
                className="object-contain"
                quality={100}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
