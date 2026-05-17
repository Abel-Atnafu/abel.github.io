import { useState, useEffect } from 'react'
import { useActiveSection } from '../../hooks/useActiveSection'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const active = useActiveSection()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        zIndex: 100,
        background: scrolled ? 'rgba(9,9,11,0.95)' : 'rgba(9,9,11,0.80)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
        transition: 'background 0.22s ease, border-color 0.22s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 24px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <a href="#hero" onClick={e => handleNavClick(e, '#hero')} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          {!logoError ? (
            <img
              src="/logo.jpg"
              alt="Abel Atnafu"
              height={32}
              style={{ height: '32px', width: 'auto', borderRadius: '6px' }}
              onError={() => setLogoError(true)}
            />
          ) : (
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#f0f0f0', letterSpacing: '-0.5px' }}>
              Abel<span style={{ color: '#22d3ee' }}>.</span>
            </span>
          )}
        </a>

        {/* Desktop nav */}
        <ul style={{ display: 'flex', gap: '32px', listStyle: 'none', margin: 0, padding: 0 }} className="hidden md:flex">
          {NAV_LINKS.map(({ label, href }) => {
            const sectionId = href.replace('#', '')
            const isActive = active === sectionId
            return (
              <li key={label}>
                <a
                  href={href}
                  onClick={e => handleNavClick(e, href)}
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: isActive ? '#22d3ee' : '#888',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#f0f0f0' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#888' }}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="flex md:hidden"
          onClick={() => setMenuOpen(o => !o)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#f0f0f0',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
          }}
          aria-label="Toggle menu"
        >
          <span style={{ display: 'block', width: '22px', height: '2px', background: menuOpen ? '#22d3ee' : '#f0f0f0', transition: 'background 0.2s, transform 0.2s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: menuOpen ? '#22d3ee' : '#f0f0f0', transition: 'opacity 0.2s', opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: menuOpen ? '#22d3ee' : '#f0f0f0', transition: 'background 0.2s, transform 0.2s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            background: 'rgba(9,9,11,0.98)',
            borderTop: '1px solid var(--border)',
            padding: '16px 24px 24px',
          }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={e => handleNavClick(e, href)}
              style={{
                display: 'block',
                padding: '12px 0',
                fontSize: '16px',
                fontWeight: 500,
                color: active === href.replace('#', '') ? '#22d3ee' : '#f0f0f0',
                textDecoration: 'none',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
