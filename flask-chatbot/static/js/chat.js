/**
 * Flask Chatbot Template — Frontend Logic
 * ----------------------------------------
 * Handles chat UI, message rendering, typing indicators,
 * tab switching, and the EmailJS contact form.
 *
 * Config is injected as window.CHAT_CONFIG by the template.
 */

(() => {
  "use strict";

  // ── DOM refs ──────────────────────────────────────────────────────────────

  const messagesArea   = document.getElementById("messages-area");
  const userInput      = document.getElementById("user-input");
  const sendBtn        = document.getElementById("send-btn");
  const typingIndicator = document.getElementById("typing-indicator");
  const resetBtn       = document.getElementById("reset-btn");
  const chatPanel      = document.getElementById("chat-panel");
  const contactPanel   = document.getElementById("contact-panel");
  const tabChat        = document.getElementById("tab-chat");
  const tabContact     = document.getElementById("tab-contact");
  const contactForm    = document.getElementById("contact-form");
  const formFeedback   = document.getElementById("form-feedback");
  const submitBtn      = document.getElementById("submit-btn");

  const cfg = window.CHAT_CONFIG || {};

  // ── Tab switching ─────────────────────────────────────────────────────────

  function activateTab(tab) {
    const isChat = tab === "chat";
    chatPanel.classList.toggle("active", isChat);
    contactPanel.classList.toggle("active", !isChat);
    tabChat.classList.toggle("active", isChat);
    tabContact.classList.toggle("active", !isChat);
    if (isChat) userInput.focus();
  }

  tabChat?.addEventListener("click", () => activateTab("chat"));
  tabContact?.addEventListener("click", () => activateTab("contact"));

  // ── Message rendering ─────────────────────────────────────────────────────

  /**
   * Append a message bubble to the chat window.
   * @param {"user"|"bot"} role
   * @param {string} text  Plain text (bot replies are lightly formatted)
   */
  function appendMessage(role, text) {
    const row = document.createElement("div");
    row.className = `msg-row ${role}`;

    const avatar = document.createElement("div");
    avatar.className = "msg-avatar";
    avatar.textContent = role === "bot" ? "🤖" : "👤";
    avatar.setAttribute("aria-hidden", "true");

    const bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    // Sanitise and lightly format bot text (bold, line-breaks)
    bubble.innerHTML = role === "bot" ? formatBotText(text) : escapeHtml(text);

    row.appendChild(avatar);
    row.appendChild(bubble);
    messagesArea.appendChild(row);
    scrollToBottom();
    return bubble;
  }

  /** Escape HTML to prevent XSS in user messages. */
  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * Light markdown-ish formatting for bot replies only.
   * Supports **bold**, line breaks, and basic bullet points.
   */
  function formatBotText(text) {
    // Escape first, then selectively restore formatting
    let html = escapeHtml(text);
    // **bold**
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    // *italic*
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
    // Line breaks
    html = html.replace(/\n/g, "<br>");
    return html;
  }

  function scrollToBottom() {
    messagesArea.scrollTo({ top: messagesArea.scrollHeight, behavior: "smooth" });
  }

  // ── Typing indicator ──────────────────────────────────────────────────────

  function showTyping() {
    typingIndicator.classList.add("visible");
    scrollToBottom();
  }

  function hideTyping() {
    typingIndicator.classList.remove("visible");
  }

  // ── Send message ──────────────────────────────────────────────────────────

  async function sendMessage() {
    const text = userInput.value.trim();
    if (!text || sendBtn.disabled) return;

    userInput.value = "";
    autoResize(userInput);
    appendMessage("user", text);

    // Disable input while waiting
    sendBtn.disabled = true;
    userInput.disabled = true;
    showTyping();

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      hideTyping();

      if (!res.ok || data.error) {
        appendMessage("bot", data.error || "Sorry, something went wrong. Please try again.");
      } else {
        appendMessage("bot", data.reply);
      }
    } catch {
      hideTyping();
      appendMessage("bot", "Connection error. Please check your internet and try again.");
    } finally {
      sendBtn.disabled = false;
      userInput.disabled = false;
      userInput.focus();
    }
  }

  // ── Input events ──────────────────────────────────────────────────────────

  sendBtn?.addEventListener("click", sendMessage);

  userInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  /** Auto-grow textarea as user types. */
  function autoResize(el) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  userInput?.addEventListener("input", () => autoResize(userInput));

  // ── Reset conversation ────────────────────────────────────────────────────

  resetBtn?.addEventListener("click", async () => {
    try {
      await fetch("/reset", { method: "POST" });
    } catch { /* non-critical */ }

    // Clear UI and show welcome message again
    messagesArea.innerHTML = "";
    if (cfg.welcome_message) {
      appendMessage("bot", cfg.welcome_message);
    }
    userInput.focus();
  });

  // ── Contact form (EmailJS) ────────────────────────────────────────────────

  function showFeedback(type, msg) {
    formFeedback.className = `form-feedback ${type}`;
    formFeedback.textContent = msg;
    formFeedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  contactForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!window.emailjs) {
      showFeedback("error", "Email service not loaded. Please refresh and try again.");
      return;
    }

    const ejs = window.EMAILJS_CONFIG || {};
    if (!ejs.service_id || !ejs.template_id || !ejs.public_key) {
      showFeedback("error", "Email service is not configured. Please contact us directly.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = "<span>Sending…</span>";

    const params = {
      from_name:    document.getElementById("contact-name").value.trim(),
      from_email:   document.getElementById("contact-email").value.trim(),
      message:      document.getElementById("contact-message").value.trim(),
      to_name:      cfg.recipient_name || cfg.company_name || "Team",
      company_name: cfg.company_name || "",
    };

    try {
      await emailjs.send(ejs.service_id, ejs.template_id, params, ejs.public_key);
      showFeedback("success", "✓ Message sent! We'll get back to you within 24 hours.");
      contactForm.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      showFeedback("error", "Failed to send. Please try again or email us directly.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "<span>Send Message</span> <span>→</span>";
    }
  });

  // ── Init ──────────────────────────────────────────────────────────────────

  function init() {
    // Show welcome message
    if (cfg.welcome_message) {
      appendMessage("bot", cfg.welcome_message);
    }
    // Activate chat tab by default
    activateTab("chat");
    userInput?.focus();
  }

  init();
})();
