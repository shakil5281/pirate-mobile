import { NextResponse } from "next/server";
import { readJsonFromData } from "@/lib/data";

export async function GET() {
  try {
    const data = await readJsonFromData("data/site.json");
    return NextResponse.json(data.site ?? data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load site data" }, { status: 500 });
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