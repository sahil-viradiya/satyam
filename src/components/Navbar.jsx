import { useEffect, useState } from 'react'
import { Logo } from './icons.jsx'
import { ripple, scrollTo } from '../lib/ui.js'

const LINKS = [
  ['Home', '#hero'],
  ['Fleet', '#fleet'],
  ['How It Works', '#how'],
  ['Contact', '#contact'],
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    scrollTo(href)
  }

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <div className="container nav-inner">
        <a href="#hero" className="logo" onClick={(e) => go(e, '#hero')} data-hover>
          <Logo />
          Satyam <span className="accent">Self Drive</span>
        </a>
        <ul className={`nav-links${open ? ' open' : ''}`}>
          {LINKS.map(([label, href]) => (
            <li key={href}><a href={href} onClick={(e) => go(e, href)} data-hover>{label}</a></li>
          ))}
          <li>
            <a
              href="#book"
              className="btn btn-primary nav-cta"
              data-hover
              onClick={(e) => { ripple(e); go(e, '#book') }}
            >
              Book Now
            </a>
          </li>
        </ul>
        <button
          className={`hamburger${open ? ' open' : ''}`}
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
