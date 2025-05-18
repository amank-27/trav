import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://postsbackend-8d4e.onrender.com/api/posts';

export async function PATCH(request: NextRequest) {
  const segments = request.nextUrl.pathname.split('/');
  const id = segments[segments.length - 2]; // e.g., /proxy2/[id]/status → second to last segment

  try {
    const body = await request.text();

    const res = await fetch(`${BACKEND_URL}/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to update status' }, { status: res.status });
    }

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    return NextResponse.json(data);
  } catch (err) {
    console.error('Proxy2 PATCH error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
