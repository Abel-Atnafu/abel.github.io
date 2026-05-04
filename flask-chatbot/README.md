# Flask AI Chatbot Template

A production-ready, plug-and-play AI chatbot powered by Claude (Anthropic). Customize for any client by editing two files: `config.json` and `.env`.

---

## Quick Start (Customize in Under 30 Minutes)

### Step 1 — Edit `config.json`

Open `config.json` and update these fields for your client:

```json
{
  "company_name": "Their Business Name",
  "tagline": "Their tagline",
  "primary_color": "#6C63FF",
  "secondary_color": "#FF6584",
  "logo_url": "https://their-site.com/logo.png",
  "bot_name": "Acme Assistant",
  "welcome_message": "Hi! I'm here to help. What can I do for you?",
  "business_context": "Paste everything the bot should know here..."
}
```

**The `business_context` field is the most important.** Include:
- What the company does and who they serve
- Hours, location, contact info
- Pricing (if public)
- FAQs the bot should be able to answer
- Tone/personality notes
- Anything the bot should *not* answer (escalate to human)

### Step 2 — Set up `.env`

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then fill in the values (see sections below for how to get each one).

### Step 3 — Test locally

```bash
pip install -r requirements.txt
python app.py
```

Open [http://localhost:5000](http://localhost:5000). Done.

---

## Getting Your API Keys

### Anthropic API Key (for the chatbot)

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to **API Keys** → **Create Key**
4. Copy the key — it starts with `sk-ant-`
5. Paste it into `.env` as `ANTHROPIC_API_KEY`

> **Cost:** Claude Sonnet 4.6 is very affordable. A typical chatbot conversation costs under $0.01. Budget $5–10/month for a small business site.

### EmailJS (for the contact form)

1. Sign up free at [emailjs.com](https://www.emailjs.com/)
2. Add an **Email Service** (Gmail, Outlook, etc.) — click your profile → Email Services
3. Create an **Email Template** — use these variables in your template:
   - `{{from_name}}` — sender's name
   - `{{from_email}}` — sender's email (set as Reply-To)
   - `{{message}}` — their message
   - `{{company_name}}` — your client's company name
4. Get your keys from **Account → General**:
   - **Service ID** → `EMAILJS_SERVICE_ID`
   - **Template ID** → `EMAILJS_TEMPLATE_ID`
   - **Public Key** → `EMAILJS_PUBLIC_KEY`

> **Free tier:** 200 emails/month — plenty for most small business sites.

---

## Deploying

### Option A: Vercel (Recommended — free tier)

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project folder
3. Follow prompts (select Python framework)
4. Add environment variables in the Vercel dashboard:
   - Project → Settings → Environment Variables
   - Add each key from your `.env`
5. Redeploy: `vercel --prod`

> **Note:** Vercel's free tier has a 10-second function timeout. Claude typically responds in 2–4 seconds, so this works well.

### Option B: Render (Great free alternative)

1. Push code to a GitHub repo (remove `.env` from git — it's in `.gitignore`)
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Render auto-detects `render.yaml` — review and confirm settings
5. Add environment variables under **Environment** tab
6. Click **Deploy**

> **Note:** Render free tier spins down after 15 minutes of inactivity (cold start ~30s). Upgrade to $7/month to keep it always-on.

---

## Testing Locally

```bash
# 1. Create virtual environment
python -m venv venv
source venv/bin/activate    # Mac/Linux
venv\Scripts\activate       # Windows

# 2. Install dependencies
pip install -r requirements.txt

# 3. Copy and fill in environment variables
cp .env.example .env
# Edit .env with your keys

# 4. Run the server
python app.py

# Visit http://localhost:5000
```

To test without real API keys, temporarily set a fake key — the app will return a graceful error message in the chat.

---

## File Structure

```
flask-chatbot/
├── app.py              ← Flask backend + Claude API integration
├── config.json         ← ALL client customization lives here
├── requirements.txt    ← Python dependencies
├── vercel.json         ← Vercel deployment config
├── render.yaml         ← Render deployment config
├── .env.example        ← Template for environment variables
├── .gitignore          ← Keeps secrets out of git
├── static/
│   ├── css/style.css   ← All styling (glassmorphism design)
│   └── js/chat.js      ← Chat logic + contact form
└── templates/
    └── index.html      ← Main chat UI template
```

**Client-customizable files:** `config.json` and `.env` only.  
**Do not edit:** Everything else (unless you're customizing the template itself).

---

## Customization Reference

### config.json fields

| Field | Description | Example |
|---|---|---|
| `company_name` | Company display name | `"Acme Corp"` |
| `tagline` | Shown in header subtitle | `"Your trusted partner"` |
| `primary_color` | Main brand color (hex) | `"#6C63FF"` |
| `secondary_color` | Gradient end color (hex) | `"#FF6584"` |
| `accent_color` | Accent/highlight color (hex) | `"#43E97B"` |
| `logo_url` | Full URL to company logo | `"https://..."` |
| `bot_name` | Name shown in chat header | `"Acme Assistant"` |
| `welcome_message` | First message bot sends | `"Hi! How can I help?"` |
| `chat_placeholder` | Input placeholder text | `"Ask me anything..."` |
| `business_context` | What the bot knows | See below |
| `contact_form.enabled` | Show/hide contact tab | `true` / `false` |
| `contact_form.title` | Contact panel heading | `"Get in Touch"` |
| `contact_form.subtitle` | Contact panel subtext | `"We'll reply in 24h"` |
| `contact_form.recipient_name` | Used in email template | `"Acme Team"` |

### Writing a great `business_context`

The context is your bot's "brain." A good context includes:

```
You are [Bot Name] for [Company]. [Company] is a [type of business] that serves [target customers].

SERVICES/PRODUCTS:
- Service 1: brief description + price if applicable
- Service 2: ...

CONTACT & HOURS:
- Phone: ...
- Email: ...
- Hours: Mon-Fri 9am-6pm EST

POLICIES:
- Returns: ...
- Shipping: ...

FREQUENTLY ASKED QUESTIONS:
Q: How do I...?
A: You can...

If the user asks about [specific topic], always direct them to [contact method].
```

---

## Troubleshooting

**Bot replies with "Invalid API key"**
→ Check `ANTHROPIC_API_KEY` in your `.env`. Make sure there are no spaces.

**Contact form shows "not configured"**
→ All three EmailJS values must be set in `.env`: `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`.

**"Rate limit reached" error**
→ You've hit Anthropic's rate limits. Wait a moment and retry. For high-traffic sites, upgrade your Anthropic plan.

**Works locally but not on Vercel/Render**
→ Make sure all environment variables are added in the hosting dashboard. The `.env` file is NOT deployed.

**Contact form submits but no email arrives**
→ Check your EmailJS dashboard → Email Logs for errors. Verify your email service is connected and the template variables match.

**Render app is slow on first load**
→ Free Render instances spin down. Upgrade to the $7/month plan for always-on hosting.

---

## Security Notes

- The `ANTHROPIC_API_KEY` never reaches the browser — all AI calls are server-side.
- EmailJS keys are public-safe (they're designed for frontend use).
- The Flask session is cookie-based and signed with `FLASK_SECRET_KEY` — use a long random string in production.
- Message history is session-only (disappears when browser closes) — no database needed.
- Input is escaped to prevent XSS in both the frontend and any rendered output.

---

## Support

Built with ❤️ using Flask + Anthropic Claude + EmailJS.

For questions about customization, contact your developer.
