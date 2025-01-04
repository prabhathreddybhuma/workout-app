from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database.db_setup import Base

class ProgressTracker(Base):
    __tablename__ = 'progress_tracker'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    date = Column(String, nullable=False)  # Example: "2025-01-02"
    calories_burned = Column(Float, nullable=False)
    feedback = Column(String, nullable=True)  # Example: "Workout was too hard."

    user = relationship("User", back_populates="progress_tracker")

    def __repr__(self):
        return f"<ProgressTracker(user_id={self.user_id}, date={self.date}, calories_burned={self.calories_burned})>"
