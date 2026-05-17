import { useEffect, useState } from 'react'

const SECTIONS = ['hero', 'about', 'projects', 'skills', 'contact']

export function useActiveSection() {
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 100

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i])
        if (el && el.offsetTop <= scrollY) {
          setActive(SECTIONS[i])
          return
        }
      }
      setActive('hero')
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return active
}
