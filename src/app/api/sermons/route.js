export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminRequest } from '@/lib/adminAuth';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim();

  if (!url || !key) return null;

  const cleanKey = key.replace(/^["']|["']$/g, '');
  const cleanUrl = url.replace(/^["']|["']$/g, '');

  return createClient(cleanUrl, cleanKey);
}

export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json([]);

    const { data, error } = await supabase
      .from('sermons')
      .select('*')
      .order('date_preached', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized.' }, { status: 500 });
    }

    const body = await req.json();
    const { title, speaker, date_preached, audio_url } = body;

    const { data, error } = await supabase
      .from('sermons')
      .insert([{ title, speaker, date_preached, audio_url }])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, sermon: data[0] }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized.' }, { status: 500 });
    }

    const { id, title, speaker, date_preached, audio_url } = await req.json();
    if (!id || !title || !speaker || !date_preached || !audio_url) {
      return NextResponse.json({ error: 'Sermon ID and all sermon fields are required.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('sermons')
      .update({ title, speaker, date_preached, audio_url })
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}