### workout_routes.py
from flask import Blueprint, request, jsonify
from models import WorkoutSchedule, User
from database.db_setup import SessionLocal

workout_routes = Blueprint('workout', __name__)
db = SessionLocal()

## Generate Workout Schedule
@workout_routes.route('/generate_schedule', methods=['GET'])
def generate_schedule():
    user_id = request.args.get('user_id')
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return jsonify({"message": "User not found."}), 404

    # Example AI-generated schedule (replace with your algorithm)
    schedule = [
        {"day": "Monday", "exercises": "Push-ups, Squats, Plank"},
        {"day": "Tuesday", "exercises": "Jumping Jacks, Lunges, Sit-ups"},
    ]

    for item in schedule:
        workout = WorkoutSchedule(user_id=user.id, day=item['day'], exercises=item['exercises'])
        db.add(workout)

    db.commit()
    return jsonify({"message": "Schedule generated successfully!", "schedule": schedule})

## Track Progress
@workout_routes.route('/progress', methods=['POST'])
def track_progress():
    data = request.json
    progress = WorkoutSchedule(
        user_id=data['user_id'],
        date=data['date'],
        calories_burned=data['calories_burned'],
        feedback=data['feedback']
    )
    db.add(progress)
    db.commit()
    return jsonify({"message": "Progress tracked successfully!"})

## Get Progress
@workout_routes.route('/progress/<int:user_id>', methods=['GET'])
def get_progress(user_id):
    progress = db.query(WorkoutSchedule).filter(WorkoutSchedule.user_id == user_id).all()
    if not progress:
        return jsonify({"message": "No progress data found."}), 404

    progress_data = [
        {
            "date": p.date,
            "calories_burned": p.calories_burned,
            "feedback": p.feedback
        } for p in progress
    ]
    return jsonify({"progress": progress_data})
