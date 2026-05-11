"""
Abel Atnafu — Portfolio
Flask backend: serves the portfolio page and injects config/EmailJS keys.
"""

import json
import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template

load_dotenv()

app = Flask(__name__)

CONFIG_PATH = Path(__file__).parent / "config.json"


def load_config() -> dict:
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


CONFIG = load_config()


@app.route("/")
def index():
    emailjs_config = {
        "service_id":  os.environ.get("EMAILJS_SERVICE_ID", ""),
        "template_id": os.environ.get("EMAILJS_TEMPLATE_ID", ""),
        "public_key":  os.environ.get("EMAILJS_PUBLIC_KEY", ""),
    }
    return render_template("index.html", config=CONFIG, emailjs=emailjs_config)


@app.route("/health")
def health():
    return jsonify({"status": "ok", "owner": CONFIG.get("name", "")})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV", "development") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)
