import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  // Try Service Role Key first, fall back to Anon Key
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim();

  if (!url || !key) {
    console.error('Missing Supabase env vars:', { url: !!url, key: !!key });
    return { error: 'Supabase URL or Key environment variable is missing on server.' };
  }

  // Ensure key isn't wrapped in quotes by mistake in Vercel settings
  const cleanKey = key.replace(/^["']|["']$/g, '');
  const cleanUrl = url.replace(/^["']|["']$/g, '');

  return { supabase: createClient(cleanUrl, cleanKey) };
}

// POST: Submit prayer request
export async function POST(req) {
  try {
    const { supabase, error: clientErr } = getSupabase();
    if (clientErr) {
      return NextResponse.json({ error: clientErr }, { status: 500 });
    }

    const body = await req.json();
    const { full_name, contact, request_body } = body;

    if (!full_name || !contact || !request_body) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('prayers')
      .insert([{ full_name, contact, request_body, status: 'pending' }])
      .select();

    if (error) {
      console.error('Supabase Error Details:', error);
      return NextResponse.json({ error: `Supabase Error: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, prayer: data[0] }, { status: 201 });
  } catch (err) {
    console.error('Server Catch Error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

// GET: Fetch all prayer requests
export async function GET() {
  try {
    const { supabase, error: clientErr } = getSupabase();
    if (clientErr) {
      return NextResponse.json({ error: clientErr }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('prayers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: `Supabase Error: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}