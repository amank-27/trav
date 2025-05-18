import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://postsbackend-8d4e.onrender.com/api/posts';

export async function GET() {
  try {
    // GET all posts - no id here
    console.log('GET all posts');
    const response = await fetch(BACKEND_URL);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('POST create new post with data:', body);
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

