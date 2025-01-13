// app.js

document.getElementById("bmi-form").addEventListener("submit", function (event) {
    event.preventDefault();
  
    const age = parseInt(document.getElementById("age").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value) / 100; // Convert to meters
    const goal = document.getElementById("goal").value;
  
    if (!age || !weight || !height) {
      document.getElementById("result").innerText = "Please fill all fields.";
      return;
    }
  
    const bmi = (weight / (height * height)).toFixed(1);
    let category = "";
  
    if (bmi < 18.5) {
      category = "Underweight";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      category = "Perfectly Fit";
    } else if (bmi >= 25 && bmi <= 29.9) {
      category = "Overweight";
    } else {
      category = "Obese";
    }
  
    document.getElementById("result").innerText = `Your BMI is ${bmi} (${category}).`;
  
    // Update workouts dynamically
    const workoutList = document.getElementById("workout-list");
    workoutList.innerHTML = ""; // Clear old workouts
    let workouts = [];
  
    if (category === "Underweight") {
      workouts = ["Muscle Building: Push-ups", "Strength Training: Squats"];
    } else if (category === "Overweight" || category === "Obese") {
      workouts = ["Cardio: Running", "Strength: Deadlifts", "Yoga"];
    } else {
      workouts = ["Yoga", "Cardio: Swimming", "Strength: Bench Press"];
    }
  
    workouts.forEach(workout => {
      const workoutItem = document.createElement("div");
      workoutItem.innerText = workout;
      workoutItem.className = "workout-item";
      workoutList.appendChild(workoutItem);
    });
  });
  