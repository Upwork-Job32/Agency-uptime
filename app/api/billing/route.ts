import { NextResponse } from 'next/server';

// Mock data for demonstration
const mockBillingData = {
  subscription: {
    id: 'sub_1234567890',
    status: 'active',
    plan: {
      id: 'plan_professional',
      name: 'Professional',
      price: 5000, // $50.00 in cents
      currency: 'usd',
      interval: 'month'
    },
    currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    cancelAtPeriodEnd: false,
    trialEnd: null
  },
  usage: {
    sitesUsed: 12,
    sitesLimit: 100,
    addOns: {
      pdfReports: {
        enabled: true,
        price: 2900 // $29.00 in cents
      },
      statusPages: {
        enabled: false,
        price: 1900 // $19.00 in cents
      },
      clientDashboard: {
        enabled: true,
        price: 4900 // $49.00 in cents
      }
    }
  },
  upcomingInvoice: {
    amountDue: 12800, // $128.00 in cents
    currency: 'usd',
    periodStart: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    periodEnd: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    lineItems: [
      {
        description: 'Professional Plan',
        amount: 5000,
        currency: 'usd'
      },
      {
        description: 'Branded PDF Reports Add-on',
        amount: 2900,
        currency: 'usd'
      },
      {
        description: 'Client Dashboard Add-on',
        amount: 4900,
        currency: 'usd'
      }
    ]
  },
  paymentMethod: {
    id: 'pm_1234567890',
    type: 'card',
    card: {
      brand: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2025
    }
  }
};

export async function GET() {
  try {
    // In a real application, this would fetch from Stripe API
    // based on the authenticated user's customer ID
    return NextResponse.json(mockBillingData);
  } catch (error) {
    console.error('Error fetching billing data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch billing data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'update_plan':
        // In a real application, this would call Stripe API to update subscription
        return NextResponse.json({
          success: true,
          message: 'Plan updated successfully'
        });

      case 'toggle_addon':
        const { addonId, enabled } = data;
        // In a real application, this would update the subscription in Stripe
        return NextResponse.json({
          success: true,
          message: `Add-on ${enabled ? 'enabled' : 'disabled'} successfully`
        });

      case 'update_payment_method':
        // In a real application, this would update the payment method in Stripe
        return NextResponse.json({
          success: true,
          message: 'Payment method updated successfully'
        });

      case 'cancel_subscription':
        // In a real application, this would cancel the subscription in Stripe
        return NextResponse.json({
          success: true,
          message: 'Subscription cancelled successfully'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error updating billing:', error);
    return NextResponse.json(
      { error: 'Failed to update billing' },
      { status: 500 }
    );
  }
}