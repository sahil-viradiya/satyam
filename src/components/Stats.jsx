const STATS = [
  { target: 500, suffix: '+', label: 'Happy Customers' },
  { target: 12, suffix: '+', label: 'Cars Available' },
  { target: 3, suffix: '+', label: 'Years Experience' },
  { target: 24, suffix: '/7', label: 'Support' },
]

export default function Stats() {
  return (
    <section id="why" className="tint">
      <div className="container">
        <div className="section-head center reveal">
          <span className="section-tag">Why Choose Us</span>
          <h2 className="section-title">Trusted by <span className="hl">Hundreds</span> of Drivers</h2>
          <p className="section-sub">Numbers that show our commitment to a smooth self-drive experience.</p>
        </div>
        <div className="stats-grid">
          {STATS.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-num" data-target={s.target}>
                <span className="val">0</span><span className="suffix">{s.suffix}</span>
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
