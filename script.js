// Handle BMI Calculation and Workout Retrieval
document.getElementById('bmiForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get user inputs
    const age = document.getElementById('age').value;
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    const goal = document.getElementById('goal').value;

    // Calculate BMI
    const bmi = (weight / ((height / 100) ** 2)).toFixed(2);
    let category;

    if (bmi < 18.5) {
        category = "underweight";
    } else if (bmi >= 18.5 && bmi < 24.9) {
        category = "perfectly_fit";
    } else if (bmi >= 25 && bmi < 29.9) {
        category = "overweight";
    } else {
        category = "obese";
    }

    // Fetch workout plans from the backend
    try {
        const response = await fetch('http://localhost:3000/api/workouts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category, goal }),
        });

        const data = await response.json();

        // Display workouts
        const outputDiv = document.getElementById('workout-plans');
        outputDiv.innerHTML = `<h3>BMI: ${bmi} (${category.replace('_', ' ')})</h3>`;

        if (data.length) {
            data.forEach(workout => {
                const workoutDiv = document.createElement('div');
                workoutDiv.innerHTML = `
                    <h4>${workout.name}</h4>
                    <p>${workout.description}</p>
                    <p><strong>Sets:</strong> ${workout.sets} | <strong>Reps:</strong> ${workout.reps}</p>
                    <p><strong>Equipment:</strong> ${workout.equipment}</p>
                    <p><strong>Target Muscle:</strong> ${workout.targetMuscle}</p>
                `;
                outputDiv.appendChild(workoutDiv);
            });
        } else {
            outputDiv.innerHTML += `<p>No workouts found for your category and goal.</p>`;
        }
    } catch (error) {
        console.error('Error fetching workouts:', error);
    }
});
