document.getElementById("view-schedule").addEventListener("click", () => {
    fetch("/generate_schedule")
      .then((response) => response.json())
      .then((data) => {
        alert(`Today's Schedule: ${data.schedule}`);
      })
      .catch((error) => {
        console.error("Error fetching schedule:", error);
      });
  });
  