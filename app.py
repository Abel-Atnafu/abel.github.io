"""
Flask AI Chatbot Template
Powered by Claude (Anthropic) — claude-sonnet-4-6

Customize config.json to brand this for any client.
Set secrets in .env (copy from .env.example).
"""

import json
import os
from pathlib import Path

import anthropic
from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request, session

load_dotenv()

# ── App ───────────────────────────────────────────────────────────────────────

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev-secret-change-in-production")

# ── Config ────────────────────────────────────────────────────────────────────

CONFIG_PATH = Path(__file__).parent / "config.json"


def load_config() -> dict:
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


CONFIG = load_config()

# ── Anthropic ─────────────────────────────────────────────────────────────────

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

MODEL = "claude-sonnet-4-6"
MAX_TOKENS = 1024
MAX_HISTORY_PAIRS = 10  # keep last N exchanges to bound context size


# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    """Serve the chat UI with safe (non-secret) config values."""
    ui_config = {
        "company_name":    CONFIG["company_name"],
        "tagline":         CONFIG.get("tagline", ""),
        "primary_color":   CONFIG["primary_color"],
        "secondary_color": CONFIG["secondary_color"],
        "accent_color":    CONFIG.get("accent_color", CONFIG["primary_color"]),
        "logo_url":        CONFIG.get("logo_url", ""),
        "favicon_url":     CONFIG.get("favicon_url", ""),
        "chat_placeholder": CONFIG.get("chat_placeholder", "Type a message..."),
        "welcome_message": CONFIG.get("welcome_message", "Hi! How can I help you?"),
        "bot_name":        CONFIG.get("bot_name", "Assistant"),
        "contact_form":    CONFIG.get("contact_form", {"enabled": True}),
    }
    # EmailJS keys are public-safe — they are designed for frontend use
    emailjs_config = {
        "service_id":  os.environ.get("EMAILJS_SERVICE_ID", ""),
        "template_id": os.environ.get("EMAILJS_TEMPLATE_ID", ""),
        "public_key":  os.environ.get("EMAILJS_PUBLIC_KEY", ""),
    }
    return render_template("index.html", config=ui_config, emailjs=emailjs_config)


@app.route("/chat", methods=["POST"])
def chat():
    """
    Receive a user message, call Claude, return the reply.

    Request  JSON : { "message": "..." }
    Response JSON : { "reply": "..." } or { "error": "..." }
    """
    data = request.get_json(silent=True)
    if not data or not data.get("message", "").strip():
        return jsonify({"error": "Message is required."}), 400

    user_message = data["message"].strip()

    # Session-scoped conversation history (no database needed)
    history: list[dict] = session.get("history", [])
    history.append({"role": "user", "content": user_message})

    # Trim oldest pairs to keep context manageable
    if len(history) > MAX_HISTORY_PAIRS * 2:
        history = history[-(MAX_HISTORY_PAIRS * 2):]

    system_prompt = (
        f"You are {CONFIG.get('bot_name', 'an assistant')} for "
        f"{CONFIG['company_name']}.\n\n"
        f"{CONFIG['business_context']}\n\n"
        "Keep answers concise (2–4 sentences unless more detail is genuinely needed). "
        "Always be helpful, warm, and on-brand."
    )

    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=system_prompt,
            messages=history,
        )
        bot_reply = response.content[0].text

    except anthropic.AuthenticationError:
        return jsonify({"error": "Invalid API key. Check your ANTHROPIC_API_KEY."}), 500
    except anthropic.RateLimitError:
        return jsonify({"error": "Rate limit reached — please try again in a moment."}), 429
    except anthropic.APIError as exc:
        app.logger.error("Anthropic API error: %s", exc)
        return jsonify({"error": "AI service temporarily unavailable."}), 502
    except Exception as exc:
        app.logger.error("Unexpected error: %s", exc)
        return jsonify({"error": "Something went wrong. Please try again."}), 500

    history.append({"role": "assistant", "content": bot_reply})
    session["history"] = history
    session.modified = True

    return jsonify({"reply": bot_reply})


@app.route("/reset", methods=["POST"])
def reset():
    """Clear session conversation history."""
    session.pop("history", None)
    return jsonify({"status": "ok"})


@app.route("/health")
def health():
    """Uptime-monitor endpoint."""
    return jsonify({"status": "ok", "company": CONFIG["company_name"]})


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV", "development") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)
