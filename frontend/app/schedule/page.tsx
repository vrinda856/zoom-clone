'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API = 'http://localhost:8000';

export default function SchedulePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', description: '', scheduled_at: '', duration_minutes: 60
  });
  const [done, setDone] = useState(false);

  const handleSchedule = async () => {
    if (!form.title || !form.scheduled_at) return;
    await axios.post(`${API}/api/meetings`, {
      ...form,
      scheduled_at: new Date(form.scheduled_at).toISOString(),
    });
    setDone(true);
    setTimeout(() => router.push('/'), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-white mb-2">Schedule a Meeting</h1>
        <p className="text-gray-400 text-sm mb-6">Fill in the details to schedule</p>

        {[
          { label: 'Topic *',            key: 'title',            type: 'text',           placeholder: 'Meeting topic' },
          { label: 'Description',        key: 'description',      type: 'text',           placeholder: 'Optional description' },
          { label: 'Date & Time *',      key: 'scheduled_at',     type: 'datetime-local', placeholder: '' },
          { label: 'Duration (minutes)', key: 'duration_minutes', type: 'number',         placeholder: '60' },
        ].map(f => (
          <div key={f.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">{f.label}</label>
            <input type={f.type} placeholder={f.placeholder}
              value={(form as any)[f.key]}
              onChange={e => setForm({ ...form, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500" />
          </div>
        ))}

        {done && <p className="text-green-400 text-sm mb-4">✅ Meeting scheduled! Redirecting...</p>}

        <button onClick={handleSchedule}
          disabled={!form.title || !form.scheduled_at}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition">
          Schedule Meeting
        </button>
        <button onClick={() => router.push('/')}
          className="w-full mt-3 text-sm text-gray-500 hover:text-gray-300 py-2 transition">
          Cancel
        </button>
      </div>
    </div>
  );
}