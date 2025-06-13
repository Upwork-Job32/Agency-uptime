import { NextResponse } from 'next/server';

// Mock data for demonstration
const mockAlerts = [
  {
    id: 1,
    siteId: 3,
    siteName: 'app.example.com',
    type: 'DOWN',
    severity: 'critical',
    message: 'HTTP 500 - Internal Server Error',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    resolved: false,
    resolvedAt: null,
    responseTime: 0,
    statusCode: 500
  },
  {
    id: 2,
    siteId: 4,
    siteName: 'blog.example.com',
    type: 'SLOW',
    severity: 'warning',
    message: 'Response time above 3s threshold',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    resolved: true,
    resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    responseTime: 3200,
    statusCode: 200
  },
  {
    id: 3,
    siteId: 2,
    siteName: 'api.example.com',
    type: 'SSL',
    severity: 'info',
    message: 'SSL certificate expires in 7 days',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    resolved: false,
    resolvedAt: null,
    responseTime: 180,
    statusCode: 200
  },
  {
    id: 4,
    siteId: 1,
    siteName: 'example.com',
    type: 'DOWN',
    severity: 'critical',
    message: 'Connection timeout',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    resolved: true,
    resolvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString(),
    responseTime: 0,
    statusCode: 0
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const resolved = searchParams.get('resolved');
    const severity = searchParams.get('severity');

    let filteredAlerts = [...mockAlerts];

    // Filter by resolved status
    if (resolved !== null) {
      const isResolved = resolved === 'true';
      filteredAlerts = filteredAlerts.filter(alert => alert.resolved === isResolved);
    }

    // Filter by severity
    if (severity) {
      filteredAlerts = filteredAlerts.filter(alert => alert.severity === severity);
    }

    // Sort by timestamp (newest first)
    filteredAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Apply limit
    const paginatedAlerts = filteredAlerts.slice(0, limit);

    return NextResponse.json({
      alerts: paginatedAlerts,
      totalAlerts: filteredAlerts.length,
      unresolvedAlerts: filteredAlerts.filter(alert => !alert.resolved).length,
      criticalAlerts: filteredAlerts.filter(alert => alert.severity === 'critical' && !alert.resolved).length,
      warningAlerts: filteredAlerts.filter(alert => alert.severity === 'warning' && !alert.resolved).length
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { siteId, siteName, type, severity, message, responseTime, statusCode } = body;

    // Validate required fields
    if (!siteId || !siteName || !type || !severity || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real application, this would save to a database
    // and trigger notification systems
    const newAlert = {
      id: Date.now(),
      siteId,
      siteName,
      type,
      severity,
      message,
      timestamp: new Date().toISOString(),
      resolved: false,
      resolvedAt: null,
      responseTime: responseTime || 0,
      statusCode: statusCode || 0
    };

    // Here you would typically:
    // 1. Save to database
    // 2. Send notifications (email, SMS, webhook)
    // 3. Update site status
    // 4. Log the incident

    return NextResponse.json(newAlert, { status: 201 });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}