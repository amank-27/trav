


import {NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://postsbackend-8d4e.onrender.com/api/posts';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND_URL}/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: await req.text(), // pass the request body as is
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to update status' }, { status: res.status });
    }

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    return NextResponse.json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
