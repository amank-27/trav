import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://postsbackend-8d4e.onrender.com/api/posts';

function extractId(request: NextRequest): string {
  const segments = request.nextUrl.pathname.split('/');
  return segments[segments.length - 1];
}

export async function GET(request: NextRequest) {
  const id = extractId(request);

  try {
    const response = await fetch(`${BACKEND_URL}/${id}`);
    if (!response.ok) {
      return NextResponse.json({ message: 'Post not found' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const id = extractId(request);

  try {
    const response = await fetch(`${BACKEND_URL}/${id}`, { method: 'DELETE' });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const id = extractId(request);

  try {
    const body = await request.json();
    if (!body.status) throw new Error('No status provided in body');

    const res = await fetch(`${BACKEND_URL}/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: body.status }),
    });

    if (!res.ok) throw new Error(`Failed to update status, backend says: ${res.status}`);

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('PATCH error:', err);
    const errorMessage = (err instanceof Error) ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const id = extractId(request);

  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}
