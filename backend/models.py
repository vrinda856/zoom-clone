from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime

# Think of this like @Entity class Meeting in Java/Spring Boot
class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(String(12), unique=True, index=True)   # e.g. "123-456-789"
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    host_name = Column(String(100), default="Default User")
    scheduled_at = Column(DateTime, nullable=True)
    duration_minutes = Column(Integer, default=60)
    is_instant = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    invite_link = Column(String(500))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Like @OneToMany in JPA
    participants = relationship("Participant", back_populates="meeting")


# Think of this like @Entity class Participant
class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"))   # Like @ManyToOne
    display_name = Column(String(100))
    joined_at = Column(DateTime, default=datetime.datetime.utcnow)
    left_at = Column(DateTime, nullable=True)

    meeting = relationship("Meeting", back_populates="participants")