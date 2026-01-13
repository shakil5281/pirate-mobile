import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

async function readCountryContent(slug) {
  const safeSlug = String(slug || '').toLowerCase();
  const baseDir = path.join(process.cwd(), 'data', 'countryData');
  const filePath = path.join(baseDir, `${safeSlug}.json`);
  
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const json = JSON.parse(raw);
    return json;
  } catch (err) {
    return null;
  }
}

function buildResponse(slug, json) {
  const defaultFaqs = [
    {
      question: 'What devices support eSIM?',
      answer: 'Most modern smartphones, tablets, and some laptops support eSIM. Check your device settings to confirm compatibility.'
    },
    {
      question: 'How does an eSIM work?',
      answer: 'An eSIM is a digital SIM that lets you activate a cellular plan without a physical SIM card.'
    },
    {
      question: 'Can I use eSIM and physical SIM together?',
      answer: 'Many devices support Dual SIM, allowing both an eSIM and a physical SIM.'
    },
    {
      question: 'How do I activate my eSIM?',
      answer: 'Purchase a plan, scan the provided QR code, and enable the eSIM in your device settings.'
    }
  ];

  const faqs = Array.isArray(json?.faqs)
    ? json.faqs.map(item => ({ question: item.question, answer: item.answer }))
    : defaultFaqs;

  const response = {
    slug,
    title: json?.title || null,
    seo_meta_title: json?.seo_meta_title || null,
    meta_description: json?.meta_description || null,
    faqs,
    schema: {
      product: json?.schema || null,
      localBusiness: json?.localBusinessSchema || null,
      service: json?.serviceSchema || null,
      faq: json?.faqSchema || null
    },
    hasCountrySpecificContent: Boolean(json)
  };

  return response;
}

export async function GET(_request, { params }) {
  try {
    const { slug } = await params || {};
    if (!slug) {
      return NextResponse.json({ error: 'Missing country slug' }, { status: 400 });
    }

    const countryJson = await readCountryContent(slug);
    const payload = buildResponse(slug, countryJson);
    
    return NextResponse.json(payload, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load country content' }, { status: 500 });
  }
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


