function GithubIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function FolderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )
}

export default function ProjectCard({ title, description, tags, githubUrl, liveUrl }) {
  return (
    <div
      style={{
        background: '#161618',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '26px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        transition: 'transform 0.22s cubic-bezier(0.4,0,0.2,1), border-color 0.22s ease, box-shadow 0.22s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.borderColor = 'rgba(34,211,238,0.45)'
        e.currentTarget.style.boxShadow = '0 8px 32px var(--accent-glow)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{
            color: '#22d3ee',
            background: 'var(--accent-dim)',
            borderRadius: '8px',
            padding: '8px',
            display: 'flex',
          }}
        >
          <FolderIcon />
        </div>
        <div style={{ display: 'flex', gap: '12px', color: '#888' }}>
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#888', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#22d3ee'}
              onMouseLeave={e => e.currentTarget.style.color = '#888'}
            >
              <GithubIcon />
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#888', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#22d3ee'}
              onMouseLeave={e => e.currentTarget.style.color = '#888'}
            >
              <ExternalIcon />
            </a>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f0f0f0', letterSpacing: '-0.3px', margin: 0 }}>
        {title}
      </h3>

      {/* Description */}
      <p style={{ fontSize: '14px', color: '#888', lineHeight: '1.7', margin: 0, flex: 1 }}>
        {description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto' }}>
        {tags.map(tag => (
          <span
            key={tag}
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: '#22d3ee',
              background: 'var(--accent-dim)',
              padding: '3px 10px',
              borderRadius: '20px',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
