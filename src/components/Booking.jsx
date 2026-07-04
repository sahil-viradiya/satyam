import { useRef, useState } from 'react'
import { Arrow, Shield, Clock, Wallet } from './icons.jsx'
import { ripple } from '../lib/ui.js'

const fmt = (d) => d.toISOString().split('T')[0]
const today = new Date()
const tomorrow = new Date(Date.now() + 86400000)

const POINTS = [
  { Icon: Shield, title: 'Fully Insured Cars', text: 'Every vehicle is insured and regularly serviced.' },
  { Icon: Clock, title: 'Flexible Hours', text: 'Pickup & drop on your schedule, day or night.' },
  { Icon: Wallet, title: 'No Hidden Charges', text: 'Transparent pricing with fuel options included.' },
]

export default function Booking() {
  const [msg, setMsg] = useState('')
  const nameRef = useRef(null)
  const formRef = useRef(null)

  const onSubmit = (e) => {
    e.preventDefault()
    const name = nameRef.current?.value || 'there'
    setMsg(`Thanks ${name}! We'll call you shortly to confirm. 🚗`)
    formRef.current?.reset()
    setTimeout(() => setMsg(''), 6000)
  }

  return (
    <section id="book" className="tint">
      <div className="container">
        <div className="book-wrap">
          <div className="book-info reveal">
            <span className="section-tag">Book Now</span>
            <h2 className="section-title">Reserve Your <span className="hl">Car Today</span></h2>
            <p className="section-sub">Fill in your details and our team will confirm your booking within minutes.</p>
            <div className="book-points">
              {POINTS.map(({ Icon, title, text }) => (
                <div className="book-point" key={title}>
                  <div className="bp-ic"><Icon /></div>
                  <div><h4>{title}</h4><p>{text}</p></div>
                </div>
              ))}
            </div>
          </div>

          <form className="book-form reveal" ref={formRef} onSubmit={onSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bName">Full Name</label>
                <input id="bName" ref={nameRef} type="text" placeholder="Sanket Talaviya" required />
              </div>
              <div className="form-group">
                <label htmlFor="bPhone">Phone</label>
                <input id="bPhone" type="tel" placeholder="+91 98765 43210" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group full">
                <label htmlFor="bEmail">Email</label>
                <input id="bEmail" type="email" placeholder="you@example.com" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group full">
                <label htmlFor="bLoc">Pickup Location</label>
                <input id="bLoc" type="text" defaultValue="Rajkot" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bStart">Start Date</label>
                <input id="bStart" type="date" defaultValue={fmt(today)} min={fmt(today)} required />
              </div>
              <div className="form-group">
                <label htmlFor="bEnd">End Date</label>
                <input id="bEnd" type="date" defaultValue={fmt(tomorrow)} min={fmt(today)} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group full">
                <label htmlFor="bCar">Car Type</label>
                <select id="bCar" defaultValue="" required>
                  <option value="" disabled>Select a car…</option>
                  <option>Maruti Swift — Hatchback (₹799/day)</option>
                  <option>Maruti Baleno — Hatchback (₹899/day)</option>
                  <option>Hyundai i20 — Hatchback (₹999/day)</option>
                  <option>Hyundai Aura — Sedan (₹999/day)</option>
                  <option>Skoda Slavia — Sedan (₹1,499/day)</option>
                  <option>Hyundai Verna — Sedan (₹1,599/day)</option>
                  <option>Maruti Ertiga — MPV 7 Seater (₹1,699/day)</option>
                  <option>Kia Seltos — SUV (₹1,999/day)</option>
                  <option>Mahindra Thar — Off-Road SUV (₹2,499/day)</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" data-hover onClick={ripple}>
              Confirm Booking <Arrow />
            </button>
            <div className={`form-msg${msg ? ' show' : ''}`}>{msg}</div>
          </form>
        </div>
      </div>
    </section>
  )
}
