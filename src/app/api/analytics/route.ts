import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key_hash = searchParams.get('key_hash');

  if (!key_hash) {
    return NextResponse.json({ error: 'Missing key_hash' }, { status: 400 });
  }

  // Use the Pipe URL you copied in Step 1 (Replace the URL and Token below!)
  const TINYBIRD_PIPE_URL = `https://api.europe-west2.gcp.tinybird.co/v0/pipes/api_usage_stats.json`;
  const TINYBIRD_READ_TOKEN = process.env.TINYBIRD_TOKEN;

  try {
    const response = await fetch(`${TINYBIRD_PIPE_URL}?key_hash=${key_hash}`, {
      headers: { 'Authorization': `Bearer ${TINYBIRD_READ_TOKEN}` }
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}