import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const DEFAULT_PIN = 'sonugg2025';
const SESSION_COOKIE_NAME = 'sonugg_admin_session';

// Simple server-side session validation token
function getExpectedToken() {
  const pin = process.env.ADMIN_PIN || DEFAULT_PIN;
  // Deterministic hash/token for session verification
  return Buffer.from(`sonugg-auth-${pin}-session-v1`).toString('base64');
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    const expectedToken = getExpectedToken();

    if (sessionCookie && sessionCookie.value === expectedToken) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ authenticated: false });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin } = body;

    const expectedPin = process.env.ADMIN_PIN || DEFAULT_PIN;

    if (!pin || pin !== expectedPin) {
      return NextResponse.json(
        { success: false, error: 'Invalid security PIN' },
        { status: 401 }
      );
    }

    const token = getExpectedToken();
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ success: true, message: 'Authenticated successfully' });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
