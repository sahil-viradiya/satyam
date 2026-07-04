import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollState } from '../store/scroll.js'

gsap.registerPlugin(ScrollTrigger)

/* Buttery smooth scroll. Lenis rides GSAP's ticker so scroll, ScrollTrigger
   and every tween share ONE clock — no competing rAF loops, no micro-jank. */
export default function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })

    lenis.on('scroll', ({ scroll, limit, velocity }) => {
      scrollState.progress = limit > 0 ? scroll / limit : 0
      scrollState.velocity = velocity
      ScrollTrigger.update()
    })

    // single shared clock: GSAP ticker drives Lenis
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // expose for anchor-link smooth scrolling
    window.__lenis = lenis

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])
}
