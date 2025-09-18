from flask import Flask, render_template, request, jsonify, Response
import json, os

app = Flask(__name__)

MESSAGES_FILE = "messages.json"
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "changeme")  # set in k8s secret

if os.path.exists(MESSAGES_FILE):
    try:
        with open(MESSAGES_FILE, "r") as f:
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
    messages.append(new_message)

    with open(MESSAGES_FILE, "w") as f:
        json.dump(messages, f, indent=4)

    return jsonify({"status": "success", "message": "✅ Thank you! Your message has been saved."})

# Secure messages route
@app.route("/messages")
def view_messages():
    auth = request.authorization
    if not auth or auth.password != ADMIN_PASSWORD:
        return Response("Unauthorized", 401, {"WWW-Authenticate": "Basic realm='Login Required'"})
    return jsonify(messages)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
