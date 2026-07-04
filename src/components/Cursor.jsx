import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dot = useRef(null)
  const glow = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    let mx = innerWidth / 2, my = innerHeight / 2
    let gx = mx, gy = my
    let raf

    const move = (e) => {
      mx = e.clientX; my = e.clientY
      if (dot.current) dot.current.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`
    }
    const loop = () => {
      gx += (mx - gx) * 0.18
      gy += (my - gy) * 0.18
      if (glow.current) glow.current.style.transform = `translate(${gx}px,${gy}px) translate(-50%,-50%)`
      raf = requestAnimationFrame(loop)
    }
    const enter = () => glow.current && glow.current.classList.add('hovered')
    const leave = () => glow.current && glow.current.classList.remove('hovered')

    window.addEventListener('mousemove', move)
    loop()
    const targets = document.querySelectorAll('a, button, input, select, [data-hover]')
    targets.forEach((el) => {
      el.addEventListener('mouseenter', enter)
      el.addEventListener('mouseleave', leave)
    })

    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', enter)
        el.removeEventListener('mouseleave', leave)
      })
    }
  }, [])

  return (
    <>
      <div className="cursor-glow" ref={glow} />
      <div className="cursor-dot" ref={dot} />
    </>
  )
}
