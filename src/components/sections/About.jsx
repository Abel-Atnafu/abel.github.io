import { useState } from 'react'
import SectionHeader from '../ui/SectionHeader'
import ScrollReveal from '../ui/ScrollReveal'

export default function About() {
  const [logoError, setLogoError] = useState(false)

  return (
    <section
      id="about"
      style={{ background: '#111111', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <ScrollReveal>
          <SectionHeader title="About Me" />
        </ScrollReveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '56px',
            alignItems: 'start',
          }}
          className="flex flex-col md:grid"
        >
          {/* Avatar */}
          <ScrollReveal delay={80}>
            <div style={{ flexShrink: 0 }}>
              {!logoError ? (
                <img
                  src="/logo.jpg"
                  alt="Abel Atnafu"
                  style={{ width: '120px', height: '120px', borderRadius: '16px', objectFit: 'cover', border: '1px solid var(--border)' }}
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div style={{ width: '120px', height: '120px', borderRadius: '16px', background: '#161618', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '48px', fontWeight: 800, color: '#22d3ee' }}>A</span>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Text */}
          <ScrollReveal delay={160}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <p style={{ fontSize: '16px', color: '#c0c0c0', lineHeight: 1.8 }}>
                I'm Abel Atnafu — a 17-year-old developer and freelancer based in Forest Hill, Ethiopia.
                I build full-stack web applications, Progressive Web Apps, and client sites that solve real problems for real users.
              </p>
              <p style={{ fontSize: '16px', color: '#c0c0c0', lineHeight: 1.8 }}>
                I freelance on Upwork and Fiverr, accepting payments via Payoneer. My work spans AI-integrated tools
                (like an Anthropic Vision calorie tracker), real estate platforms, bilingual business sites, and event
                ticketing systems. I enjoy working across the whole stack — from Figma mockup to Vercel deploy.
              </p>
              <p style={{ fontSize: '16px', color: '#c0c0c0', lineHeight: 1.8 }}>
                In Fall 2025 I'll be joining Virginia Military Institute as a cadet in the Class of 2030,
                studying Cyber Security. Until then, I'm taking on freelance projects and building things I care about.
              </p>
              <div style={{ marginTop: '8px' }}>
                <a
                  href="#contact"
                  onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#22d3ee',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'gap 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.gap = '10px'}
                  onMouseLeave={e => e.currentTarget.style.gap = '6px'}
                >
                  Let's work together →
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
