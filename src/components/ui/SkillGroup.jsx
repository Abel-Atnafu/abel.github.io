export default function SkillGroup({ category, items }) {
  return (
    <div
      style={{
        background: '#161618',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '24px',
        transition: 'border-color 0.22s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#22d3ee', marginBottom: '14px' }}>
        {category}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {items.map(item => (
          <span
            key={item}
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#c0c0c0',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.07)',
              padding: '4px 12px',
              borderRadius: '20px',
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
