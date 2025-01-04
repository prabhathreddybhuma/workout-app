from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database.db_setup import Base

class WorkoutSchedule(Base):
    __tablename__ = 'workout_schedules'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    day = Column(String, nullable=False)  # Example: "Monday"
    exercises = Column(String, nullable=False)  # Example: "Push-ups, Squats, Plank"

    user = relationship("User", back_populates="workout_schedules")

    def __repr__(self):
        return f"<WorkoutSchedule(user_id={self.user_id}, day={self.day}, exercises={self.exercises})>"
