/**
 * Flask AI Chatbot Template — Frontend Logic
 * -------------------------------------------
 * Handles: tab switching, message rendering, typing indicator,
 * sending messages to /chat, and the EmailJS contact form.
 *
 * window.CHAT_CONFIG and window.EMAILJS_CONFIG are injected
 * by index.html from the Flask template context.
 */

(() => {
  "use strict";

  // ── DOM refs ────────────────────────────────────────────────

  const $ = (id) => document.getElementById(id);

  const messagesArea    = $("messages-area");
  const userInput       = $("user-input");
  const sendBtn         = $("send-btn");
  const typingWrap      = $("typing-wrap");
  const resetBtn        = $("reset-btn");
  const tabChat         = $("tab-chat");
  const tabContact      = $("tab-contact");
  const chatPanel       = $("chat-panel");
  const contactPanel    = $("contact-panel");
  const contactForm     = $("contact-form");
  const formFeedback    = $("form-feedback");
  const submitBtn       = $("submit-btn");

  const cfg = window.CHAT_CONFIG || {};

  // ── Tab switching ────────────────────────────────────────────

  function setTab(tab) {
    const isChat = tab === "chat";
    chatPanel?.classList.toggle("active", isChat);
    contactPanel?.classList.toggle("active", !isChat);
    tabChat?.classList.toggle("active", isChat);
    tabContact?.classList.toggle("active", !isChat);
    tabChat?.setAttribute("aria-selected", String(isChat));
    tabContact?.setAttribute("aria-selected", String(!isChat));
    if (isChat) userInput?.focus();
  }

  tabChat?.addEventListener("click", () => setTab("chat"));
  tabContact?.addEventListener("click", () => setTab("contact"));

  // ── HTML helpers ─────────────────────────────────────────────

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /** Light formatting for bot text only: **bold**, *italic*, newlines, bullets. */
  function formatBot(text) {
    let h = escapeHtml(text);
    h = h.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    h = h.replace(/\*(.+?)\*/g,     "<em>$1</em>");
    h = h.replace(/\n/g,            "<br>");
    return h;
  }

  // ── Message rendering ────────────────────────────────────────

  function addMessage(role, text) {
    const row = document.createElement("div");
    row.className = `msg-row ${role}`;

    const av = document.createElement("div");
    av.className = "msg-avatar";
    av.setAttribute("aria-hidden", "true");
    av.textContent = role === "bot" ? "🤖" : "👤";

    const bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    bubble.innerHTML = role === "bot" ? formatBot(text) : escapeHtml(text);

    row.append(av, bubble);
    messagesArea.appendChild(row);
    scrollDown();
  }

  function scrollDown() {
    messagesArea.scrollTo({ top: messagesArea.scrollHeight, behavior: "smooth" });
  }

  // ── Typing indicator ─────────────────────────────────────────

  const showTyping = () => { typingWrap?.classList.add("visible"); scrollDown(); };
  const hideTyping = () =>   typingWrap?.classList.remove("visible");

  // ── Send message ─────────────────────────────────────────────

  async function send() {
    const text = userInput.value.trim();
    if (!text || sendBtn.disabled) return;

    userInput.value = "";
    resize(userInput);
    addMessage("user", text);

    sendBtn.disabled = true;
    userInput.disabled = true;
    showTyping();

    try {
      const res  = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      hideTyping();
      addMessage("bot", data.error || data.reply || "Sorry, I couldn't respond. Try again.");
    } catch {
      hideTyping();
      addMessage("bot", "Connection error — please check your internet and try again.");
    } finally {
      sendBtn.disabled = false;
      userInput.disabled = false;
      userInput.focus();
    }
  }

  // ── Input events ─────────────────────────────────────────────

  sendBtn?.addEventListener("click", send);

  userInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  });

  function resize(el) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  userInput?.addEventListener("input", () => resize(userInput));

  // ── Reset ────────────────────────────────────────────────────

  resetBtn?.addEventListener("click", async () => {
    try { await fetch("/reset", { method: "POST" }); } catch { /* non-critical */ }
    messagesArea.innerHTML = "";
    if (cfg.welcome_message) addMessage("bot", cfg.welcome_message);
    userInput?.focus();
  });

  // ── Contact form ─────────────────────────────────────────────

  function feedback(type, msg) {
    if (!formFeedback) return;
    formFeedback.className = `form-feedback ${type}`;
    formFeedback.textContent = msg;
    formFeedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  contactForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!window.emailjs) {
      feedback("error", "Email service not loaded. Please refresh the page.");
      return;
    }

    const ejs = window.EMAILJS_CONFIG || {};
    if (!ejs.service_id || !ejs.template_id || !ejs.public_key) {
      feedback("error", "Contact form is not configured yet. Please reach out directly.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = "<span>Sending…</span>";

    const params = {
      from_name:    $("contact-name")?.value.trim(),
      from_email:   $("contact-email")?.value.trim(),
      message:      $("contact-message")?.value.trim(),
      to_name:      cfg.recipient_name || cfg.company_name || "Team",
      company_name: cfg.company_name || "",
    };

    try {
      await emailjs.send(ejs.service_id, ejs.template_id, params, ejs.public_key);
      feedback("success", "✓ Message sent! We'll get back to you within 24 hours.");
      contactForm.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      feedback("error", "Failed to send — please try again or contact us directly.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "<span>Send Message</span><span aria-hidden='true'>→</span>";
    }
  });

  // ── Init ─────────────────────────────────────────────────────

  function init() {
    if (cfg.welcome_message) addMessage("bot", cfg.welcome_message);
    setTab("chat");
  }

  init();
})();
