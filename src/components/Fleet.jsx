import { useRef } from 'react'
import { AC, Fuel, Gps, CarSilhouette } from './icons.jsx'
import { ripple, scrollTo } from '../lib/ui.js'

const CARS = [
  { name: 'Maruti Swift', type: 'Hatchback', price: '₹799', color: '#FF6B00' },
  { name: 'Honda City', type: 'Sedan', price: '₹1,299', color: '#3aa0ff' },
  { name: 'Crysta Innova', type: 'SUV', price: '₹2,499', color: '#39d98a' },
  { name: 'Toyota Fortuner', type: 'Premium SUV', price: '₹3,999', color: '#c084fc' },
]

function TiltCard({ car }) {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    if (!el || window.matchMedia('(hover: none)').matches) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const MAX = 12
    el.style.transform = `perspective(900px) rotateX(${(py - 0.5) * -MAX * 2}deg) rotateY(${(px - 0.5) * MAX * 2}deg) translateY(-6px)`
    el.style.setProperty('--mx', px * 100 + '%')
    el.style.setProperty('--my', py * 100 + '%')
  }
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = 'perspective(900px) rotateX(0) rotateY(0)'
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
