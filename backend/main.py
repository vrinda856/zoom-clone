from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import random, string, datetime
from database import engine, get_db, Base
import models

# Create all tables in SQLite (like schema.sql auto-run in Spring Boot)
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allow frontend to call this backend (like CORS config in Spring Security)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Helper ----
def generate_meeting_id():
    digits = ''.join(random.choices(string.digits, k=9))
    return f"{digits[:3]}-{digits[3:6]}-{digits[6:]}"

# ---- DTOs (like Java DTO/Request classes) ----
class MeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    scheduled_at: Optional[datetime.datetime] = None
    duration_minutes: Optional[int] = 60
    is_instant: Optional[bool] = False

class JoinRequest(BaseModel):
    meeting_id: str
    display_name: str

# ---- API Endpoints ----

# GET /api/meetings → returns upcoming and recent meetings
@app.get("/api/meetings")
def get_meetings(db: Session = Depends(get_db)):
    now = datetime.datetime.utcnow()
    upcoming = db.query(models.Meeting).filter(
        models.Meeting.scheduled_at > now
    ).order_by(models.Meeting.scheduled_at).all()
    recent = db.query(models.Meeting).filter(
        models.Meeting.scheduled_at <= now
    ).order_by(models.Meeting.created_at.desc()).limit(5).all()
    return {"upcoming": upcoming, "recent": recent}

# POST /api/meetings → create a new meeting
@app.post("/api/meetings")
def create_meeting(meeting: MeetingCreate, db: Session = Depends(get_db)):
    mid = generate_meeting_id()
    invite_link = f"/join?meetingId={mid}"
    db_meeting = models.Meeting(
        meeting_id=mid,
        title=meeting.title,
        description=meeting.description,
        scheduled_at=meeting.scheduled_at,
        duration_minutes=meeting.duration_minutes,
        is_instant=meeting.is_instant,
        invite_link=invite_link
    )
    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)
    return db_meeting

# GET /api/meetings/{id} → get one meeting by meeting_id
@app.get("/api/meetings/{meeting_id}")
def get_meeting(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(
        models.Meeting.meeting_id == meeting_id
    ).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting

# POST /api/meetings/{id}/join → join a meeting
@app.post("/api/meetings/{meeting_id}/join")
def join_meeting(meeting_id: str, req: JoinRequest, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(
        models.Meeting.meeting_id == meeting_id
    ).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    participant = models.Participant(
        meeting_id=meeting.id,
        display_name=req.display_name
    )
    db.add(participant)
    db.commit()
    return {"success": True, "meeting": meeting}

# GET /api/meetings/{id}/participants → list participants
@app.get("/api/meetings/{meeting_id}/participants")
def get_participants(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(
        models.Meeting.meeting_id == meeting_id
    ).first()
    if not meeting:
        raise HTTPException(404, "Not found")
    return meeting.participants