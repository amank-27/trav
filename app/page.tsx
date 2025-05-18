/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Archive, Edit, Eye, Trash2 } from 'lucide-react'; 
import Link from 'next/link';
import { useEffect, useState } from 'react';


interface Post {
  id: string;  
  title: string;
  content: string;
  status: 'published' | 'draft' | 'archived';
  tags: string[];
  created_at: string;
  updated_at: string;
}

export default function Page() {
  const [notes, setNotes] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'draft' | 'archived'>('all');

  async function fetchNotes() {
    setLoading(true);
    try {
      const res = await fetch('/api/proxy');
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      setNotes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  async function handleDelete(id: string) {
  if (!id) {
    console.error('No post ID provided for deletion');
    return;
  }
  if (!confirm('Are you sure you want to delete this post?')) return;
  
  try {
    const res = await fetch(`/api/proxy1/${id}`, {  
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete post');
    fetchNotes();
  } catch (err: any) {
    console.error('Delete error:', err);
    alert(err.message);
  }
}

  async function handleStatusUpdate(id: string, newStatus: string) {
  if (!id) {
    console.error('No post ID provided for status update');
    return;
  }

  try {
    console.log('Updating status for post:', id, 'to:', newStatus);
    const res = await fetch(`/api/proxy2/${id}/status`, {  // <--- include id in URL
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.error || 'Failed to update status');
    }

    await fetchNotes();
  } catch (err: any) {
    console.error('Status update error:', err);
    alert(err.message);
  }
}

const filteredNotes = notes.filter((note) => {
  const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase());
  const matchesFilter =
    filter === 'all'
      ? note.status === 'published'  // Only published posts when 'all'
      : note.status === filter;       // Draft or archived
  return matchesSearch && matchesFilter;
});


  const renderPost = (post: Post) => (
    <div
      key={post.id}
      className="relative bg-white bg-opacity-70 rounded-xl p-6 shadow-md hover:shadow-lg transition"
    >
      <div className="absolute top-4 right-4 flex gap-2">
        <button 
          onClick={() => handleDelete(post.id)} 
          title="Delete" 
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 size={20} />
        </button>
        {post.status === 'published' && (
          <button
            onClick={() => handleStatusUpdate(post.id, 'archived')}
            title="Archive"
            className="text-gray-700 hover:text-gray-900"
          >
            <Archive size={20} />
          </button>
        )}
        {post.status === 'archived' && (
          <button
            onClick={() => handleStatusUpdate(post.id, 'published')}
            title="Restore"
            className="text-emerald-600 hover:text-emerald-800"
          >
            <Archive size={20} />
          </button>
        )}
      </div>
      <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
      <p className="mt-1 text-gray-700">
        Status: {' '}
        <span className={`
          ${post.status === 'published' ? 'text-emerald-600' : ''}
          ${post.status === 'draft' ? 'text-amber-600' : ''}
          ${post.status === 'archived' ? 'text-gray-600' : ''}
        `}>
          {post.status}
        </span>
      </p>
      <div className="flex gap-4 mt-4">
        <Link 
          href={`/view/${post.id}`} 
          className="text-blue-600 flex items-center gap-1 hover:text-blue-800"
        >
          <Eye size={18} /> View
        </Link>
        <Link 
          href={`/edit/${post.id}`} 
          className="text-amber-600 flex items-center gap-1 hover:text-amber-800"
        >
          <Edit size={18} /> Edit
        </Link>
        {post.status === 'draft' && (
          <button
            onClick={() => handleStatusUpdate(post.id, 'published')}
            className="text-emerald-600 flex items-center gap-1 hover:text-emerald-800"
          >
            <Archive size={18} /> Publish
          </button>
        )}
      </div>
    </div>
  );

  return (
    <main
      className="min-h-screen bg-cover bg-center flex justify-center items-start pt-12"
      style={{
        backgroundImage: "url('/bg (2).jpg')",
      }}
    >
      <div className="bg-white/25 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-7xl border border-white/20">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">📄 YOUR TRAV DIARY </h1>
        <div className="flex flex-col gap-4 mb-6">
          <Link
            href="/posts"
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition w-fit"
          >
            + New Post
          </Link>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search posts..."
              className="border p-2 rounded-lg flex-1 bg-white bg-opacity-90 text-gray-800 placeholder-gray-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setFilter(filter === 'draft' ? 'all' : 'draft')}
                className={`px-4 py-2 rounded-lg ${
                  filter === 'draft' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-emerald-600 hover:bg-emerald-700'
                } text-white transition`}
              >
                {filter === 'draft' ? 'Show All' : 'Drafts'}
              </button>
              <button
                onClick={() => setFilter(filter === 'archived' ? 'all' : 'archived')}
                className={`px-4 py-2 rounded-lg ${
                  filter === 'archived' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-emerald-600 hover:bg-emerald-700'
                } text-white transition`}
              >
                {filter === 'archived' ? 'Show All' : 'Archived'}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div key="loading" className="mt-6 text-center">Loading...</div>
        ) : error ? (
          <div key="error" className="text-red-600 mt-6 text-center">{error}</div>
        ) : (
          <div key="content" className="space-y-6">
            {filteredNotes.length === 0 ? (
              <div key="empty" className="text-center">No posts found...</div>
            ) : (
              filteredNotes.map((post) => (
                <div key={post.id}>{renderPost(post)}</div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
