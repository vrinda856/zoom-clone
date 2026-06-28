'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const API = 'http://localhost:8000';

function JoinForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [meetingId, setMeetingId] = useState(params.get('meetingId') || '');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!meetingId || !name) return;
    setLoading(true);
    try {
      await axios.post(`${API}/api/meetings/${meetingId}/join`, {
        meeting_id: meetingId,
        display_name: name
      });
      router.push(`/meeting/${meetingId}?name=${encodeURIComponent(name)}`);
    } catch {
      setError('Meeting not found. Please check the ID and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">Join a Meeting</h1>
        <p className="text-gray-400 text-sm mb-6">Enter your meeting ID to join</p>

        <label className="block text-sm font-medium text-gray-300 mb-1">Meeting ID</label>
        <input value={meetingId} onChange={e => setMeetingId(e.target.value)}
          placeholder="e.g. 123-456-789"
          className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500" />

        <label className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
        <input value={name} onChange={e => setName(e.target.value)}
          placeholder="Enter your display name"
          className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500" />

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button onClick={handleJoin} disabled={!meetingId || !name || loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition">
          {loading ? 'Joining...' : 'Join Meeting'}
        </button>
        <button onClick={() => router.push('/')}
          className="w-full mt-3 text-sm text-gray-500 hover:text-gray-300 py-2 transition">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return <Suspense><JoinForm /></Suspense>;
}