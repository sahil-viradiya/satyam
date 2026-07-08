import { useRef } from 'react'
import { CarSilhouette } from './icons.jsx'
import { ripple, scrollTo } from '../lib/ui.js'

/* Real fleet — data from the Satyam rate card.
   price12: 12 hrs / 150 km · price24: 24 hrs / 300 km
   pos: object-position focus so the car (not the sky) stays in frame */
const CARS = [
  { name: 'Maruti Swift', type: 'Hatchback', img: '/cars/swift-black.jpg', pos: 'center 72%', sub: '2024 & 2026 · White / Black', price12: '₹1,500', price24: '₹2,000', feats: ['5 Seater', 'Petrol + CNG', 'Manual', '2 Cars'], units: 2 },
  { name: 'Maruti Baleno', type: 'Hatchback', img: '/cars/baleno.jpg', pos: 'center 68%', sub: '2025 · Black', price12: '₹1,500', price24: '₹2,500', feats: ['5 Seater', 'Petrol + CNG', 'Manual'] },
  { name: 'Hyundai i20', type: 'Hatchback', img: '/cars/i20.jpg', pos: 'center 72%', sub: '2019–2026 · White', price12: '₹1,500', price24: '₹2,200–2,500', feats: ['5 Seater', 'Petrol / CNG', 'Manual', 'Sunroof*', '3 Cars'], units: 3 },
  { name: 'Hyundai Aura', type: 'Sedan', img: '/cars/aura.jpg', pos: 'center 55%', sub: '2024 · White', price12: '₹1,500', price24: '₹2,400', feats: ['5 Seater', 'Petrol + CNG', 'Manual'] },
  { name: 'Maruti Ertiga', type: 'MPV', img: '/cars/ertiga.jpg', pos: 'center center', sub: '2025 · White', price12: '₹1,500', price24: '₹2,500', feats: ['7 Seater', 'Petrol + CNG', 'Manual'] },
  { name: 'Hyundai Verna', type: 'Sedan', img: '/cars/verna.jpg', pos: 'center 76%', sub: '2018 · Black', price12: '₹2,500', price24: '₹4,000', feats: ['5 Seater', 'Diesel', 'Manual'] },
  { name: 'Mahindra Thar 4×4', type: 'Off-Road SUV', img: '/cars/thar.jpg', pos: 'center 70%', sub: '2023 · Black', price12: '₹2,500', price24: '₹4,500', feats: ['4 Seater', 'Petrol', 'Manual'] },
  { name: 'Kia Seltos', type: 'SUV', img: '/cars/seltos.jpg', pos: 'center 66%', sub: '2021 · White', price12: '₹3,000', price24: '₹5,000', feats: ['5 Seater', 'Petrol', 'Manual', 'Sunroof'] },
  { name: 'Skoda Slavia', type: 'Sedan', img: '/cars/slavia.jpg', pos: 'center 80%', sub: '2024 · White', price12: '₹3,000', price24: '₹5,000', feats: ['5 Seater', 'Petrol', 'Automatic', 'Sunroof'] },
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
    const MAX = 10
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
        {car.units > 1 && <span className="car-units">{car.units} Cars</span>}
        {car.img
          ? <img src={car.img} alt={car.name} loading="lazy" style={{ objectPosition: car.pos || 'center' }} />
          : <CarSilhouette color={car.color || '#FF6B00'} />}
      </div>
      <div className="car-name">{car.name}</div>
      <div className="car-sub">{car.sub}</div>
      <div className="car-prices">
        <div className="cp"><b>{car.price12}</b><span>12 hr · 150 km</span></div>
        <div className="cp"><b>{car.price24}</b><span>24 hr · 300 km</span></div>
      </div>
      <div className="car-feats">
        {car.feats.map((f) => <span key={f}>{f}</span>)}
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
          <p className="section-sub">
            12 well-maintained cars — hatchbacks, sedans, MPV &amp; SUVs.
            Rates: 12 hr / 150 km &nbsp;·&nbsp; 24 hr / 300 km.
          </p>
        </div>
        <div className="fleet-grid">
          {CARS.map((c) => <TiltCard key={c.name} car={c} />)}
        </div>
        <p className="fleet-note reveal">* Sunroof available on select i20 units. Extra hours / kms charged separately.</p>
      </div>
    </section>
  )
}
