from database import SessionLocal, engine
from models import Meeting, Base
import datetime, random, string

Base.metadata.create_all(bind=engine)
db = SessionLocal()

def gen_id():
    d = ''.join(random.choices(string.digits, k=9))
    return f"{d[:3]}-{d[3:6]}-{d[6:]}"

now = datetime.datetime.utcnow()

sample_meetings = [
    {"title": "Team Standup",     "description": "Daily sync with the team",       "scheduled_at": now + datetime.timedelta(hours=2),  "duration_minutes": 30},
    {"title": "Product Review",   "description": "Q3 product feature walkthrough",  "scheduled_at": now + datetime.timedelta(days=1),   "duration_minutes": 60},
    {"title": "Interview Round 1","description": "Engineering candidate interview", "scheduled_at": now + datetime.timedelta(days=2),   "duration_minutes": 45},
    {"title": "Design Sync",      "description": "UI review with design team",      "scheduled_at": now - datetime.timedelta(hours=3),  "duration_minutes": 30},
    {"title": "Client Call",      "description": "Weekly client check-in",          "scheduled_at": now - datetime.timedelta(days=1),   "duration_minutes": 60},
]

for m in sample_meetings:
    mid = gen_id()
    db.add(Meeting(meeting_id=mid, invite_link=f"/join?meetingId={mid}", **m))

db.commit()
print("✅ Database seeded with sample meetings!")