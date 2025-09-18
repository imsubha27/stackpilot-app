from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

MESSAGES_FILE = "messages.json"

# Load existing messages (if file exists)
if os.path.exists(MESSAGES_FILE):
    with open(MESSAGES_FILE, "r") as f:
        try:
            messages = json.load(f)
        except json.JSONDecodeError:
            messages = []
else:
    messages = []

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/contact", methods=["POST"])
def contact():
    name = request.form.get("name")
    email = request.form.get("email")
    message = request.form.get("message")

    if not name or not email or not message:
        return jsonify({"status": "error", "message": "All fields are required!"}), 400

    new_message = {"name": name, "email": email, "message": message}

    # Save in memory
    messages.append(new_message)

    # Save to file
    with open(MESSAGES_FILE, "w") as f:
        json.dump(messages, f, indent=4)

    print(f"📩 New message saved: {name} ({email}) -> {message}")

    return jsonify({"status": "success", "message": "✅ Thank you! Your message has been saved."})

# Optional: View messages (for admin use)
@app.route("/messages")
def view_messages():
    return jsonify(messages)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
