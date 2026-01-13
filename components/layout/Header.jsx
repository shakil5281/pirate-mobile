"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { Menu, X, PhoneCall, User, LogOut, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CurrencySelector from "@/components/layout/currency-selector"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import NextImage from 'next/image'
import { IconAlignJustified } from '@tabler/icons-react'
import { useAuth } from '@/contexts/AuthContext'
import { useSignOut } from '@/hooks/useSignOut'
import { toast } from 'sonner'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Countries', href: '/countries' },
  { label: 'Download App', href: '/download-app' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Contact us', href: '/contact-us' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(true)
  const [selectedCurrency, setSelectedCurrency] = useState({
    code: 'USD',
    name: 'US Dollar',
    country: 'US',
    symbol: '$'
  })
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { logout, loading: logoutLoading } = useSignOut()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if current page has hero section (home, countries, about-us, download-app, contact-us, blog, faq, privacy-policy, terms-conditions)
  // Support dynamic country slug pages (e.g., /esim/france, /esim/spain, etc.)
  const hasHero = mounted && (
    pathname === '/' ||
    pathname === '/countries' ||
    pathname === '/about-us' ||
    pathname === '/download-app' ||
    pathname === '/contact-us' ||
    pathname === '/blog' ||
    pathname === '/faq' ||
    pathname === '/privacy-policy' ||
    pathname === '/terms-conditions' ||
    pathname === '/faqs' ||
    pathname === '/esim-guide-landing' ||
    pathname === '/compatible-devices' ||
    pathname.startsWith('/esim/') ||
    pathname.startsWith('/checkout/') ||
    pathname.startsWith('/blog/')
  )

  // Check if current page is Hajj page for special styling
  const isHajjPage = mounted && pathname === '/esim/hajj'

  // Check if current page is Europe page for special styling
  const isEuropePage = mounted && pathname === '/esim/europe'

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency)
    // Here you can add logic to update prices, API calls, etc.
    // Currency changed to: ${currency}
  }

  const handleSignOut = async () => {
    const result = await logout()
    if (result.success) {
      toast.success('Signed out successfully')
      setOpen(false) // Close mobile menu if open
      router.push('/')
    } else {
      toast.error(result.error || 'Failed to sign out')
    }
  }

  return (
    <header className={`z-50 w-full ${hasHero ? 'absolute top-10 left-0 bg-transparent' : 'relative bg-white border-gray-200'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4 px-4 sm:px-6 lg:px-4 xl:px-0 py-4">
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <NextImage
            src="/main_logo.png"
            alt="Pirate Mobile"
            width={300}
            height={300}
            className="size-16 md:size-20"
            quality={90}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:gap-2 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`rounded-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-medium transition-colors ${isActive
                  ? (isHajjPage || isEuropePage)
                    ? 'bg-white/20 text-white'
                    : 'bg-[#E7F2CB] text-[#35B34B]'
                  : (isHajjPage || isEuropePage)
                    ? 'text-white hover:text-white hover:bg-white/10'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-green-500/5'
                  }`}>
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right: currency, whatsapp, sign in, burger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Selector - Hidden on very small screens */}
          <div className="hidden sm:block">
            <CurrencySelector
              selectedCurrency={selectedCurrency}
              onCurrencyChange={handleCurrencyChange}
              whiteText={isHajjPage || isEuropePage}
            />
          </div>

          {/* WhatsApp Contact Button - Hidden on small screens */}
          <Link
            href="https://wa.me/34655877579"
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden md:flex items-center gap-2 rounded-full border px-5 sm:px-6 py-1.5 sm:py-2 transition-colors ${(isHajjPage || isEuropePage)
              ? 'border-white text-white hover:bg-white/10'
              : 'border-gray-800 text-gray-700'
              }`}
            title="WhatsApp Contact"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
            <span className="text-xs sm:text-sm font-medium hidden xl:inline">+34 655 87 75 79</span>
          </Link>

          {/* Auth Buttons - Hidden on small screens */}
          {!authLoading && (
            <>
              {isAuthenticated ? (
                // Avatar Dropdown Menu (when logged in)
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`flex items-center justify-center rounded-full p-1 border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${(isHajjPage || isEuropePage)
                          ? 'hover:bg-white/10 focus:ring-white/50'
                          : 'hover:bg-gray-100 focus:ring-green-500'
                          }`}
                        title={user?.email}
                      >
                        {user?.photoURL ? (
                          <NextImage
                            src={user.photoURL}
                            alt={user?.displayName || user?.email || 'User'}
                            width={40}
                            height={40}
                            className="rounded-full w-8 h-8 sm:w-10 sm:h-10 object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center text-gray-900 font-bold text-sm sm:text-base">
                            {user?.email?.[0]?.toUpperCase() || 'U'}
                          </div>
                        )}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user?.displayName || user?.email?.split('@')[0] || 'User'}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="cursor-pointer flex items-center">
                          <Smartphone className="mr-2 h-4 w-4" />
                          <span>My eSim</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/profile" className="cursor-pointer flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        disabled={logoutLoading}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{logoutLoading ? 'Signing out...' : 'Logout'}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                // Sign In Button (when not logged in)
                <Link href="/login" className={`hidden md:flex items-center gap-1 sm:gap-2 rounded-full px-2 sm:px-4 py-1.5 sm:py-2 text-white transition-colors ${(isHajjPage || isEuropePage)
                  ? 'bg-white/20 hover:bg-white/30'
                  : 'bg-green-500 hover:bg-green-600'
                  }`}>
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">Sign In</span>
                </Link>
              )}
            </>
          )}

          {/* Mobile WhatsApp Button */}
          <Link
            href="https://wa.me/34655877579"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-full border border-gray-400 bg-yellow-50 px-4 py-2 text-gray-700 hover:bg-yellow-100 md:hidden"
            title="WhatsApp Contact"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-white lg:hidden ${isHajjPage
              ? 'bg-white/20 hover:bg-white/30'
              : 'bg-green-500 hover:bg-green-600'
              }`}>
            {open ? <X className="size-5 md:size-6" /> : <IconAlignJustified className="size-5 md:size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="mobile-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="fixed inset-0 z-50 w-full  bg-background shadow-xl lg:hidden">
            <div className="flex h-14 sm:h-16 items-center justify-between px-4 pt-10">
              <Link href="/" className="flex items-center gap-2">
                <NextImage
                  src="/main_logo.png"
                  alt="Pirate Mobile"
                  width={300}
                  height={300}
                  className="size-16 md:size-20"
                />
              </Link>
              <div className="flex">
                <div className="">
                  <div className="flex items-center justify-center">
                    <CurrencySelector
                      selectedCurrency={selectedCurrency}
                      onCurrencyChange={handleCurrencyChange}
                      showOnMobile={true}
                      className="w-full max-w-xs"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-full bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                  <X className="size-4 sm:size-5" />
                </button>
              </div>
            </div>

            <div className="px-4 pt-8 flex flex-col justify-end">
              {/* Mobile Currency Selector */}
              <nav className="flex flex-col gap-2 py-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`block w-full rounded-md px-3 py-3 text-base transition-colors ${isActive
                        ? 'text-green-600 font-medium'
                        : 'text-gray-700 hover:text-gray-900'
                        }`}
                      onClick={() => setOpen(false)}>
                      {link.label}
                    </Link>
                  )
                })}
              </nav>

              {/* Mobile Contact & Auth Buttons */}
              <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4 absolute bottom-0 left-0 right-0 w-full mb-10 px-4">
                {/* WhatsApp Contact Button */}
                <Link
                  href="https://wa.me/34655877579"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-full border border-green-400 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-green-500 hover:bg-green-50 transition-colors"
                >
                  <span className="mr-2 sm:mr-3 inline-flex size-4 sm:size-5 items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                  </span>
                  <span className="text-xs sm:text-sm font-medium">+34 655 87 75 79</span>
                </Link>

                {/* Auth Buttons */}
                {!authLoading && (
                  <>
                    {isAuthenticated ? (
                      // User Info & Logout (when logged in)
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setOpen(false)}
                          className="flex w-full items-center justify-center rounded-full border border-gray-300 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <div className="mr-2 sm:mr-3 w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-gray-900 font-bold text-xs">
                            {user?.email?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <span className="text-xs sm:text-sm font-medium">
                            {user?.displayName || user?.email?.split('@')[0] || 'Dashboard'}
                          </span>
                        </Link>
                        <button
                          onClick={handleSignOut}
                          disabled={logoutLoading}
                          className="flex w-full items-center justify-center rounded-full bg-red-500 px-3 sm:px-4 py-2.5 sm:py-3 text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="mr-2 sm:mr-3 inline-flex size-4 sm:size-5 items-center justify-center">
                            <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                          </span>
                          <span className="text-xs sm:text-sm font-medium">
                            {logoutLoading ? 'Signing out...' : 'Sign Out'}
                          </span>
                        </button>
                      </>
                    ) : (
                      // Sign In Button (when not logged in)
                      <Link
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="flex w-full items-center justify-center rounded-full bg-secondary  px-3 sm:px-4 py-2.5 sm:py-3 text-black hover:bg-secondary-foreground transition-colors"
                      >
                        <span className="mr-2 sm:mr-3 inline-flex size-4 sm:size-5 items-center justify-center">
                          <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        </span>
                        <span className="text-xs sm:text-sm font-medium">Sign In</span>
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </header>
  )
}
