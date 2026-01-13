import React from 'react'
import ContactHeroSection from '@/components/features/contact/ContactHeroSection'
import ContactForm from '@/components/features/contact/ContactForm'
import ContactInfo from '@/components/features/contact/ContactInfo'

// Import metadata directly from data files
import { readJsonFromData } from '@/lib/data'

async function getMetadata() {
    try {
        return await readJsonFromData('data/pages/contact-us.json')
    } catch (error) {
        console.error('Error loading metadata:', error)
        // Fallback metadata
        return {
            metadata: {
                title: "Contact Us | Pirate Mobile",
                description: "Get in touch with Pirate Mobile for support, questions about eSIM plans, or general inquiries. We're here 24/7 to help!"
            }
        }
    }
}

export async function generateMetadata() {
    const data = await getMetadata()
    const metadata = data.metadata || data

    return {
        title: metadata.title || "Contact Us | Pirate Mobile",
        description: metadata.description || "Get in touch with Pirate Mobile for support, questions about eSIM plans, or general inquiries. We're here 24/7 to help!",
        openGraph: {
            title: metadata.openGraph?.title || metadata.title,
            description: metadata.openGraph?.description || metadata.description,
            images: metadata.openGraph?.images || ['/og/contact-cover.jpg'],
            url: metadata.openGraph?.url || 'https://www.piratemobile.gg/contact-us'
        },
        twitter: {
            card: metadata.twitter?.card || 'summary_large_image',
            title: metadata.twitter?.title || metadata.title,
            description: metadata.twitter?.description || metadata.description,
            images: metadata.twitter?.images || ['/og/contact-cover.jpg']
        },
        other: {
            'application/ld+json': JSON.stringify(metadata.schema || {
                "@context": "https://schema.org",
                "@type": "ContactPage",
                "name": "Contact Pirate Mobile",
                "url": "https://www.piratemobile.gg/contact-us",
                "description": metadata.description
            })
        }
    }
}

export default async function ContactUsPage() {
    const data = await getMetadata()

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFF7C1] via-[#FFFDE9] to-white">
            <ContactHeroSection />
            
            {/* Main Content Area */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl 2xl:max-w-7xl mx-auto">
                    <div className="md:grid lg:grid-cols-3 gap-8 flex flex-col-reverse">
                        {/* Left Column - Contact Form */}
                        <div className='lg:col-span-2'>
                            <ContactForm />
                        </div>
                        
                        {/* Right Column - Contact Information */}
                        <div className='lg:col-span-1'>
                            <ContactInfo />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
