import { useEffect, useState } from 'react'
import { Arrow } from './icons.jsx'
import { ripple, scrollTo } from '../lib/ui.js'

export default function Hero() {
  const [typed, setTyped] = useState('')

  useEffect(() => {
    const word = 'Satyam'
    let i = 0
    let timer
    // start after the 2s loader
    const startDelay = setTimeout(function type() {
      if (i <= word.length) {
        setTyped(word.slice(0, i))
        i++
        timer = setTimeout(type, 150)
      }
    }, 2150)
    return () => { clearTimeout(startDelay); clearTimeout(timer) }
  }, [])

  const go = (e, href) => { e.preventDefault(); ripple(e); scrollTo(href) }

  return (
    <section id="hero">
      <div className="container hero-content reveal" style={{ opacity: 1, transform: 'none' }}>
        <div className="hero-badge"><span className="dot" /> Now serving across Rajkot, Gujarat</div>
        <h1 className="hero-title">
          <div className="typewrap">{typed}<span className="cursor-bar" /></div>
          <div className="line2">Self Drive</div>
        </h1>
        <p className="hero-sub">
          Premium Self Drive Cars in Rajkot — affordable rates, well-maintained cars,
          and the freedom to drive on your own terms.
        </p>
        <div className="hero-cta">
          <a href="#book" className="btn btn-primary" data-hover onClick={(e) => go(e, '#book')}>
            Book Now <Arrow />
          </a>
          <a href="#fleet" className="btn btn-ghost" data-hover onClick={(e) => go(e, '#fleet')}>
            View Fleet
          </a>
        </div>
        <div className="hero-stats">
          <div><div className="hs-num">500<span>+</span></div><div className="hs-label">Happy Clients</div></div>
          <div><div className="hs-num">12<span>+</span></div><div className="hs-label">Cars Ready</div></div>
          <div><div className="hs-num">24/<span>7</span></div><div className="hs-label">Support</div></div>
        </div>
      </div>
      <div className="scroll-hint"><div className="scroll-mouse" />Scroll</div>
    </section>
  )
}
