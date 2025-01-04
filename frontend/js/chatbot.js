const chatWindow = document.getElementById("messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", () => {
  const userMessage = userInput.value.trim();

  if (userMessage) {
    // Display user message
    const userMsgDiv = document.createElement("div");
    userMsgDiv.textContent = `You: ${userMessage}`;
    chatWindow.appendChild(userMsgDiv);

    // Send message to backend (ChatGPT API)
    fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Display chatbot response
        const botMsgDiv = document.createElement("div");
        botMsgDiv.textContent = `Bot: ${data.response}`;
        chatWindow.appendChild(botMsgDiv);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Clear input
    userInput.value = "";
  }
});
