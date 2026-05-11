(() => {
  "use strict";

  const cfg  = window.PORTFOLIO_CONFIG || {};
  const ejsCfg = window.EMAILJS_CONFIG || {};

  // ── Nav scroll effect ────────────────────────────────────────

  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => {
    nav?.classList.toggle("scrolled", window.scrollY > 20);
    updateActiveLink();
  }, { passive: true });

  // ── Mobile hamburger ─────────────────────────────────────────

  const hamburger = document.getElementById("hamburger");
  const navLinks  = document.getElementById("nav-links");

  hamburger?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    hamburger.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", String(open));
  });

  // Close on nav link click
  navLinks?.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger?.classList.remove("open");
      hamburger?.setAttribute("aria-expanded", "false");
    });
  });

  // ── Active nav link on scroll ────────────────────────────────

  const sections = ["about", "skills", "projects", "contact"];

  function updateActiveLink() {
    const scrollY = window.scrollY + 100;
    let current = "";
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) current = id;
    }
    navLinks?.querySelectorAll("a").forEach(a => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  }

  // ── Scroll reveal ────────────────────────────────────────────

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // stagger siblings slightly
          const siblings = entry.target.parentElement.querySelectorAll(".reveal");
          let delay = 0;
          siblings.forEach((el, idx) => {
            if (el === entry.target) delay = idx * 60;
          });
          setTimeout(() => entry.target.classList.add("visible"), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  // ── Copy email ───────────────────────────────────────────────

  const copyBtn = document.getElementById("copy-email-btn");
  copyBtn?.addEventListener("click", async () => {
    const email = cfg.email || document.getElementById("email-display")?.textContent?.trim() || "";
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      showToast("Email copied to clipboard");
    } catch {
      showToast("Copy: " + email);
    }
  });

  // ── Toast ────────────────────────────────────────────────────

  let toastTimer;
  function showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  // ── Footer year ──────────────────────────────────────────────

  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Contact form ─────────────────────────────────────────────

  const contactForm  = document.getElementById("contact-form");
  const formFeedback = document.getElementById("form-feedback");
  const submitBtn    = document.getElementById("submit-btn");

  function setFeedback(type, msg) {
    if (!formFeedback) return;
    formFeedback.className = `form-feedback ${type}`;
    formFeedback.textContent = msg;
  }

  contactForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!window.emailjs) {
      setFeedback("error", "Email service not loaded. Please refresh.");
      return;
    }
    if (!ejsCfg.service_id || !ejsCfg.template_id || !ejsCfg.public_key) {
      setFeedback("error", "Contact form not configured — please reach out via email directly.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = "<span>Sending…</span>";

    const params = {
      from_name:    document.getElementById("contact-name")?.value.trim(),
      from_email:   document.getElementById("contact-email")?.value.trim(),
      message:      document.getElementById("contact-message")?.value.trim(),
      to_name:      "Abel",
      company_name: "Abel Atnafu Portfolio",
    };

    try {
      await emailjs.send(ejsCfg.service_id, ejsCfg.template_id, params, ejsCfg.public_key);
      setFeedback("success", "Message sent! I'll get back to you within 24 hours.");
      contactForm.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      setFeedback("error", "Failed to send — please try emailing me directly.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span>Send Message</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>`;
    }
  });

  // ── Smooth scroll for CTA chips / any in-page link ───────────

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

})();
