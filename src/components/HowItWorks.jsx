import { CarFront, Calendar, Check } from './icons.jsx'

const STEPS = [
  { n: 1, Icon: CarFront, title: 'Choose Your Car', text: 'Browse our fleet and select the car that matches your budget and trip needs.' },
  { n: 2, Icon: Calendar, title: 'Pick Date & Location', text: 'Set your pickup point in Rajkot, choose start and end dates — we handle the rest.' },
  { n: 3, Icon: Check, title: 'Drive Away!', text: 'Pick up your keys, complete quick paperwork, and hit the road on your own terms.' },
]

export default function HowItWorks() {
  return (
    <section id="how" className="tint">
      <div className="container">
        <div className="section-head center reveal">
          <span className="section-tag">How It Works</span>
          <h2 className="section-title">Drive in <span className="hl">3 Easy Steps</span></h2>
          <p className="section-sub">Renting a self-drive car has never been this simple.</p>
        </div>
        <div className="steps">
          {STEPS.map(({ n, Icon, title, text }) => (
            <div className="step" key={n}>
              <div className="step-num">{n}</div>
              <div className="step-icon"><Icon /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
