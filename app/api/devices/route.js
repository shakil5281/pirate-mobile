import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    const filePath = path.join(process.cwd(), 'data', 'devices.json');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Devices data not found' },
        { status: 404 }
      );
    }
    
    const devicesData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Filter devices based on search query
    if (search) {
      const filteredDevices = devicesData.devices.map(brand => ({
        ...brand,
        models: brand.models.filter(model => 
          model.name.toLowerCase().includes(search.toLowerCase()) ||
          brand.brand.toLowerCase().includes(search.toLowerCase())
        )
      })).filter(brand => brand.models.length > 0);
      
      return NextResponse.json({ devices: filteredDevices });
    }
    
    return NextResponse.json(devicesData);
  } catch (error) {
    console.error('Error fetching devices data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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