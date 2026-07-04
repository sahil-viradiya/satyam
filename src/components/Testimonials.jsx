import { Star } from './icons.jsx'

const REVIEWS = [
  { name: 'Sanket Talaviya', role: 'Rajkot', initial: 'S', text: "Booked the Swift for a weekend trip to Dwarka. Spotless car, smooth process, fair price. Highly recommend Satyam!" },
  { name: 'Priya Mehta', role: 'Rajkot', initial: 'P', text: "The Innova was perfect for our family trip. GPS, AC, full tank — everything just worked. Will book again." },
  { name: 'Rohan Joshi', role: 'Morbi', initial: 'R', text: "24/7 support is real! Called at midnight, got my Fortuner sorted in minutes. Best self-drive in Rajkot." },
  { name: 'Aisha Khan', role: 'Rajkot', initial: 'A', text: "Loved the Honda City. Clean, well maintained and the team was super friendly. Transparent pricing too." },
  { name: 'Vikram Patel', role: 'Jamnagar', initial: 'V', text: "Affordable and reliable. No hidden charges, quick paperwork, easy pickup. Five stars from me!" },
]

function Card({ r }) {
  return (
    <div className="testi-card">
      <div className="stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} />)}</div>
      <p className="testi-text">"{r.text}"</p>
      <div className="testi-author">
        <div className="testi-avatar">{r.initial}</div>
        <div><div className="ta-name">{r.name}</div><div className="ta-role">{r.role}</div></div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const loop = [...REVIEWS, ...REVIEWS]
  return (
    <section id="testimonials" className="tint">
      <div className="container">
        <div className="section-head center reveal">
          <span className="section-tag">Testimonials</span>
          <h2 className="section-title">What Our <span className="hl">Drivers Say</span></h2>
          <p className="section-sub">Real reviews from real customers across Rajkot.</p>
        </div>
      </div>
      <div className="testi-viewport reveal">
        <div className="testi-track">
          {loop.map((r, i) => <Card key={i} r={r} />)}
        </div>
      </div>
    </section>
  )
}
