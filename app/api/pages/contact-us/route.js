import { NextResponse } from 'next/server'

export async function GET() {
  const contactData = {
    metadata: {
      title: "Contact Us | Pirate Mobile: Get Support & Help",
      seo_meta_title: "Contact Us | Pirate Mobile: Get Support & Help",
      meta_description: "Get in touch with Pirate Mobile for support, questions about eSIM plans, or general inquiries. We're here 24/7 to help with your connectivity needs.",
      openGraph: {
        title: "Contact Us | Pirate Mobile: Get Support & Help",
        description: "Get in touch with Pirate Mobile for support, questions about eSIM plans, or general inquiries. We're here 24/7 to help with your connectivity needs.",
        images: ["/og/contact-cover.jpg"],
        url: "https://www.piratemobile.gg/contact-us"
      },
      twitter: {
        card: "summary_large_image",
        title: "Contact Us | Pirate Mobile: Get Support & Help",
        description: "Get in touch with Pirate Mobile for support, questions about eSIM plans, or general inquiries. We're here 24/7 to help with your connectivity needs.",
        images: ["/og/contact-cover.jpg"]
      },
      schema: {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Pirate Mobile",
        "url": "https://www.piratemobile.gg/contact-us",
        "description": "Get in touch with Pirate Mobile for support, questions about eSIM plans, or general inquiries. We're here 24/7 to help with your connectivity needs.",
        "mainEntity": {
          "@type": "Organization",
          "name": "Pirate Mobile",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Avenue House, St. Julians Avenue",
            "addressLocality": "ST. Peters Port",
            "addressRegion": "Guernsey",
            "postalCode": "GY11WA",
            "addressCountry": "GG"
          },
          "email": "info@piratemobile.gg",
          "telephone": "+34 655 87 75 79"
        }
      }
    },
    content: {
      heading: "Let's Connect - We're Here to Help!",
      subtitle: "Got questions about our eSIM plans? We're here 24/7 - just send us a message and we'll reply quickly!",
      form: {
        name: "Name*",
        email: "Email*",
        subject: "Enter Subject*",
        message: "Write message*",
        submit: "Send Message"
      },
      contact: {
        address: {
          title: "Our Address",
          value: "Avenue House, St. Julians Avenue, ST. Peters Port, Guernsey, GY11WA"
        },
        email: {
          title: "Email Address",
          value: "info@piratemobile.gg"
        },
        phone: {
          title: "Message us via Chat",
          value: "+34 655 87 75 79"
        }
      }
    }
  }

  return NextResponse.json(contactData)
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}