export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminRequest } from '@/lib/adminAuth';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim();

  if (!url || !key) {
    return { 
      error: `Missing environment variables. URL present: ${!!url}, Key present: ${!!key}` 
    };
  }

  const cleanKey = key.replace(/^["']|["']$/g, '');
  const cleanUrl = url.replace(/^["']|["']$/g, '');

  return { supabase: createClient(cleanUrl, cleanKey) };
}

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
      return NextResponse.json({ error: `Supabase Error: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, prayer: data[0] }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

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

export async function PATCH(req) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { supabase, error: clientErr } = getSupabase();
    if (clientErr) return NextResponse.json({ error: clientErr }, { status: 500 });

    const { id, full_name, contact, request_body, status } = await req.json();
    if (!id) return NextResponse.json({ error: 'Prayer request ID is required.' }, { status: 400 });

    const updates = {};
    if (full_name !== undefined) updates.full_name = full_name;
    if (contact !== undefined) updates.contact = contact;
    if (request_body !== undefined) updates.request_body = request_body;
    if (status !== undefined) {
      if (!['pending', 'prayed'].includes(status)) {
        return NextResponse.json({ error: 'Invalid prayer request status.' }, { status: 400 });
      }
      updates.status = status;
    }

    if (!Object.keys(updates).length) {
      return NextResponse.json({ error: 'At least one field to update is required.' }, { status: 400 });
    }
    if (
      (updates.full_name !== undefined && (typeof updates.full_name !== 'string' || !updates.full_name.trim())) ||
      (updates.contact !== undefined && (typeof updates.contact !== 'string' || !updates.contact.trim())) ||
      (updates.request_body !== undefined && (typeof updates.request_body !== 'string' || !updates.request_body.trim()))
    ) {
      return NextResponse.json({ error: 'Name, contact, and request cannot be empty.' }, { status: 400 });
    }

    const { error } = await supabase.from('prayers').update(updates).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}