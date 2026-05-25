import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyHash = searchParams.get('key_hash');

  if (!keyHash) {
    return NextResponse.json({ error: 'Missing key_hash' }, { status: 400 });
  }

  try {
    // FIX: Changed 'gateway_logs_api' to 'api_usage_stats' to match your Tinybird screenshot!
    const tinybirdUrl = new URL(`https://api.europe-west2.gcp.tinybird.co/v0/pipes/api_usage_stats.json`);
    tinybirdUrl.searchParams.append('key_hash', keyHash);

    const response = await fetch(tinybirdUrl.toString(), {
      headers: {
        Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
      },
    });

    if (!response.ok) {
      console.error('Tinybird read error:', await response.text());
      return NextResponse.json({ data: [] }); 
    }

    const data = await response.json();
    return NextResponse.json({ data: data.data });

  } catch (error) {
    console.error('Analytics Fetch Error:', error);
    return NextResponse.json({ data: [] });
  }
}