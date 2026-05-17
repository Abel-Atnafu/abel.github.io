import { useState } from 'react'
import emailjs from '@emailjs/browser'
import SectionHeader from '../ui/SectionHeader'
import ScrollReveal from '../ui/ScrollReveal'

const EMAILJS_SERVICE_ID  = 'service_pu8ydyl'
const EMAILJS_TEMPLATE_ID = 'template_xxxxxxx'  // TODO: replace with your EmailJS template ID
const EMAILJS_PUBLIC_KEY  = 'your_public_key'    // TODO: replace with your EmailJS public key

const EMAIL = 'abelatnafu.g@gmail.com'
const WHATSAPP = 'https://wa.me/251XXXXXXXXXX'   // TODO: replace with your number

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function InfoLink({ href, label }) {
  return (
    <a
      href={href}
      target={href.startsWith('mailto') ? undefined : '_blank'}
      rel="noopener noreferrer"
      style={{ color: '#888', textDecoration: 'none', fontSize: '15px', transition: 'color 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.color = '#22d3ee'}
      onMouseLeave={e => e.currentTarget.style.color = '#888'}
    >
      {label}
    </a>
  )
}

export default function Contact({ showToast }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { from_name: form.name, from_email: form.email, message: form.message, to_name: 'Abel' },
        EMAILJS_PUBLIC_KEY
      )
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL)
    showToast('Email copied!')
  }

  const inputStyle = {
    width: '100%',
    background: '#161618',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '15px',
    color: '#f0f0f0',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  }

  return (
    <section
      id="contact"
      style={{ padding: '96px 24px' }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <ScrollReveal>
          <SectionHeader
            title="Get In Touch"
            subtitle="Have a project in mind, or just want to say hello? I reply within 24 hours."
          />
        </ScrollReveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.6fr',
            gap: '56px',
            alignItems: 'start',
          }}
          className="grid-cols-1 md:grid-cols-[1fr_1.6fr]"
        >
          {/* Info column */}
          <ScrollReveal delay={80}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Email with copy */}
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#555', marginBottom: '8px' }}>Email</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '15px', color: '#c0c0c0' }}>{EMAIL}</span>
                  <button
                    onClick={copyEmail}
                    style={{ color: '#555', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#22d3ee'}
                    onMouseLeave={e => e.currentTarget.style.color = '#555'}
                    title="Copy email"
                  >
                    <CopyIcon />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#555', marginBottom: '4px' }}>Find me on</p>
                <InfoLink href="https://github.com/Abel-Atnafu" label="GitHub" />
                <InfoLink href="https://linkedin.com/in/abel-atnafu" label="LinkedIn" />
                <InfoLink href={WHATSAPP} label="WhatsApp" />
              </div>
            </div>
          </ScrollReveal>

          {/* Form column */}
          <ScrollReveal delay={160}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                name="name"
                type="text"
                placeholder="Your name"
                required
                value={form.name}
                onChange={handleChange}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#22d3ee'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <input
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                value={form.email}
                onChange={handleChange}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#22d3ee'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <textarea
                name="message"
                placeholder="Tell me about your project..."
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                onFocus={e => e.target.style.borderColor = '#22d3ee'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />

              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  padding: '13px 28px',
                  borderRadius: '8px',
                  background: status === 'sending' ? 'rgba(34,211,238,0.5)' : '#22d3ee',
                  color: '#09090b',
                  fontWeight: 700,
                  fontSize: '15px',
                  border: 'none',
                  cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
                  alignSelf: 'flex-start',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => { if (status !== 'sending') { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px var(--accent-glow)' }}}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>

              {status === 'success' && (
                <p style={{ fontSize: '14px', color: '#22d3ee', marginTop: '4px' }}>
                  Message sent — I'll get back to you soon.
                </p>
              )}
              {status === 'error' && (
                <p style={{ fontSize: '14px', color: '#f87171', marginTop: '4px' }}>
                  Something went wrong. Try emailing me directly.
                </p>
              )}
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
