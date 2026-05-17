import { skills } from '../../data/skills'
import SectionHeader from '../ui/SectionHeader'
import SkillGroup from '../ui/SkillGroup'
import ScrollReveal from '../ui/ScrollReveal'

export default function Skills() {
  return (
    <section
      id="skills"
      style={{ background: '#111111', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <ScrollReveal>
          <SectionHeader title="Skills" />
        </ScrollReveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '20px',
          }}
        >
          {skills.map((group, i) => (
            <ScrollReveal key={group.category} delay={i * 80}>
              <SkillGroup {...group} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
