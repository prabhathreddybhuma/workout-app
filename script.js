// Workout data structure
const workouts = {
    1: [
        { name: "Push-ups", sets: 3, reps: 12, timer: 0, category: "Strength" },
        { name: "Pull-ups", sets: 3, reps: 10, timer: 0, category: "Strength" },
        { name: "Squats", sets: 3, reps: 15, timer: 0, category: "Strength" },
        { name: "Plank", sets: 3, reps: 1, timer: 60, category: "Core" }
    ],
    2: [
        { name: "Jogging", sets: 1, reps: 1, timer: 1200, category: "Cardio" },
        { name: "Lunges", sets: 3, reps: 12, timer: 0, category: "Strength" },
        { name: "Crunches", sets: 3, reps: 20, timer: 0, category: "Core" },
        { name: "Mountain Climbers", sets: 3, reps: 30, timer: 45, category: "Cardio" }
    ],
    3: [
        { name: "Bicep Curls", sets: 3, reps: 12, timer: 0, category: "Strength" },
        { name: "Tricep Dips", sets: 3, reps: 10, timer: 0, category: "Strength" },
        { name: "Deadlifts", sets: 3, reps: 10, timer: 0, category: "Strength" },
        { name: "Bench Press", sets: 3, reps: 12, timer: 0, category: "Strength" }
    ],
    4: [
        { name: "Yoga", sets: 1, reps: 1, timer: 1800, category: "Recovery" },
        { name: "Stretching", sets: 1, reps: 1, timer: 900, category: "Recovery" },
        { name: "Meditation", sets: 1, reps: 1, timer: 600, category: "Recovery" },
        { name: "Breathing Exercises", sets: 1, reps: 1, timer: 300, category: "Recovery" }
    ],
    5: [
        { name: "Running", sets: 1, reps: 1, timer: 1800, category: "Cardio" },
        { name: "Jump Rope", sets: 3, reps: 50, timer: 60, category: "Cardio" },
        { name: "Burpees", sets: 3, reps: 15, timer: 45, category: "HIIT" },
        { name: "High Knees", sets: 3, reps: 30, timer: 45, category: "HIIT" }
    ],
    6: [
        { name: "Swimming", sets: 1, reps: 1, timer: 1800, category: "Cardio" },
        { name: "Cycling", sets: 1, reps: 1, timer: 1800, category: "Cardio" },
        { name: "Rowing", sets: 1, reps: 1, timer: 900, category: "Cardio" },
        { name: "Core Strength", sets: 3, reps: 20, timer: 0, category: "Core" }
    ],
    7: [
        { name: "Light Walk", sets: 1, reps: 1, timer: 1800, category: "Recovery" },
        { name: "Stretching", sets: 1, reps: 1, timer: 600, category: "Recovery" },
        { name: "Meal Prep", sets: 1, reps: 1, timer: 0, category: "Recovery" },
        { name: "Relaxation", sets: 1, reps: 1, timer: 600, category: "Recovery" }
    ]
};

class TimerManager {
    constructor() {
        this.activeTimers = {};
        this.setupVisibilityHandler();
    }

    setupVisibilityHandler() {
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                this.saveTimerStates();
            } else {
                this.restoreTimerStates();
            }
        });
    }

    startTimer(index, duration, onTick, onComplete) {
        if (this.activeTimers[index]) {
            return false;
        }

        this.activeTimers[index] = {
            interval: setInterval(() => {
                duration--;
                onTick(duration);
                
                if (duration <= 0) {
                    this.stopTimer(index);
                    onComplete();
                }
            }, 1000),
            startTime: Date.now(),
            duration: duration
        };

        return true;
    }

    stopTimer(index) {
        if (!this.activeTimers[index]) {
            return false;
        }

        clearInterval(this.activeTimers[index].interval);
        delete this.activeTimers[index];
        return true;
    }

    stopAllTimers() {
        Object.keys(this.activeTimers).forEach(index => {
            this.stopTimer(index);
        });
    }

    saveTimerStates() {
        try {
            const timerStates = {};
            Object.entries(this.activeTimers).forEach(([index, timer]) => {
                timerStates[index] = {
                    startTime: timer.startTime,
                    duration: timer.duration
                };
            });
            localStorage.setItem("timerStates", JSON.stringify(timerStates));
        } catch (error) {
            console.error("Failed to save timer states:", error);
        }
    }

    restoreTimerStates() {
        try {
            const savedStates = JSON.parse(localStorage.getItem("timerStates"));
            if (!savedStates) return;

            Object.entries(savedStates).forEach(([index, state]) => {
                const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
                const remaining = state.duration - elapsed;

                if (remaining > 0) {
                    const exercise = workouts[this.currentDay][index];
                    exercise.timer = remaining;
                    this.startTimer(index, remaining, 
                        duration => this.updateTimerDisplay(index, duration),
                        () => this.handleTimerComplete(index)
                    );
                }
            });
            localStorage.removeItem("timerStates");
        } catch (error) {
            console.error("Failed to restore timer states:", error);
        }
    }

    updateTimerDisplay(index, duration) {
        const timerDisplay = document.getElementById(`timer-${index}`);
        if (timerDisplay) {
            timerDisplay.textContent = formatTime(duration);
        }
    }

    handleTimerComplete(index) {
        const exercise = workouts[this.currentDay][index];
        notify(`${exercise.name} completed!`);
    }
}

class WorkoutTracker {
    constructor() {
        this.currentDay = 1;
        this.timerManager = new TimerManager();
        this.initializeApp();
    }

    initializeApp() {
        this.setupNavigation();
        this.setupModal();
        this.setupEventListeners();
        this.requestNotificationPermission();
        // Start with day 1
        this.showDay(1);
    }

    setupNavigation() {
        const buttons = document.querySelectorAll("nav ul li button");
        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                // Remove active class from all buttons
                buttons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Get the day from data-day attribute
                const selectedDay = parseInt(button.getAttribute('data-day'));
                
                // Update current day
                this.currentDay = selectedDay;
                
                // Stop any active timers
                this.timerManager.stopAllTimers();
                
                // Show the new day's workout
                this.showDay(this.currentDay);
            });
        });

        // Set initial active state
        const firstButton = buttons[0];
        if (firstButton) {
            firstButton.classList.add('active');
        }
    }

    setupModal() {
        const modal = document.getElementById("summary-modal");
        const closeBtn = document.querySelector(".close-modal");
        const viewSummaryBtn = document.getElementById("view-summary");

        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                modal.style.display = "none";
            });
        }

        if (viewSummaryBtn) {
            viewSummaryBtn.addEventListener("click", (e) => {
                e.preventDefault();
                this.showWorkoutSummary();
            });
        }

        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }

    setupEventListeners() {
        const exportBtn = document.getElementById("export-data");
        if (exportBtn) {
            exportBtn.addEventListener("click", (e) => {
                e.preventDefault();
                this.exportWorkoutData();
            });
        }
    }

    async requestNotificationPermission() {
        if ("Notification" in window && Notification.permission !== "granted") {
            await Notification.requestPermission();
        }
    }

    showDay(day) {
        if (day < 1 || day > 7) return;

        const dayWorkouts = workouts[day];
        const savedProgress = this.getSavedProgress();
        const workoutContent = document.getElementById('workout-content');

        workoutContent.innerHTML = `
            <h2>Day ${day} Workout Plan</h2>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${this.calculateDayProgress(day)}%"></div>
            </div>
            <div class="workout-categories">
                ${this.generateCategoryTags(dayWorkouts)}
            </div>
            <ul id="workout-list">
                ${this.generateWorkoutList(dayWorkouts, savedProgress, day)}
            </ul>
            <div class="day-summary">
                <h3>Day ${day} Summary</h3>
                <p>Total Exercises: ${dayWorkouts.length}</p>
                <p>Completed: <span id="completed-count">0</span></p>
                <p>Progress: <span id="day-progress">0</span>%</p>
            </div>
            <button id="reset-progress" class="reset-button">Reset Progress</button>
        `;

        this.initializeWorkoutControls();
        this.updateDaySummary();
    }

    generateCategoryTags(dayWorkouts) {
        const categories = [...new Set(dayWorkouts.map(w => w.category))];
        return categories.map(category => 
            `<span class="category-tag" data-category="${category}">${category}</span>`
        ).join("");
    }

    generateWorkoutList(dayWorkouts, savedProgress, day) {
        return dayWorkouts.map((workout, index) => `
            <li class="exercise-item" data-category="${workout.category}">
                <div class="exercise-header">
                    <input type="checkbox" id="complete-${index}" 
                        ${savedProgress[`day${day}_workout${index}_completed`] ? 'checked' : ''}>
                    <span class="exercise-name">${workout.name}</span>
                    <span class="category-label">${workout.category}</span>
                </div>
                <div class="exercise-controls">
                    <div class="sets-reps">
                        <div class="control-group">
                            <label>Sets:</label>
                            <button class="decrement-set" data-index="${index}">-</button>
                            <span class="sets-value" id="sets-${index}">${workout.sets}</span>
                            <button class="increment-set" data-index="${index}">+</button>
                        </div>
                        <div class="control-group">
                            <label>Reps:</label>
                            <button class="decrement-rep" data-index="${index}">-</button>
                            <span class="reps-value" id="reps-${index}">${workout.reps}</span>
                            <button class="increment-rep" data-index="${index}">+</button>
                        </div>
                    </div>
                    ${workout.timer > 0 ? this.generateTimerControls(index, workout.timer) : ''}
                </div>
            </li>
        `).join("");
    }

    generateTimerControls(index, duration) {
        return `
            <div class="timer-container">
                <span class="timer-display" id="timer-${index}">${formatTime(duration)}</span>
                <button class="start-timer" data-index="${index}">Start</button>
                <button class="stop-timer" data-index="${index}" style="display: none;">Stop</button>
            </div>
        `;
    }

    initializeWorkoutControls() {
        this.setupCheckboxes();
        this.setupSetRepControls();
        this.setupTimerControls();
        this.setupResetButton();
    }

    setupCheckboxes() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox, index) => {
            checkbox.addEventListener("change", () => {
                const progress = this.getSavedProgress();
                progress[`day${this.currentDay}_workout${index}_completed`] = checkbox.checked;
                this.saveProgress(progress);
                this.updateDaySummary();
                this.updateExerciseState(checkbox);
            });
        });
    }

    setupSetRepControls() {
        this.setupControlButtons("increment-set", (index) => this.updateValue(index, "sets", 1));
        this.setupControlButtons("decrement-set", (index) => this.updateValue(index, "sets", -1));
        this.setupControlButtons("increment-rep", (index) => this.updateValue(index, "reps", 1));
        this.setupControlButtons("decrement-rep", (index) => this.updateValue(index, "reps", -1));
    }

    setupTimerControls() {
        document.querySelectorAll(".start-timer").forEach(button => {
            button.addEventListener("click", () => this.startTimer(button.dataset.index));
        });

        document.querySelectorAll(".stop-timer").forEach(button => {
            button.addEventListener("click", () => this.stopTimer(button.dataset.index));
        });
    }

    setupControlButtons(className, callback) {
        document.querySelectorAll(`.${className}`).forEach(button => {
            button.addEventListener("click", () => callback(button.dataset.index));
        });
    }

    setupResetButton() {
        const resetButton = document.getElementById("reset-progress");
        if (resetButton) {
            resetButton.addEventListener("click", () => {
                if (confirm("Are you sure you want to reset progress for this day?")) {
                    this.resetProgress();
                }
            });
        }
    }

    updateValue(index, type, change) {
        const element = document.getElementById(`${type}-${index}`);
        if (element) {
            const currentValue = parseInt(element.textContent);
            const newValue = currentValue + change;
            if (newValue > 0) {