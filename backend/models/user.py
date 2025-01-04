from sqlalchemy import Column, Integer, String, Float
from database.db_setup import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    height = Column(Float, nullable=False)  # In cm
    weight = Column(Float, nullable=False)  # In kg
    fitness_goal = Column(String, nullable=False)  # Example: "Weight Loss", "Muscle Gain"

    def __repr__(self):
        return f"<User(name={self.name}, email={self.email}, fitness_goal={self.fitness_goal})>"
