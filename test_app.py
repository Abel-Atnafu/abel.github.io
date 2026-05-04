"""
Automated tests for Flask AI Chatbot Template.
Run: python test_app.py
"""

import json
import sys
import unittest
from unittest.mock import MagicMock, patch


# ── Patch anthropic before importing app ──────────────────────────────────────
# We need real Exception subclasses so `except anthropic.XxxError` works in app.py.

class _FakeAuthError(Exception):
    pass

class _FakeRateLimitError(Exception):
    pass

class _FakeAPIError(Exception):
    pass

mock_anthropic = MagicMock()
mock_anthropic.AuthenticationError = _FakeAuthError
mock_anthropic.RateLimitError      = _FakeRateLimitError
mock_anthropic.APIError            = _FakeAPIError
sys.modules["anthropic"] = mock_anthropic

import app as flask_app  # noqa: E402


# ── Helpers ───────────────────────────────────────────────────────────────────

def _mock_reply(text="Hello! How can I help?"):
    content = MagicMock()
    content.text = text
    resp = MagicMock()
    resp.content = [content]
    return resp


# ── Config tests ──────────────────────────────────────────────────────────────

class ConfigTests(unittest.TestCase):

    def test_required_keys_present(self):
        for key in ("company_name", "primary_color", "secondary_color",
                    "business_context", "contact_form"):
            self.assertIn(key, flask_app.CONFIG, f"Missing key: {key}")
        print("  ✓ All required config.json keys present")

    def test_colors_are_hex(self):
        import re
        hex_re = re.compile(r"^#[0-9A-Fa-f]{6}$")
        for field in ("primary_color", "secondary_color"):
            self.assertRegex(flask_app.CONFIG[field], hex_re,
                             f"{field} is not a valid hex color")
        print("  ✓ primary_color and secondary_color are valid hex values")

    def test_contact_form_has_enabled_key(self):
        self.assertIn("enabled", flask_app.CONFIG["contact_form"])
        print("  ✓ contact_form.enabled key present")

    def test_business_context_not_empty(self):
        ctx = flask_app.CONFIG.get("business_context", "")
        self.assertGreater(len(ctx.strip()), 50,
                           "business_context is too short")
        print("  ✓ business_context has meaningful content")


# ── Route tests ───────────────────────────────────────────────────────────────

class ChatbotTests(unittest.TestCase):

    def setUp(self):
        flask_app.app.config["TESTING"] = True
        flask_app.app.config["SECRET_KEY"] = "test-secret"
        self.app = flask_app.app.test_client()
        # Always start each test with a clean mock — no leaking side_effects
        flask_app.client.messages.create.reset_mock(side_effect=True, return_value=True)
        flask_app.client.messages.create.side_effect = None
        flask_app.client.messages.create.return_value = _mock_reply()

    # ── Basic routes ──────────────────────────────────────────────

    def test_health(self):
        r = self.app.get("/health")
        self.assertEqual(r.status_code, 200)
        data = r.get_json()
        self.assertEqual(data["status"], "ok")
        self.assertEqual(data["company"], flask_app.CONFIG["company_name"])
        print("  ✓ GET /health → 200 with status + company")

    def test_index_returns_html(self):
        r = self.app.get("/")
        self.assertEqual(r.status_code, 200)
        self.assertIn("text/html", r.content_type)
        html = r.data.decode()
        for marker in ("chat-panel", "contact-panel", "CHAT_CONFIG",
                       "EMAILJS_CONFIG", "chat.js", "style.css"):
            self.assertIn(marker, html, f"Missing in HTML: {marker}")
        print("  ✓ GET / → 200 HTML with all required sections")

    def test_index_brand_colors_in_html(self):
        r = self.app.get("/")
        html = r.data.decode()
        self.assertIn("--primary", html)
        self.assertIn(flask_app.CONFIG["primary_color"], html)
        print("  ✓ GET / → brand colors injected")

    def test_index_no_api_key_in_html(self):
        r = self.app.get("/")
        html = r.data.decode()
        # The actual key value must never appear (key name may appear in comments, that's OK)
        self.assertNotIn("sk-ant-", html)
        # Double-check the variable name isn't accidentally leaked as a JS value
        self.assertNotIn("ANTHROPIC_API_KEY:", html)
        print("  ✓ GET / → API key value NOT present in HTML (secure)")

    def test_reset(self):
        r = self.app.post("/reset")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.get_json()["status"], "ok")
        print("  ✓ POST /reset → 200 ok")

    def test_unknown_route_404(self):
        r = self.app.get("/does-not-exist")
        self.assertEqual(r.status_code, 404)
        print("  ✓ Unknown route → 404")

    # ── /chat validation ──────────────────────────────────────────

    def test_chat_empty_message(self):
        r = self.app.post("/chat", json={"message": ""},
                          content_type="application/json")
        self.assertEqual(r.status_code, 400)
        self.assertIn("error", r.get_json())
        print("  ✓ POST /chat empty message → 400")

    def test_chat_whitespace_message(self):
        r = self.app.post("/chat", json={"message": "   "},
                          content_type="application/json")
        self.assertEqual(r.status_code, 400)
        print("  ✓ POST /chat whitespace-only → 400")

    def test_chat_no_body(self):
        r = self.app.post("/chat", content_type="application/json")
        self.assertEqual(r.status_code, 400)
        print("  ✓ POST /chat no body → 400")

    def test_chat_missing_message_key(self):
        r = self.app.post("/chat", json={"text": "hello"},
                          content_type="application/json")
        self.assertEqual(r.status_code, 400)
        print("  ✓ POST /chat missing 'message' key → 400")

    # ── /chat success ─────────────────────────────────────────────

    def test_chat_success(self):
        flask_app.client.messages.create.return_value = \
            _mock_reply("Our hours are 9am–6pm EST.")

        r = self.app.post("/chat", json={"message": "What are your hours?"},
                          content_type="application/json")
        self.assertEqual(r.status_code, 200)
        data = r.get_json()
        self.assertIn("reply", data)
        self.assertEqual(data["reply"], "Our hours are 9am–6pm EST.")
        print("  ✓ POST /chat valid message → 200 with reply")

    def test_chat_uses_correct_model(self):
        self.app.post("/chat", json={"message": "Hi"},
                      content_type="application/json")
        call_kw = flask_app.client.messages.create.call_args.kwargs
        self.assertEqual(call_kw.get("model"), "claude-sonnet-4-6")
        print("  ✓ Uses model: claude-sonnet-4-6")

    def test_chat_system_prompt_contains_business_context(self):
        self.app.post("/chat", json={"message": "Hi"},
                      content_type="application/json")
        system = flask_app.client.messages.create.call_args.kwargs.get("system", "")
        self.assertIn(flask_app.CONFIG["company_name"], system)
        self.assertIn(flask_app.CONFIG["business_context"], system)
        print("  ✓ System prompt contains company_name and business_context")

    # ── Session / history ─────────────────────────────────────────

    def test_chat_session_history_persists(self):
        """Second message should include the first exchange in history."""
        with self.app as c:
            c.post("/chat", json={"message": "Hello"},
                   content_type="application/json")

            flask_app.client.messages.create.return_value = _mock_reply("We sell electronics!")
            c.post("/chat", json={"message": "What do you sell?"},
                   content_type="application/json")

            messages = flask_app.client.messages.create.call_args.kwargs["messages"]
            # Should have: user1, bot1, user2 (at minimum)
            self.assertGreaterEqual(len(messages), 3)
            self.assertEqual(messages[0]["role"], "user")
            self.assertEqual(messages[0]["content"], "Hello")
            self.assertEqual(messages[1]["role"], "assistant")
            self.assertEqual(messages[2]["role"], "user")
            self.assertEqual(messages[2]["content"], "What do you sell?")
        print("  ✓ Session history: multi-turn conversation carries context")

    def test_chat_reset_clears_history(self):
        """After /reset, next message should start a fresh session."""
        with self.app as c:
            c.post("/chat", json={"message": "First message"},
                   content_type="application/json")
            c.post("/reset")

            flask_app.client.messages.create.return_value = _mock_reply("Hello again!")
            c.post("/chat", json={"message": "Fresh start"},
                   content_type="application/json")

            messages = flask_app.client.messages.create.call_args.kwargs["messages"]
            # Only the new user message — history was cleared
            self.assertEqual(len(messages), 1)
            self.assertEqual(messages[0]["content"], "Fresh start")
        print("  ✓ POST /reset clears history; next chat starts fresh")

    def test_chat_history_trim(self):
        """Messages passed to Claude must stay ≤ MAX_HISTORY_PAIRS * 2."""
        with self.app as c:
            for i in range(flask_app.MAX_HISTORY_PAIRS + 3):
                c.post("/chat", json={"message": f"Message {i}"},
                       content_type="application/json")

            messages = flask_app.client.messages.create.call_args.kwargs["messages"]
            self.assertLessEqual(len(messages), flask_app.MAX_HISTORY_PAIRS * 2)
        print(f"  ✓ History trimmed to ≤ {flask_app.MAX_HISTORY_PAIRS * 2} messages")

    # ── Error handling ────────────────────────────────────────────

    def test_chat_auth_error(self):
        flask_app.client.messages.create.side_effect = _FakeAuthError()
        r = self.app.post("/chat", json={"message": "Hi"},
                          content_type="application/json")
        self.assertEqual(r.status_code, 500)
        self.assertIn("API key", r.get_json()["error"])
        print("  ✓ AuthenticationError → 500 with friendly message")

    def test_chat_rate_limit_error(self):
        flask_app.client.messages.create.side_effect = _FakeRateLimitError()
        r = self.app.post("/chat", json={"message": "Hi"},
                          content_type="application/json")
        self.assertEqual(r.status_code, 429)
        self.assertIn("rate", r.get_json()["error"].lower())
        print("  ✓ RateLimitError → 429 with friendly message")

    def test_chat_generic_api_error(self):
        flask_app.client.messages.create.side_effect = _FakeAPIError("test error")
        r = self.app.post("/chat", json={"message": "Hi"},
                          content_type="application/json")
        self.assertEqual(r.status_code, 502)
        print("  ✓ Generic APIError → 502")

    def test_chat_unexpected_error(self):
        flask_app.client.messages.create.side_effect = RuntimeError("Unexpected")
        r = self.app.post("/chat", json={"message": "Hi"},
                          content_type="application/json")
        self.assertEqual(r.status_code, 500)
        print("  ✓ Unexpected exception → 500 with generic message")

    # ── Static files ──────────────────────────────────────────────

    def test_css_served(self):
        r = self.app.get("/static/css/style.css")
        self.assertEqual(r.status_code, 200)
        self.assertIn("text/css", r.content_type)
        print("  ✓ /static/css/style.css → 200 text/css")

    def test_js_served(self):
        r = self.app.get("/static/js/chat.js")
        self.assertEqual(r.status_code, 200)
        self.assertIn("javascript", r.content_type)
        print("  ✓ /static/js/chat.js → 200")


# ── Static file content tests ─────────────────────────────────────────────────

class StaticFileContentTests(unittest.TestCase):

    @staticmethod
    def _read(path):
        with open(path) as f:
            return f.read()

    def test_css_custom_properties(self):
        css = self._read("static/css/style.css")
        for prop in ("--primary", "--secondary", "--radius", "--transition"):
            self.assertIn(prop, css)
        print("  ✓ CSS has all custom properties")

    def test_css_dark_mode(self):
        css = self._read("static/css/style.css")
        self.assertIn("prefers-color-scheme: dark", css)
        print("  ✓ CSS has dark mode media query")

    def test_css_mobile_breakpoint(self):
        css = self._read("static/css/style.css")
        self.assertIn("max-width: 520px", css)
        print("  ✓ CSS has mobile breakpoint")

    def test_css_typing_animation(self):
        css = self._read("static/css/style.css")
        self.assertIn("typingBounce", css)
        print("  ✓ CSS has typing indicator animation")

    def test_js_xss_protection(self):
        js = self._read("static/js/chat.js")
        self.assertIn("escapeHtml", js)
        self.assertIn("&amp;", js)
        print("  ✓ JS escapes HTML (XSS protection)")

    def test_js_send_function(self):
        js = self._read("static/js/chat.js")
        self.assertIn("async function send()", js)
        print("  ✓ JS has async send() function")

    def test_js_typing_indicator(self):
        js = self._read("static/js/chat.js")
        self.assertIn("showTyping", js)
        self.assertIn("hideTyping", js)
        print("  ✓ JS has typing indicator show/hide")

    def test_js_tab_switching(self):
        js = self._read("static/js/chat.js")
        self.assertIn("setTab", js)
        print("  ✓ JS has tab switching")

    def test_js_emailjs(self):
        js = self._read("static/js/chat.js")
        self.assertIn("emailjs.send", js)
        self.assertIn("EMAILJS_CONFIG", js)
        print("  ✓ JS has EmailJS integration")

    def test_js_auto_resize(self):
        js = self._read("static/js/chat.js")
        self.assertIn("resize(", js)
        print("  ✓ JS has textarea auto-resize")

    def test_html_aria_accessibility(self):
        with open("templates/index.html") as f:
            html = f.read()
        for attr in ("aria-live", "aria-label", "role=", "sr-only"):
            self.assertIn(attr, html)
        print("  ✓ HTML has ARIA accessibility attributes")

    def test_html_no_secret_key(self):
        with open("templates/index.html") as f:
            html = f.read()
        self.assertNotIn("sk-ant-", html)
        self.assertNotIn("ANTHROPIC_API_KEY:", html)
        print("  ✓ HTML template has no hardcoded API secrets")


# ── Runner ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("\n" + "=" * 55)
    print("  Flask AI Chatbot — Full Test Suite")
    print("=" * 55)

    suites = [
        ("Config Tests",       ConfigTests),
        ("Route & API Tests",  ChatbotTests),
        ("Static File Tests",  StaticFileContentTests),
    ]

    total_pass = total_fail = 0
    for name, cls in suites:
        print(f"\n── {name} ──")
        suite = unittest.TestLoader().loadTestsFromTestCase(cls)
        buf = open("/dev/null", "w")
        result = unittest.TextTestRunner(verbosity=0, stream=buf).run(suite)
        passed = result.testsRun - len(result.failures) - len(result.errors)
        total_pass += passed
        total_fail += len(result.failures) + len(result.errors)
        for fail in result.failures + result.errors:
            print(f"  ✗ FAIL: {fail[0]}")
            print(f"    {fail[1].splitlines()[-1]}")

    print("\n" + "=" * 55)
    print(f"  Results: {total_pass} passed, {total_fail} failed")
    print("=" * 55 + "\n")
    sys.exit(0 if total_fail == 0 else 1)
