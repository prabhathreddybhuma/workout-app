### chatgpt_api.py
import openai
import os

# Initialize OpenAI API key from environment variables
openai.api_key = os.getenv("CHATGPT_API_KEY")

def query_chatgpt(prompt):
    """
    Sends a prompt to the ChatGPT API and retrieves the response.

    :param prompt: The user prompt to send to ChatGPT.
    :return: The response from ChatGPT.
    """
    try:
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            max_tokens=100,
            temperature=0.7
        )
        return response['choices'][0]['text'].strip()
    except openai.error.OpenAIError as e:
        raise Exception(f"Error querying ChatGPT API: {e}")

# Example usage
if __name__ == "__main__":
    user_prompt = "What are some good exercises for beginners?"
    try:
        answer = query_chatgpt(f"User asked: {user_prompt}\nProvide a helpful response:")
        print("ChatGPT Response:", answer)
    except Exception as e:
        print("Error:", e)