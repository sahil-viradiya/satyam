import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* Hooks GSAP ScrollTrigger reveals to all .reveal elements + drives counters.
   Synced to Lenis via ScrollTrigger.update on Lenis scroll. */
export default function useReveal() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // generic fade-in-from-bottom
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 55 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          }
        )
      })

      // staggered groups
      const stagger = (sel, trigger) =>
        gsap.fromTo(
          sel,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: { trigger, start: 'top 82%' },
          }
        )
      stagger('.car-card', '.fleet-grid')
      stagger('.step', '.steps')
      stagger('.stat-card', '.stats-grid')

      // count-up stats
      gsap.utils.toArray('.stat-num').forEach((numEl) => {
        const target = +numEl.dataset.target
        const valEl = numEl.querySelector('.val')
        const obj = { v: 0 }
        ScrollTrigger.create({
          trigger: numEl,
          start: 'top 85%',
          once: true,
          onEnter: () =>
            gsap.to(obj, {
              v: target,
              duration: 2,
              ease: 'power2.out',
              onUpdate: () => { valEl.textContent = Math.floor(obj.v) },
            }),
        })
      })
    })

    // Lenis (useLenis) already calls ScrollTrigger.update on scroll.
    // Just refresh after first paint so triggers measure correctly.
    const refresh = setTimeout(() => ScrollTrigger.refresh(), 300)

    return () => {
      clearTimeout(refresh)
      ctx.revert()
    }
  }, [])
}
