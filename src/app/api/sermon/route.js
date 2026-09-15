import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

// GET: Fetch list of sermons for public website
export async function GET() {
  const { data, error } = await supabase
    .from('sermons')
    .select('*')
    .order('date_preached', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: Add new sermon (Requires Admin Cookie)
export async function POST(request) {
  const cookie = request.cookies.get('admin_session');
  const JWT_SECRET = process.env.JWT_SECRET || 'rccg-divine-favour-secret-key';

  if (!cookie) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    jwt.verify(cookie.value, JWT_SECRET);
    
    const body = await request.json();
    const { title, speaker, date_preached, audio_url, youtube_url } = body;

    const { data, error } = await supabase
      .from('sermons')
      .insert([{ title, speaker, date_preached, audio_url, youtube_url }])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, data });

  } catch (err) {
    return NextResponse.json({ message: 'Invalid or expired session token' }, { status: 403 });
  }
}