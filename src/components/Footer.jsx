import { Logo, Whatsapp, Instagram, Facebook } from './icons.jsx'
import { scrollTo } from '../lib/ui.js'

export default function Footer() {
  const go = (e, href) => { e.preventDefault(); scrollTo(href) }
  return (
    <footer id="contact">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col footer-brand reveal">
            <div className="logo"><Logo /> Satyam <span className="accent">Self Drive</span></div>
            <p>Rajkot's trusted self-drive car rental. Affordable, reliable, and always ready when you are.</p>
            <div className="socials">
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener" aria-label="WhatsApp" data-hover><Whatsapp /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram" data-hover><Instagram /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook" data-hover><Facebook /></a>
            </div>
          </div>

          <div className="footer-col reveal">
            <h4>Quick Links</h4>
            <a href="#hero" onClick={(e) => go(e, '#hero')} data-hover>Home</a>
            <a href="#fleet" onClick={(e) => go(e, '#fleet')} data-hover>Our Fleet</a>
            <a href="#how" onClick={(e) => go(e, '#how')} data-hover>How It Works</a>
            <a href="#book" onClick={(e) => go(e, '#book')} data-hover>Book Now</a>
          </div>

          <div className="footer-col reveal">
            <h4>Contact</h4>
            <a href="tel:+919876543210" data-hover>+91 98765 43210</a>
            <a href="mailto:hello@satyamselfdrive.in" data-hover>hello@satyamselfdrive.in</a>
            <p>150 Feet Ring Road,<br />Rajkot, Gujarat 360005</p>
            <p>Open 24 / 7</p>
          </div>

          <div className="footer-col reveal">
            <h4>Find Us</h4>
            <div className="map-embed">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=70.74%2C22.27%2C70.84%2C22.33&layer=mapnik&marker=22.3039%2C70.8022"
                title="Satyam Self Drive — Rajkot location"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        © 2026 <span className="accent">Satyam Self Drive</span>, Rajkot · All rights reserved · Drive safe 🚗
      </div>
    </footer>
  )
}
