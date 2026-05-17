export default function SectionHeader({ title, subtitle, className = '' }) {
  return (
    <div className={`mb-12 ${className}`}>
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text mb-3">
        {title}<span className="text-accent">.</span>
      </h2>
      {subtitle && (
        <p className="text-text-muted text-base leading-relaxed max-w-lg">
          {subtitle}
        </p>
      )}
    </div>
  )
}
