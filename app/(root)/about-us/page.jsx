import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Globe, Shield, Zap, Users, Target, Award } from 'lucide-react'
import AboutHeroSection from '@/components/features/about/AboutHeroSection'
import AboutMissionSection from '@/components/features/about/AboutMissionSection'
import AboutTestimonialSection from '@/components/features/about/AboutTestimonialSection'
import TeamMembersSection from '@/components/features/about/TeamMembersSection'
import WhatMakesUsUnstoppable from '@/components/features/about/WhatMakesUsUnstoppable'
import GlobalConnectivityPartners from '@/components/shared/GlobalConnectivityPartners'

// Import metadata directly from data files
import { readJsonFromData } from '@/lib/data'
import ESimAppBanner from '@/components/shared/ESimAppBanner'

async function getMetadata() {
    try {
        return await readJsonFromData('data/pages/about-us.json')
    } catch (error) {
        console.error('Error loading metadata:', error)
        // Fallback metadata
        return {
            metadata: {
                title: "About Us | Pirate Mobile",
                description: "Learn about Pirate Mobile's mission to revolutionize global connectivity with eSIM technology."
            }
        }
    }
}

export async function generateMetadata() {
    const data = await getMetadata()
    const metadata = data.metadata || data

    return {
        title: metadata.title || "About Us | Pirate Mobile",
        description: metadata.description || "Learn about Pirate Mobile's mission to revolutionize global connectivity with eSIM technology.",
        openGraph: {
            title: metadata.openGraph?.title || metadata.title,
            description: metadata.openGraph?.description || metadata.description,
            images: metadata.openGraph?.images || ['/og/about-cover.jpg'],
            url: metadata.openGraph?.url || 'https://www.piratemobile.gg/about-us'
        },
        twitter: {
            card: metadata.twitter?.card || 'summary_large_image',
            title: metadata.twitter?.title || metadata.title,
            description: metadata.twitter?.description || metadata.description,
            images: metadata.twitter?.images || ['/og/about-cover.jpg']
        },
        other: {
            'application/ld+json': JSON.stringify(metadata.schema || {
                "@context": "https://schema.org",
                "@type": "AboutPage",
                "name": "About Pirate Mobile",
                "url": "https://www.piratemobile.gg/about-us",
                "description": metadata.description
            })
        }
    }
}

export default async function AboutUsPage() {
    const data = await getMetadata()

    return (
        <div>
            <AboutHeroSection />
            <GlobalConnectivityPartners />
            <WhatMakesUsUnstoppable />
            <AboutMissionSection />
            <AboutTestimonialSection />
            <TeamMembersSection />
            <ESimAppBanner />
        </div>
    )
}
