import { useRef } from 'react'
import { AC, Fuel, Gps, CarSilhouette } from './icons.jsx'
import { ripple, scrollTo } from '../lib/ui.js'

const CARS = [
  { name: 'Maruti Swift', type: 'Hatchback', price: '₹799', color: '#FF6B00' },
  { name: 'Maruti Baleno', type: 'Hatchback', price: '₹899', color: '#3aa0ff' },
  { name: 'Hyundai i20', type: 'Hatchback', price: '₹999', color: '#39d98a' },
  { name: 'Hyundai Aura', type: 'Sedan', price: '₹999', color: '#c084fc' },
  { name: 'Skoda Slavia', type: 'Sedan', price: '₹1,499', color: '#f43f5e' },
  { name: 'Hyundai Verna', type: 'Sedan', price: '₹1,599', color: '#eab308' },
  { name: 'Maruti Ertiga', type: 'MPV · 7 Seater', price: '₹1,699', color: '#22d3ee' },
  { name: 'Kia Seltos', type: 'SUV', price: '₹1,999', color: '#a3e635' },
  { name: 'Mahindra Thar', type: 'Off-Road SUV', price: '₹2,499', color: '#fb7185' },
]

function TiltCard({ car }) {
  const ref = useRef(null)
  const state = useRef({ rx: 0, ry: 0, ty: 0, trx: 0, try_: 0, tty: 0, raf: 0, active: false })

  const loop = () => {
    const s = state.current
    const el = ref.current
    if (!el) return
    // glide toward target — this lerp is what makes the tilt feel liquid
    s.rx += (s.trx - s.rx) * 0.12
    s.ry += (s.try_ - s.ry) * 0.12
    s.ty += (s.tty - s.ty) * 0.12
    el.style.transform = `perspective(900px) rotateX(${s.rx.toFixed(2)}deg) rotateY(${s.ry.toFixed(2)}deg) translateY(${s.ty.toFixed(2)}px)`
    const settled = !s.active && Math.abs(s.rx) < 0.05 && Math.abs(s.ry) < 0.05
    if (settled) { el.style.transform = ''; s.raf = 0; return }
    s.raf = requestAnimationFrame(loop)
  }

  const onMove = (e) => {
    const el = ref.current
    if (!el || window.matchMedia('(hover: none)').matches) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const MAX = 12
    const s = state.current
    s.trx = (py - 0.5) * -MAX * 2
    s.try_ = (px - 0.5) * MAX * 2
    s.tty = -6
    s.active = true
    el.style.setProperty('--mx', px * 100 + '%')
    el.style.setProperty('--my', py * 100 + '%')
    if (!s.raf) s.raf = requestAnimationFrame(loop)
  }
  const onLeave = () => {
    const s = state.current
    s.trx = 0; s.try_ = 0; s.tty = 0; s.active = false
    if (!s.raf) s.raf = requestAnimationFrame(loop)
  }

  return (
    <div className="car-card reveal" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="shine" />
      <div className="car-visual">
        <span className="car-type">{car.type}</span>
        <CarSilhouette color={car.color} />
      </div>
      <div className="car-name">{car.name}</div>
      <div className="car-price">{car.price}<small> /day</small></div>
      <div className="car-feats">
        <span><AC /> AC</span>
        <span><Fuel /> Fuel Included</span>
        <span><Gps /> GPS</span>
      </div>
      <a
        href="#book"
        className="btn btn-primary"
        data-hover
        onClick={(e) => { e.preventDefault(); ripple(e); scrollTo('#book') }}
      >
        Book Now
      </a>
    </div>
  )
}

export default function Fleet() {
  return (
    <section id="fleet" className="tint">
      <div className="container">
        <div className="section-head center reveal">
          <span className="section-tag">Our Fleet</span>
          <h2 className="section-title">Choose Your <span className="hl">Perfect Ride</span></h2>
          <p className="section-sub">From budget-friendly hatchbacks to premium SUVs — pick the car that fits your journey.</p>
        </div>
        <div className="fleet-grid">
          {CARS.map((c) => <TiltCard key={c.name} car={c} />)}
        </div>
      </div>
    </section>
  )
}
