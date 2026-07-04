import { useEffect } from 'react'
import Lenis from 'lenis'
import { scrollState } from '../store/scroll.js'

/* Buttery smooth scroll (Lenis) + bridge scroll progress into the 3D loop. */
export default function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })

    lenis.on('scroll', ({ scroll, limit, velocity }) => {
      scrollState.progress = limit > 0 ? scroll / limit : 0
      scrollState.velocity = velocity
    })

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // expose for anchor-link smooth scrolling
    window.__lenis = lenis

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])
}
