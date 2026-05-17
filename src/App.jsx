import { useToast } from './hooks/useToast'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Projects from './components/sections/Projects'
import Skills from './components/sections/Skills'
import Contact from './components/sections/Contact'
import Toast from './components/ui/Toast'

export default function App() {
  const { toast, showToast } = useToast()

  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact showToast={showToast} />
      </main>
      <Footer />
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  )
}
