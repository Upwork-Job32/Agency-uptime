import { NextResponse } from 'next/server';

// Mock data for demonstration
const mockSites = [
  {
    id: 1,
    name: 'example.com',
    url: 'https://example.com',
    status: 'up',
    uptime: 99.9,
    responseTime: 210,
    lastCheck: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    alerts: 0,
    checkInterval: 5,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'api.example.com',
    url: 'https://api.example.com',
    status: 'up',
    uptime: 100,
    responseTime: 180,
    lastCheck: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    alerts: 0,
    checkInterval: 1,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'app.example.com',
    url: 'https://app.example.com',
    status: 'down',
    uptime: 98.5,
    responseTime: 0,
    lastCheck: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    alerts: 2,
    checkInterval: 5,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    name: 'blog.example.com',
    url: 'https://blog.example.com',
    status: 'up',
    uptime: 99.8,
    responseTime: 320,
    lastCheck: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    alerts: 1,
    checkInterval: 5,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET() {
  try {
    // In a real application, this would fetch from a database
    // based on the authenticated user's agency
    return NextResponse.json({
      sites: mockSites,
      totalSites: mockSites.length,
      upSites: mockSites.filter(site => site.status === 'up').length,
      downSites: mockSites.filter(site => site.status === 'down').length,
      avgUptime: mockSites.reduce((acc, site) => acc + site.uptime, 0) / mockSites.length,
      avgResponseTime: mockSites.reduce((acc, site) => acc + site.responseTime, 0) / mockSites.length
    });
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sites' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, url, checkInterval = 5 } = body;

    // Validate required fields
    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // In a real application, this would save to a database
    const newSite = {
      id: Date.now(),
      name,
      url,
      status: 'pending',
      uptime: 0,
      responseTime: 0,
      lastCheck: null,
      alerts: 0,
      checkInterval,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(newSite, { status: 201 });
  } catch (error) {
    console.error('Error creating site:', error);
    return NextResponse.json(
      { error: 'Failed to create site' },
      { status: 500 }
    );
  }
}