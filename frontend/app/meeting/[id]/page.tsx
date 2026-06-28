'use client';
import { useEffect, useRef, useState, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;
const FAKE_PARTICIPANTS = ['Alex Johnson', 'Sarah Lee', 'Ravi Kumar'];

function MeetingRoom() {
  const { id } = useParams();
  const params = useSearchParams();
  const router = useRouter();
  const name = params.get('name') || 'Default User';
  const videoRef = useRef<HTMLVideoElement>(null);
  const [meeting, setMeeting] = useState<any>(null);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    axios.get(`${API}/api/meetings/${id}`).then(r => setMeeting(r.data)).catch(() => {});
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
      .catch(() => {});
    const timer = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [id]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 3600)).padStart(2,'0')}:${String(Math.floor((s % 3600) / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  const copyInvite = () => {
    navigator.clipboard.writeText(`${window.location.origin}/join?meetingId=${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const controls = [
    { label: muted ? 'Unmute' : 'Mute',              icon: muted ? '🔇' : '🎤', action: () => setMuted(!muted) },
    { label: videoOff ? 'Start Video' : 'Stop Video', icon: videoOff ? '📷' : '🎥', action: () => setVideoOff(!videoOff) },
    { label: 'Share Screen',                          icon: '🖥️',                action: () => {} },
    { label: 'Participants',                          icon: '👥',                action: () => {} },
    { label: 'Chat',                                  icon: '💬',                action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-white font-semibold">{meeting?.title || 'Meeting Room'}</span>
          <span className="text-green-400 text-sm font-mono">{formatTime(time)}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm font-mono">{id}</span>
          <button onClick={copyInvite}
            className="text-xs bg-gray-600 hover:bg-gray-500 text-white px-3 py-1.5 rounded-lg transition">
            {copied ? '✅ Copied!' : '🔗 Copy Invite'}
          </button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4 grid grid-cols-2 gap-3 max-w-5xl mx-auto w-full">
        {/* Your Video */}
        <div className="relative bg-gray-700 rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {!videoOff
            ? <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {name[0].toUpperCase()}
                </div>
              </div>
          }
          <span className="absolute bottom-2 left-3 text-white text-xs bg-black/50 px-2 py-0.5 rounded">
            {name} (You) {muted ? '🔇' : ''}
          </span>
        </div>

        {/* Fake Participants */}
        {FAKE_PARTICIPANTS.map((p, i) => (
          <div key={p} className="relative bg-gray-700 rounded-2xl flex items-center justify-center"
            style={{ aspectRatio: '16/9' }}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold
              ${['bg-green-600', 'bg-purple-600', 'bg-yellow-600'][i]}`}>
              {p[0]}
            </div>
            <span className="absolute bottom-2 left-3 text-white text-xs bg-black/50 px-2 py-0.5 rounded">{p}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 py-4 flex items-center justify-center gap-6 border-t border-gray-700">
        {controls.map(btn => (
          <button key={btn.label} onClick={btn.action}
            className="flex flex-col items-center gap-1 text-white hover:text-blue-400 transition min-w-[56px]">
            <span className="text-2xl">{btn.icon}</span>
            <span className="text-xs">{btn.label}</span>
          </button>
        ))}
        <button onClick={() => router.push('/')}
          className="bg-red-500 hover:bg-red-600 text-white px-7 py-2.5 rounded-xl font-medium ml-6 transition">
          Leave
        </button>
      </div>
    </div>
  );
}

export default function MeetingPage() {
  return <Suspense><MeetingRoom /></Suspense>;
}