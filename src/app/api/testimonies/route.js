import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminRequest } from '@/lib/adminAuth';

function getSupabase({ requireServiceRole = false } = {}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = requireServiceRole
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(request) {
  const isAdmin = isAdminRequest(request);
  const supabase = getSupabase({ requireServiceRole: isAdmin });

  if (!supabase) {
    const error = isAdmin
      ? 'SUPABASE_SERVICE_ROLE_KEY is required to manage testimonies.'
      : 'Supabase is not configured.';
    return NextResponse.json({ error }, { status: 500 });
  }

  try {
    let query = supabase.from('testimonies').select('id, name, testimony, created_at, approved');
    if (!isAdmin) query = query.eq('approved', true);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to load testimonies.' }, { status: 500 });
  }
}

export async function POST(request) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const testimony = typeof body?.testimony === 'string' ? body.testimony.trim() : '';

    if (name.length > 100 || testimony.length < 10 || testimony.length > 5000) {
      return NextResponse.json(
        { error: 'Provide a testimony between 10 and 5000 characters; names must be 100 characters or fewer.' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('testimonies')
      .insert([{ name: name || null, testimony, approved: false }]);

    if (error) throw error;
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to submit testimony.' }, { status: 500 });
  }
}

export async function PATCH(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const supabase = getSupabase({ requireServiceRole: true });
  if (!supabase) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY is required to manage testimonies.' }, { status: 500 });
  }

  try {
    const { id, approved } = await request.json();
    if (!id || typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'A testimony ID and approval status are required.' }, { status: 400 });
    }

    const { error } = await supabase.from('testimonies').update({ approved }).eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update testimony.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const supabase = getSupabase({ requireServiceRole: true });
  if (!supabase) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY is required to manage testimonies.' }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Testimony ID is required.' }, { status: 400 });

    const { error } = await supabase.from('testimonies').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to delete testimony.' }, { status: 500 });
  }
}
