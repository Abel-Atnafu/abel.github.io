import { projects } from '../../data/projects'
import SectionHeader from '../ui/SectionHeader'
import ProjectCard from '../ui/ProjectCard'
import ScrollReveal from '../ui/ScrollReveal'

export default function Projects() {
  return (
    <section
      id="projects"
      style={{ padding: '96px 24px' }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <ScrollReveal>
          <SectionHeader
            title="Projects"
            subtitle="A selection of things I've built — for clients, for fun, and for learning."
          />
        </ScrollReveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {projects.map((project, i) => (
            <ScrollReveal key={project.id} delay={i * 80}>
              <ProjectCard {...project} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
