'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (!id) return;

    async function fetchPost() {
      const res = await fetch(`/api/proxy1/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
        setStatus(data.status);
        setTags(data.tags || []);
      }
    }
    fetchPost();
  }, [id]);

  function addTag() {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setNewTag('');
  }

  function removeTag(index: number) {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch(`/api/proxy1/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content,
        status: status === 'draft' || status === 'archived' ? 'published' : status,
        tags,
      }),
    });

    if (res.ok) {
      router.push('/');
    }
  }

  return (
    <main 
      className="min-h-screen bg-cover bg-center flex justify-center items-start pt-12"
      style={{ backgroundImage: "url('/bg (2).jpg')" }}
    >
      <div className="bg-white/25 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-2xl border border-white/20">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">✏️ Edit Post</h1>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block mb-1 font-semibold text-gray-800">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border px-3 py-2 rounded w-full bg-white/70 backdrop-blur-sm focus:bg-white/90 transition-all duration-200 text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-800">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border px-3 py-2 rounded w-full h-40 bg-white/70 backdrop-blur-sm focus:bg-white/90 transition-all duration-200 text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-800">Tags</label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter a tag"
                className="border px-3 py-2 rounded bg-white/70 backdrop-blur-sm text-gray-800"
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
              >
                Add Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700 transition-colors duration-200"
          >
            Update & Publish
          </button>
        </form>
      </div>
    </main>
  );
}
