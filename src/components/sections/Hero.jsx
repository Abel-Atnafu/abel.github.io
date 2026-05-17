import { useState } from 'react'
import ScrollReveal from '../ui/ScrollReveal'

function GithubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function UpworkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.142-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
    </svg>
  )
}

export default function Hero() {
  const [logoError, setLogoError] = useState(false)

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '0 24px',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', paddingTop: '80px' }}>
        {/* Logo */}
        <ScrollReveal delay={0}>
          {!logoError ? (
            <img
              src="/logo.jpg"
              alt="Abel Atnafu"
              style={{ height: '72px', width: 'auto', borderRadius: '12px', marginBottom: '36px' }}
              onError={() => setLogoError(true)}
            />
          ) : (
            <div style={{ width: '72px', height: '72px', borderRadius: '12px', background: '#161618', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '36px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#22d3ee' }}>A</span>
            </div>
          )}
        </ScrollReveal>

        {/* Eyebrow */}
        <ScrollReveal delay={80}>
          <p style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#22d3ee', marginBottom: '12px' }}>
            Hi, I'm
          </p>
        </ScrollReveal>

        {/* Name */}
        <ScrollReveal delay={160}>
          <h1
            style={{
              fontSize: 'clamp(42px, 7vw, 80px)',
              fontWeight: 800,
              letterSpacing: '-2px',
              lineHeight: 1.0,
              color: '#f0f0f0',
              marginBottom: '16px',
            }}
          >
            Abel Atnafu
          </h1>
        </ScrollReveal>

        {/* Title */}
        <ScrollReveal delay={240}>
          <p style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 600, color: '#22d3ee', marginBottom: '20px', letterSpacing: '-0.3px' }}>
            Full-Stack Developer & Freelancer
          </p>
        </ScrollReveal>

        {/* Tagline */}
        <ScrollReveal delay={320}>
          <p
            style={{
              fontSize: 'clamp(15px, 2vw, 17px)',
              color: '#888',
              lineHeight: 1.8,
              maxWidth: '480px',
              marginBottom: '40px',
            }}
          >
            I build fast, real-world web apps — from AI tools and PWAs to bilingual client sites.
            Grade 12 at LIA School, Ethiopia. Headed to VMI (Class of 2030) to study Cyber Security.
          </p>
        </ScrollReveal>

        {/* CTAs */}
        <ScrollReveal delay={400}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <button
              onClick={() => scrollTo('projects')}
              style={{
                padding: '12px 28px',
                borderRadius: '8px',
                background: '#22d3ee',
                color: '#09090b',
                fontWeight: 700,
                fontSize: '15px',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px var(--accent-glow)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              View Projects
            </button>
            <button
              onClick={() => scrollTo('contact')}
              style={{
                padding: '12px 28px',
                borderRadius: '8px',
                background: 'transparent',
                color: '#f0f0f0',
                fontWeight: 600,
                fontSize: '15px',
                border: '1px solid var(--border-hover)',
                cursor: 'pointer',
                transition: 'border-color 0.2s, color 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#22d3ee'; e.currentTarget.style.color = '#22d3ee'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = '#f0f0f0'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Get In Touch
            </button>
          </div>
        </ScrollReveal>

        {/* Social links */}
        <ScrollReveal delay={480}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {[
              { href: 'https://github.com/Abel-Atnafu', icon: <GithubIcon />, label: 'GitHub' },
              { href: 'https://linkedin.com/in/abel-atnafu', icon: <LinkedinIcon />, label: 'LinkedIn' },
              { href: 'https://www.upwork.com/freelancers/abelatnafu', icon: <UpworkIcon />, label: 'Upwork' },
            ].map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{ color: '#555', transition: 'color 0.2s, transform 0.2s', display: 'flex' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#22d3ee'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {icon}
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
