from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Database URL (from environment variables)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./fitness_app.db")  # Defaulting to SQLite for development

# Create database engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for database models
Base = declarative_base()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
