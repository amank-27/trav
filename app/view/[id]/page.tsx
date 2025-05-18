
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Post = {
  title: string;
  content: string;
  created_at: string;
  tags?: string[];
};

export default function PostViewPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    async function fetchPost() {
      setLoading(true);
      try {
        const res = await fetch(`/api/proxy1/${id}`);
        if (!res.ok) throw new Error('Failed to fetch post');
        const data = await res.json();
        if (!data || data.message === 'Post not found') throw new Error('Post not found');
        setPost(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  function formatDate(dateString: string) {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toISOString().split('T')[0];
  }

  if (loading) return (
    <main className="min-h-screen bg-cover bg-center flex justify-center items-start pt-12" style={{ backgroundImage: "url('/bg (2).jpg')" }}>
      <div className="bg-white/25 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-3xl border border-white/20">
        <p className="text-gray-800">Loading post...</p>
      </div>
    </main>
  );

  if (error) return (
    <main className="min-h-screen bg-cover bg-center flex justify-center items-start pt-12" style={{ backgroundImage: "url('/bg (2).jpg')" }}>
      <div className="bg-white/25 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-3xl border border-white/20">
        <p className="text-red-600">Error: {error}</p>
      </div>
    </main>
  );

  if (!post) return (
    <main className="min-h-screen bg-cover bg-center flex justify-center items-start pt-12" style={{ backgroundImage: "url('/bg (2).jpg')" }}>
      <div className="bg-white/25 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-3xl border border-white/20">
        <p className="text-gray-800">Post not found.</p>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-cover bg-center flex justify-center items-start pt-12" style={{ backgroundImage: "url('/bg (2).jpg')" }}>
      <div className="bg-white/25 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-3xl border border-white/20">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{post.title}</h1>
        <p className="text-gray-700 mb-6">Created on: {formatDate(post.created_at)}</p>
        <article className="mb-6 whitespace-pre-wrap text-gray-800 leading-relaxed">
          {post.content}
        </article>

        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {post.tags.map((tag: string) => (
              <span key={tag} className="bg-white/50 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm border border-white/20">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
