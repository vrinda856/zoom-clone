'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API = 'http://localhost:8000';

export default function Dashboard() {
  const router = useRouter();
  const [meetings, setMeetings] = useState<any>({ upcoming: [], recent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/meetings`)
      .then(r => setMeetings(r.data))
      .finally(() => setLoading(false));
  }, []);

  const startInstantMeeting = async () => {
    try {
      const res = await axios.post(`${API}/api/meetings`, {
        title: 'My Instant Meeting',
        is_instant: true
      });
      router.push(`/meeting/${res.data.meeting_id}?name=Default+User`);
    } catch (err) {
      alert('Failed to start meeting. Is the backend running?');
    }
  };

  const actions = [
    { label: 'New Meeting',  emoji: '📹', color: 'bg-orange-500', action: startInstantMeeting },
    { label: 'Join',         emoji: '➕', color: 'bg-blue-500',   action: () => router.push('/join') },
    { label: 'Schedule',     emoji: '📅', color: 'bg-blue-500',   action: () => router.push('/schedule') },
    { label: 'Share Screen', emoji: '⬆️', color: 'bg-blue-500',   action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between bg-gray-900">
        <span className="text-blue-400 font-bold text-2xl tracking-tight">zoom</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Default User</span>
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">D</div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          {actions.map(btn => (
            <button key={btn.label} onClick={btn.action}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gray-800 hover:bg-gray-700 transition-all border border-gray-700">
              <div className={`${btn.color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                {btn.emoji}
              </div>
              <span className="text-sm font-medium text-gray-200">{btn.label}</span>
            </button>
          ))}
        </div>

        {/* Upcoming Meetings */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">Upcoming Meetings</h2>
          {loading
            ? <p className="text-gray-500 text-sm">Loading...</p>
            : meetings.upcoming.length === 0
            ? <p className="text-gray-500 text-sm">No upcoming meetings</p>
            : meetings.upcoming.map((m: any) => (
              <div key={m.id} className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl p-4 mb-2 hover:bg-gray-750 transition">
                <div>
                  <p className="font-medium text-white">{m.title}</p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {new Date(m.scheduled_at).toLocaleString()} · {m.duration_minutes} min
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/join?meetingId=${m.meeting_id}`)}
                    className="border border-blue-500 text-blue-400 px-4 py-2 rounded-lg text-sm hover:bg-blue-500 hover:text-white transition">
                    Copy Link
                  </button>
                  <button onClick={() => router.push(`/meeting/${m.meeting_id}?name=Default+User`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                    Start
                  </button>
                </div>
              </div>
            ))}
        </section>

        {/* Recent Meetings */}
        <section>
          <h2 className="text-lg font-semibold text-gray-200 mb-4">Recent Meetings</h2>
          {meetings.recent.map((m: any) => (
            <div key={m.id} className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl p-4 mb-2 hover:bg-gray-750 transition">
              <div>
                <p className="font-medium text-gray-200">{m.title}</p>
                <p className="text-sm text-gray-400 mt-0.5">
                  {new Date(m.scheduled_at || m.created_at).toLocaleString()}
                </p>
              </div>
              <span className="text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-full font-mono">{m.meeting_id}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}