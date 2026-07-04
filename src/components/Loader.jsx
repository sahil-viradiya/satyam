import { useEffect, useState } from 'react'

export default function Loader() {
  const [pct, setPct] = useState(0)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const start = performance.now()
    const DUR = 2000
    let raf
    const tick = (now) => {
      const t = Math.min(1, (now - start) / DUR)
      setPct(Math.round(t * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
      else setTimeout(() => setHidden(true), 150)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className={`loader${hidden ? ' hidden' : ''}`}>
      <div className="loader-cube">
        <div className="f1" /><div className="f2" /><div className="f3" />
        <div className="f4" /><div className="f5" /><div className="f6" />
      </div>
      <div className="loader-text">SATYAM <span>SELF DRIVE</span></div>
      <div className="loader-bar"><i style={{ width: `${pct}%` }} /></div>
    </div>
  )
}
