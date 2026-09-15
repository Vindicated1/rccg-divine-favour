import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

// Helper to check admin authentication
function isAuthorized(request) {
  const cookie = request.cookies.get('admin_session');
  const JWT_SECRET = process.env.JWT_SECRET || 'rccg-divine-favour-secret-key';
  if (!cookie) return false;
  try {
    jwt.verify(cookie.value, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

// POST: Public submission of prayer request
export async function POST(request) {
  try {
    const body = await request.json();
    const { full_name, contact, request_body } = body;

    const { data, error } = await supabase
      .from('prayer_requests')
      .insert([{ full_name, contact, request_body, status: 'pending' }]);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, message: 'Prayer request submitted.' });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET: Admin fetches all prayer requests
export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('prayer_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH: Admin updates request status (e.g., 'prayed', 'archived')
export async function PATCH(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id, status } = await request.json();

  const { data, error } = await supabase
    .from('prayer_requests')
    .update({ status })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true, data });
}