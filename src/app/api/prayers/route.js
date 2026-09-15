import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  const body = await request.json();
  const { full_name, contact, request_body } = body;

  const { data, error } = await supabase
    .from('prayer_requests')
    .insert([{ full_name, contact, request_body }]);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true, message: 'Prayer request submitted successfully' });
}