import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET: Fetch all prayer requests (for Admin)
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase credentials missing.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('prayers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('GET /api/prayers error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Submit a new prayer request (from Homepage)
export async function POST(req) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase credentials missing on server.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
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
      console.error('Supabase Prayer Insert Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, prayer: data[0] }, { status: 201 });
  } catch (error) {
    console.error('POST /api/prayers error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit prayer request' }, { status: 500 });
  }
}

// PATCH: Update prayer status (e.g., mark as 'prayed')
export async function PATCH(req) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase credentials missing.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await req.json();
    const { id, status } = body;

    const { data, error } = await supabase
      .from('prayers')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, prayer: data[0] });
  } catch (error) {
    console.error('PATCH /api/prayers error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}