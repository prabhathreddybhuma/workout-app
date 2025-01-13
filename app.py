from flask import Flask, render_template, request

app = Flask(__name__)

# Hardcoded workout plans
workouts = {
    "underweight": ["Push-ups", "Pull-ups", "Weight Lifting"],
    "perfectly_fit": ["Yoga", "Cardio", "Strength Training"],
    "overweight": ["HIIT", "Cycling", "Jogging"],
    "obese": ["Walking", "Low-impact Aerobics", "Swimming"],
}

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/result", methods=["POST"])
def result():
    # Get user inputs
    weight = float(request.form["weight"])
    height = float(request.form["height"]) / 100  # Convert to meters
    goal = request.form["goal"]

    # Calculate BMI
    bmi = weight / (height ** 2)
    if bmi < 18.5:
        category = "underweight"
    elif 18.5 <= bmi < 25:
        category = "perfectly_fit"
    elif 25 <= bmi < 30:
        category = "overweight"
    else:
        category = "obese"

    # Get workout suggestions
    suggested_workouts = workouts[category]
    if category != "perfectly_fit" and goal == "lose_weight":
        suggested_workouts = [w for w in suggested_workouts if w != "Weight Lifting"]

    return render_template("result.html", bmi=round(bmi, 2), category=category, workouts=suggested_workouts)

if __name__ == "__main__":
    app.run(debug=True)
