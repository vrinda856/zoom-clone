# Zoom Clone — Video Conferencing Platform

## 🔗 Live Links
- **Frontend:** https://zoom-clone-one-smoky.vercel.app
- **Backend API:** https://zoom-clone-backend-swgk.onrender.com
- **API Docs:** https://zoom-clone-backend-swgk.onrender.com/docs

## 🛠 Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Python 3, FastAPI, SQLAlchemy |
| Database | SQLite |
| Deployment | Vercel (frontend), Render (backend) |

## 📐 Database Schema
meetings: id, meeting_id (unique), title, description, host_name, scheduled_at, duration_minutes, is_instant, is_active, invite_link, created_at

participants: id, meeting_id (FK → meetings.id), display_name, joined_at, left_at

## 🚀 Local Setup

### Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload

### Frontend
cd frontend
npm install
npm run dev

## 💡 Assumptions
- Default user is pre-authenticated (no login required)
- Video uses browser WebRTC (getUserMedia API)
- Additional participants shown as demo tiles
- Meeting IDs follow format XXX-XXX-XXX