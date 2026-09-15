import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'rccg2026';
    const JWT_SECRET = process.env.JWT_SECRET || 'rccg-divine-favour-secret-key';

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      // Generate 24-hour Admin Token
      const token = jwt.sign({ role: 'admin', user: username }, JWT_SECRET, { expiresIn: '24h' });

      const response = NextResponse.json({ success: true, message: 'Authentication successful' });
      
      // Set HTTP-Only Cookie for Security
      response.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/'
      });

      return response;
    }

    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}