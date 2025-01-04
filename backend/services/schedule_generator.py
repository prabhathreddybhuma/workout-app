### schedule_generate.py
from models import WorkoutSchedule, User
from database.db_setup import SessionLocal

# Initialize database session
db = SessionLocal()

def generate_workout_schedule(user_id):
    """
    Generate a workout schedule for the user based on their fitness goals and attributes.

    :param user_id: The ID of the user.
    :return: A list of generated workout schedule items.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise Exception("User not found.")

    # Example AI-generated schedule (this can be replaced with a custom algorithm)
    if user.fitness_goal.lower() == "weight loss":
        schedule = [
            {"day": "Monday", "exercises": "Jumping Jacks, Burpees, Plank"},
            {"day": "Wednesday", "exercises": "Cycling, Mountain Climbers, Push-ups"},
            {"day": "Friday", "exercises": "Squats, High Knees, Sit-ups"}
        ]
    elif user.fitness_goal.lower() == "muscle gain":
        schedule = [
            {"day": "Monday", "exercises": "Bench Press, Deadlifts, Pull-ups"},
            {"day": "Wednesday", "exercises": "Bicep Curls, Squats, Overhead Press"},
            {"day": "Friday", "exercises": "Tricep Dips, Lunges, Push-ups"}
        ]
    else:
        schedule = [
            {"day": "Monday", "exercises": "Yoga, Stretching, Light Cardio"},
            {"day": "Wednesday", "exercises": "Walking, Bodyweight Exercises, Swimming"},
            {"day": "Friday", "exercises": "Jogging, Resistance Band Workouts, Pilates"}
        ]

    # Save schedule to the database
    for item in schedule:
        workout = WorkoutSchedule(user_id=user.id, day=item['day'], exercises=item['exercises'])
        db.add(workout)

    db.commit()
    return schedule

# Example usage
if __name__ == "__main__":
    user_id = 1  # Replace with a valid user ID for testing
    try:
        schedule = generate_workout_schedule(user_id)
        print("Generated Workout Schedule:", schedule)
    except Exception as e:
        print("Error:", e)
