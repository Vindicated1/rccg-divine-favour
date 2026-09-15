import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

// GET: Fetch all sermons
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('sermons')
      .select('*')
      .order('date_preached', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching sermons:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Add new sermon
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, speaker, date_preached, audio_url } = body;

    if (!title || !speaker || !date_preached || !audio_url) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('sermons')
      .insert([{ title, speaker, date_preached, audio_url }])
      .select();

    if (error) {
      console.error('Supabase DB Insert Error:', error);
      throw error;
    }

    return NextResponse.json({ success: true, sermon: data[0] }, { status: 201 });
  } catch (error) {
    console.error('Error adding sermon:', error);
    return NextResponse.json({ error: error.message || 'Failed to insert sermon' }, { status: 500 });
  }
}