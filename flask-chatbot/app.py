"""
Flask Chatbot Template — powered by Claude (Anthropic)
-------------------------------------------------------
Customize config.json to brand this for any client.
Set secrets in .env (see .env.example).
"""

import json
import os
from pathlib import Path

import anthropic
from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request, session

load_dotenv()

# ── App setup ────────────────────────────────────────────────────────────────

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev-secret-change-in-production")

# ── Load client config ────────────────────────────────────────────────────────

CONFIG_PATH = Path(__file__).parent / "config.json"

def load_config() -> dict:
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

CONFIG = load_config()

# ── Anthropic client ──────────────────────────────────────────────────────────

anthropic_client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

MODEL = "claude-sonnet-4-6"
MAX_TOKENS = 1024
# Keep last N message pairs to stay within context limits while preserving flow
MAX_HISTORY_PAIRS = 10


# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    """Serve the chat UI, injecting safe config values."""
    # Only pass non-sensitive config to the template
    ui_config = {
        "company_name": CONFIG["company_name"],
        "tagline": CONFIG.get("tagline", ""),
        "primary_color": CONFIG["primary_color"],
        "secondary_color": CONFIG["secondary_color"],
        "accent_color": CONFIG.get("accent_color", CONFIG["primary_color"]),
        "logo_url": CONFIG.get("logo_url", ""),
        "favicon_url": CONFIG.get("favicon_url", ""),
        "chat_placeholder": CONFIG.get("chat_placeholder", "Type a message..."),
        "welcome_message": CONFIG.get("welcome_message", "Hi! How can I help you?"),
        "bot_name": CONFIG.get("bot_name", "Assistant"),
        "contact_form": CONFIG.get("contact_form", {"enabled": True}),
    }
    # EmailJS keys are public-safe (they're meant for frontend use)
    emailjs_config = {
        "service_id": os.environ.get("EMAILJS_SERVICE_ID", ""),
        "template_id": os.environ.get("EMAILJS_TEMPLATE_ID", ""),
        "public_key": os.environ.get("EMAILJS_PUBLIC_KEY", ""),
    }
    return render_template("index.html", config=ui_config, emailjs=emailjs_config)


@app.route("/chat", methods=["POST"])
def chat():
    """
    Accept a user message, maintain session history, and return Claude's reply.

    Request JSON: { "message": "user text" }
    Response JSON: { "reply": "bot text" } or { "error": "..." }
    """
    data = request.get_json(silent=True)
    if not data or not data.get("message", "").strip():
        return jsonify({"error": "Message is required."}), 400

    user_message = data["message"].strip()

    # Retrieve or initialise conversation history for this session
    if "history" not in session:
        session["history"] = []

    history: list[dict] = session["history"]

    # Append the new user turn
    history.append({"role": "user", "content": user_message})

    # Trim to avoid runaway context (keep most-recent pairs)
    if len(history) > MAX_HISTORY_PAIRS * 2:
        history = history[-(MAX_HISTORY_PAIRS * 2):]

    system_prompt = (
        f"You are {CONFIG.get('bot_name', 'an assistant')} for "
        f"{CONFIG['company_name']}.\n\n"
        f"{CONFIG['business_context']}\n\n"
        "Keep answers concise (2–4 sentences unless more detail is needed). "
        "Always be helpful, warm, and on-brand."
    )

    try:
        response = anthropic_client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=system_prompt,
            messages=history,
        )
        bot_reply = response.content[0].text
    except anthropic.AuthenticationError:
        return jsonify({"error": "Invalid API key. Please check your ANTHROPIC_API_KEY."}), 500
    except anthropic.RateLimitError:
        return jsonify({"error": "Rate limit reached. Please try again in a moment."}), 429
    except anthropic.APIError as e:
        app.logger.error("Anthropic API error: %s", e)
        return jsonify({"error": "The AI service is temporarily unavailable."}), 502
    except Exception as e:
        app.logger.error("Unexpected error: %s", e)
        return jsonify({"error": "Something went wrong. Please try again."}), 500

    # Append assistant reply to history and persist in session
    history.append({"role": "assistant", "content": bot_reply})
    session["history"] = history
    session.modified = True

    return jsonify({"reply": bot_reply})


@app.route("/reset", methods=["POST"])
def reset():
    """Clear conversation history for a fresh start."""
    session.pop("history", None)
    return jsonify({"status": "ok"})


@app.route("/health")
def health():
    """Simple health check endpoint for uptime monitors."""
    return jsonify({"status": "ok", "company": CONFIG["company_name"]})


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV", "development") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)
