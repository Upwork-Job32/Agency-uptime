import { NextResponse } from 'next/server';

// Mock data for demonstration
const mockReports = [
  {
    id: 1,
    period: 'November 2024',
    generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    sitesCount: 12,
    avgUptime: 99.2,
    totalDowntime: 11.5, // minutes
    incidentCount: 5,
    status: 'generated',
    downloadUrl: '/api/reports/1/download',
    emailSent: true,
    emailSentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    period: 'October 2024',
    generatedAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
    sitesCount: 10,
    avgUptime: 99.8,
    totalDowntime: 2.3,
    incidentCount: 1,
    status: 'generated',
    downloadUrl: '/api/reports/2/download',
    emailSent: true,
    emailSentAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    period: 'September 2024',
    generatedAt: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000).toISOString(),
    sitesCount: 8,
    avgUptime: 99.5,
    totalDowntime: 7.2,
    incidentCount: 3,
    status: 'generated',
    downloadUrl: '/api/reports/3/download',
    emailSent: true,
    emailSentAt: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export async function GET() {
  try {
    // In a real application, this would fetch from a database
    // based on the authenticated user's agency
    return NextResponse.json({
      reports: mockReports,
      totalReports: mockReports.length,
      lastGenerated: mockReports[0]?.generatedAt || null
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { period, sites } = body;

    // Validate required fields
    if (!period || !sites || !Array.isArray(sites)) {
      return NextResponse.json(
        { error: 'Period and sites array are required' },
        { status: 400 }
      );
    }

    // In a real application, this would:
    // 1. Calculate uptime statistics for the period
    // 2. Generate a branded PDF report
    // 3. Save report metadata to database
    // 4. Send email with PDF attachment
    // 5. Store PDF in cloud storage

    const newReport = {
      id: Date.now(),
      period,
      generatedAt: new Date().toISOString(),
      sitesCount: sites.length,
      avgUptime: 99.5, // This would be calculated from actual data
      totalDowntime: 5.2,
      incidentCount: 2,
      status: 'generating',
      downloadUrl: null,
      emailSent: false,
      emailSentAt: null
    };

    // Simulate PDF generation process
    setTimeout(() => {
      // In reality, this would update the database
      console.log(`Report ${newReport.id} generation completed`);
    }, 5000);

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}