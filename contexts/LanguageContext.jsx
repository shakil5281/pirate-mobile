"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'de', name: 'German' },
    { code: 'th', name: 'Thai' },
    { code: 'ar', name: 'Arabic' },
    { code: 'ja', name: 'Japanese' },
    { code: 'it', name: 'Italian' }
]

const DEFAULT_LANGUAGE = 'en'

const COUNTRY_TO_LANG_MAP = {
    'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es',
    'DE': 'de', 'AT': 'de', 'CH': 'de',
    'TH': 'th',
    'SA': 'ar', 'AE': 'ar', 'EG': 'ar',
    'JP': 'ja',
    'IT': 'it'
}

export function LanguageProvider({ children }) {
    const [currentLang, setCurrentLang] = useState(DEFAULT_LANGUAGE)
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)

        const localLang = localStorage.getItem('user_language_preference')
        if (localLang && SUPPORTED_LANGUAGES.some(l => l.code === localLang)) {
            setCurrentLang(localLang)
            return
        }

        const detectAndSetLocationLanguage = async () => {
            try {
                const response = await fetch('https://get.geojs.io/v1/ip/country.json')
                if (response.ok) {
                    const data = await response.json()
                    const mappedLang = COUNTRY_TO_LANG_MAP[data.country]
                    if (mappedLang && mappedLang !== 'en') {
                        setCurrentLang(mappedLang)
                        setLanguageCookie(mappedLang)
                        localStorage.setItem('user_language_preference', mappedLang)
                        window.location.reload()
                    }
                }
            } catch (error) {
                console.error('Failed to detect location for language mapping:', error)
            }
        }

        detectAndSetLocationLanguage()
    }, [])

    // Handle RTL direction for Arabic Support
    useEffect(() => {
        if (isClient) {
            document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
        }
    }, [currentLang, isClient])

    const setLanguageCookie = (langCode) => {
        const domain = window.location.hostname
        const cookieValue = langCode === 'en' ? '/auto/en' : `/auto/${langCode}`
        document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain}; max-age=31536000`
        document.cookie = `googtrans=${cookieValue}; path=/; max-age=31536000`
    }

    const changeLanguage = (langCode) => {
        if (langCode === currentLang) return

        setCurrentLang(langCode)
        setLanguageCookie(langCode)
        localStorage.setItem('user_language_preference', langCode)

        // Refresh full app as requested by user
        window.location.reload()
    }

    return (
        <LanguageContext.Provider value={{ currentLang, changeLanguage, isClient }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => useContext(LanguageContext)
