export default function Toast({ message, visible }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0' : '12px'})`,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.25s ease, transform 0.25s ease',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: '#22d3ee',
          color: '#09090b',
          fontWeight: 600,
          fontSize: '13px',
          padding: '10px 20px',
          borderRadius: '8px',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 24px rgba(34,211,238,0.35)',
        }}
      >
        {message}
      </div>
    </div>
  )
}
