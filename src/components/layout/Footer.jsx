export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '28px 24px',
        marginTop: '0',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '13px', color: '#555' }}>
          Built by <span style={{ color: '#888' }}>Abel Atnafu</span> · {year}
        </span>
        <div style={{ display: 'flex', gap: '20px' }}>
          {[
            { label: 'GitHub', href: 'https://github.com/Abel-Atnafu' },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/abel-atnafu-2a5918328' },
            { label: 'Email', href: 'mailto:abelatnafu.g@gmail.com' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={label !== 'Email' ? '_blank' : undefined}
              rel="noopener noreferrer"
              style={{ fontSize: '13px', color: '#555', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#22d3ee'}
              onMouseLeave={e => e.currentTarget.style.color = '#555'}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
