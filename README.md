# Flask AI Chatbot Template

Production-ready AI chatbot powered by **Claude Sonnet 4.6** (Anthropic). Glassmorphism UI, EmailJS contact form, deploy-ready for Vercel and Render.

**To customize for a new client: edit `config.json` and `.env` only.**

---

## Quick Start (< 30 minutes per client)

### 1 · Edit `config.json`

```json
{
  "company_name": "Client Business Name",
  "tagline": "Their tagline",
  "primary_color": "#6C63FF",
  "secondary_color": "#FF6584",
  "logo_url": "https://their-site.com/logo.png",
  "bot_name": "Acme Assistant",
  "welcome_message": "Hi! How can I help you today?",
  "chat_placeholder": "Ask me anything...",
  "business_context": "Everything the bot should know goes here..."
}
```

**`business_context` is the bot's brain.** Include:
- What the business does and who it serves
- Hours, location, contact info
- Products/services with prices (if public)
- FAQs
- What to escalate to a human

### 2 · Set up `.env`

```bash
cp .env.example .env
# Fill in your keys (see sections below)
```

### 3 · Test locally

```bash
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
# → http://localhost:5000
```

---

## Getting API Keys

### Anthropic (chatbot)

1. [console.anthropic.com](https://console.anthropic.com/) → API Keys → Create Key
2. Key starts with `sk-ant-`
3. Paste into `.env` as `ANTHROPIC_API_KEY`

> **Cost:** Claude Sonnet 4.6 is very affordable. A typical small-business chatbot costs $3–10/month in API fees.

### EmailJS (contact form)

1. Sign up free at [emailjs.com](https://www.emailjs.com/)
2. **Email Services** → Add Service (Gmail, Outlook, etc.)
3. **Email Templates** → Create Template with these variables:
   - `{{from_name}}` · `{{from_email}}` (set as Reply-To) · `{{message}}` · `{{company_name}}`
4. **Account → General** → copy your keys:

| Dashboard location | `.env` variable |
|---|---|
| Email Services → Service ID | `EMAILJS_SERVICE_ID` |
| Email Templates → Template ID | `EMAILJS_TEMPLATE_ID` |
| Account → Public Key | `EMAILJS_PUBLIC_KEY` |

> **Free tier:** 200 emails/month — enough for most small business sites.

---

## Deploying

### Vercel (recommended — free)

```bash
npm i -g vercel
vercel          # follow prompts, select Python
```

Then in the Vercel dashboard: **Project → Settings → Environment Variables** — add all keys from `.env`.

Deploy to production:
```bash
vercel --prod
```

> Vercel free tier has a 10s function timeout. Claude responds in 2–4s — well within limits.

### Render (great free alternative)

1. Push code to GitHub (`.env` is git-ignored — add variables in the dashboard)
2. [render.com](https://render.com) → New → Web Service → connect repo
3. Render auto-detects `render.yaml` — confirm settings
4. **Environment** tab → add your keys
5. Click Deploy

> Free Render instances sleep after 15 min of inactivity (~30s cold start). Upgrade to $7/month for always-on.

---

## File Structure

```
/
├── app.py              ← Flask backend + Claude API (server-side only)
├── config.json         ← ✏️  All client customization lives here
├── requirements.txt    ← Python dependencies
├── vercel.json         ← Vercel deployment config
├── render.yaml         ← Render deployment config
├── .env.example        ← Copy to .env and fill in secrets
├── .gitignore
├── static/
│   ├── css/style.css   ← Glassmorphism UI + dark mode + responsive
│   └── js/chat.js      ← Chat logic + EmailJS contact form
└── templates/
    └── index.html      ← Jinja2 template (brand colors injected at runtime)
```

**Client only needs to touch:** `config.json` and `.env`

---

## config.json Reference

| Field | Description | Example |
|---|---|---|
| `company_name` | Display name | `"Acme Corp"` |
| `tagline` | Shown in header | `"Your trusted partner"` |
| `primary_color` | Main brand color (hex) | `"#6C63FF"` |
| `secondary_color` | Gradient end color (hex) | `"#FF6584"` |
| `accent_color` | Highlight color (hex) | `"#43E97B"` |
| `logo_url` | Full URL to logo image | `"https://..."` |
| `bot_name` | Name in chat header | `"Acme Assistant"` |
| `welcome_message` | Bot's first message | `"Hi! How can I help?"` |
| `chat_placeholder` | Input placeholder | `"Ask me anything..."` |
| `business_context` | Bot's knowledge (see above) | long string |
| `contact_form.enabled` | Show/hide contact tab | `true` / `false` |
| `contact_form.title` | Contact section heading | `"Get in Touch"` |
| `contact_form.subtitle` | Contact section subtext | `"Reply in 24h"` |
| `contact_form.recipient_name` | Used in email template | `"Acme Team"` |

---

## Troubleshooting

**"Invalid API key" in chat**
→ Check `ANTHROPIC_API_KEY` in `.env` — no extra spaces, starts with `sk-ant-`.

**Contact form shows "not configured"**
→ All three EmailJS vars must be set: `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`.

**Works locally, broken on Vercel/Render**
→ `.env` is not deployed — add each variable manually in the hosting dashboard.

**No email received after form submit**
→ Check EmailJS dashboard → Email Logs. Verify your email service is connected and the template variable names match exactly.

**Render is slow on first visit**
→ Free tier spins down. Upgrade to the $7/month paid plan for always-on performance.

**Bot ignores important business info**
→ Make `business_context` more explicit — add a dedicated FAQ section and key phrases users are likely to ask.

---

## Security

- `ANTHROPIC_API_KEY` is **never** sent to the browser — all Claude calls are server-side.
- EmailJS keys are public-safe by design (they're rate-limited to your domain in the EmailJS dashboard).
- User input is HTML-escaped before rendering to prevent XSS.
- Conversation history lives in a signed Flask session cookie — no database, no PII stored.

---

Built with Flask · Anthropic Claude · EmailJS
