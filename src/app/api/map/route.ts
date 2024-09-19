import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=restaurant&language=zh-CN&key=${apiKey}`;

  // const hereApiKey = process.env.NEXT_PUBLIC_HERE_API_KEY;
  // const url = `https://places.ls.hereapi.com/places/v1/discover/explore?at=${lat},${lng}&apiKey=${hereApiKey}`;

  const response = await fetch(url);
  const data = await response.json();
  console.log('data', data);
  return NextResponse.json(data);
}
