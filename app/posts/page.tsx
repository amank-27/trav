/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  async function handleSubmit(status: string) {
    setSaving(true);
    setError('');

    if (!title || !content) {
      setError('Please fill in both title and content');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, status, tags }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to save');
      }

      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main 
      className="min-h-screen bg-cover bg-center flex justify-center items-start pt-12"
      style={{
        backgroundImage: "url('/bg (2).jpg')",
      }}
    >
      <div className="bg-white/25 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-2xl border border-white/20">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">📝 New Post</h1>
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded bg-white/70 backdrop-blur-sm focus:bg-white/90 transition-all duration-200 text-gray-800 placeholder-gray-500"
            disabled={saving}
            required
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-2 rounded h-40 bg-white/70 backdrop-blur-sm focus:bg-white/90 transition-all duration-200 text-gray-800 placeholder-gray-500"
            disabled={saving}
            required
          />

          {/* Tag Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="border p-2 rounded flex-1 bg-white/70 backdrop-blur-sm focus:bg-white/90 transition-all duration-200 text-gray-800 placeholder-gray-500"
              disabled={saving}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              disabled={saving || !tagInput.trim()}
            >
              Add
            </button>
          </div>

          {/* Display Tags */}
          {tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag, i) => (
                <div
                  key={i}
                  className="flex items-center bg-white/50 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm border border-white/20"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-red-600">{error}</p>}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleSubmit('published')}
              disabled={saving}
              className="bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Post'}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              disabled={saving}
              className="bg-amber-500 text-white py-2 px-4 rounded hover:bg-amber-600 transition-colors duration-200 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
