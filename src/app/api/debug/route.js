export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return NextResponse.json({
    supabase_url_found: !!url,
    supabase_url_sample: url ? url.substring(0, 20) + '...' : null,
    anon_key_found: !!anonKey,
    anon_key_length: anonKey ? anonKey.length : 0,
    service_role_key_found: !!serviceKey,
    service_role_key_length: serviceKey ? serviceKey.length : 0,
  });
}