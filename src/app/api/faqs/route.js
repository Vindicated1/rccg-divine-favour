import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminRequest } from '@/lib/adminAuth';

function getSupabase({ requireServiceRole = false } = {}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = requireServiceRole
    ? process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
    : (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim();

  if (!url || !key) return null;
  return createClient(url.replace(/^["']|["']$/g, ''), key.replace(/^["']|["']$/g, ''));
}

export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('faqs')
      .select('id, question, answer')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to load FAQs.' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const supabase = getSupabase({ requireServiceRole: true });
  if (!supabase) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY is required to manage FAQs.' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const question = typeof body?.question === 'string' ? body.question.trim() : '';
    const answer = typeof body?.answer === 'string' ? body.answer.trim() : '';

    if (!question || question.length > 300 || !answer || answer.length > 5000) {
      return NextResponse.json(
        { error: 'A question (up to 300 characters) and answer (up to 5000 characters) are required.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('faqs')
      .insert([{ question, answer }])
      .select('id, question, answer')
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to add FAQ.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const supabase = getSupabase({ requireServiceRole: true });
  if (!supabase) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY is required to manage FAQs.' }, { status: 500 });
  }

  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'FAQ ID is required.' }, { status: 400 });

    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to delete FAQ.' }, { status: 500 });
  }
}
