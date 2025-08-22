import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { destination, unauthorized } = await request.json();
    
    console.log('[AUTH API] Server-side redirect requested to:', destination);
    
    // Validate destination
    const allowedDestinations = ['/dashboard', '/login', '/unauthorized'];
    if (!allowedDestinations.includes(destination)) {
      console.error('[AUTH API] Invalid redirect destination:', destination);
      return NextResponse.json({ error: 'Invalid destination' }, { status: 400 });
    }
    
    // Build redirect URL
    let redirectUrl = destination;
    if (unauthorized && destination === '/dashboard') {
      redirectUrl = '/dashboard?unauthorized=true';
    }
    
    console.log('[AUTH API] Redirecting to:', redirectUrl);
    
    // Return redirect response
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error('[AUTH API] Redirect error:', error);
    return NextResponse.json({ error: 'Redirect failed' }, { status: 500 });
  }
}
