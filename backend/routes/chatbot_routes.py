### chatbot_routes.py
from flask import Blueprint, request, jsonify
import openai
import os

chatbot_routes = Blueprint('chatbot', __name__)

# Load environment variables
openai.api_key = os.getenv("CHATGPT_API_KEY")

## Chatbot Integration
@chatbot_routes.route('/chat', methods=['POST'])
def chatbot():
    data = request.json
    user_message = data['message']

    try:
        # Call ChatGPT API
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=f"User asked: {user_message}\nProvide a helpful response:",
            max_tokens=100
        )
        chatbot_response = response['choices'][0]['text'].strip()
        return jsonify({"response": chatbot_response})
    except Exception as e:
        return jsonify({"message": "Error in chatbot communication.", "error": str(e)}), 500
