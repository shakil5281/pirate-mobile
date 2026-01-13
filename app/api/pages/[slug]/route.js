import { NextResponse } from "next/server";
import { readJsonFromData } from "@/lib/data";

const slugToFile = {
  home: "data/pages/home.json",
  "about-us": "data/pages/about-us.json",
  "contact-us": "data/pages/contact-us.json",
  countries: "data/pages/countries.json",
  "download-app": "data/metadata/download-app.json",
};

export async function GET(_req, { params }) {
  const { slug } = await params;
  const file = slugToFile[slug];
  
  if (!file) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  try {
    const data = await readJsonFromData(file);
    return NextResponse.json(data);
  } catch (err) {
    console.error('Error loading data:', err);
    return NextResponse.json({ error: "Failed to load page" }, { status: 500 });
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