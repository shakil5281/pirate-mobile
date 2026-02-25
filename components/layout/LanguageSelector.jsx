"use client"

import React, { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { useLanguage, SUPPORTED_LANGUAGES } from '@/contexts/LanguageContext'

export default function LanguageSelector({ showOnMobile = false, className = "" }) {
    const { currentLang, changeLanguage, isClient } = useLanguage()
    const [isOpen, setIsOpen] = useState(false)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.language-selector-container')) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    if (!isClient) return null // Prevent hydration mismatch

    const selectedLanguage = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0]

    return (
        <div className={`relative language-selector-container ${className}`}>
            {/* Required empty div for Google Translate API to initialize without showing default ugly UI */}
            <div id="google_translate_element" className="hidden"></div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between gap-1 px-2 py-1.5 rounded-md
          ${showOnMobile
                        ? 'w-full bg-white border border-gray-300 text-gray-700'
                        : 'bg-transparent border border-transparent hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200'
                    } transition-colors`}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <div className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">{selectedLanguage.name}</span>
                </div>
                <svg
                    className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div
                    className={`absolute z-50 mt-1 w-full min-w-[120px] bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden
            ${showOnMobile ? 'w-full' : 'right-0'}`}
                    role="listbox"
                >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-600 hover:text-white transition-colors
                ${currentLang === lang.code ? 'bg-blue-600 text-white' : 'text-gray-700'}
              `}
                            onClick={() => {
                                changeLanguage(lang.code)
                                setIsOpen(false)
                            }}
                            role="option"
                            aria-selected={currentLang === lang.code}
                        >
                            {lang.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
