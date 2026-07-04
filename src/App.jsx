import { useEffect } from 'react'
import BgCanvas from './components/BgCanvas.jsx'
import Cursor from './components/Cursor.jsx'
import Loader from './components/Loader.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Fleet from './components/Fleet.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Stats from './components/Stats.jsx'
import Booking from './components/Booking.jsx'
import Testimonials from './components/Testimonials.jsx'
import Footer from './components/Footer.jsx'
import { Whatsapp } from './components/icons.jsx'
import useLenis from './hooks/useLenis.js'
import useReveal from './hooks/useReveal.js'
import { scrollState } from './store/scroll.js'

export default function App() {
  useLenis()
  useReveal()

  // feed mouse position to the 3D camera parallax
  useEffect(() => {
    const onMove = (e) => {
      scrollState.mouseX = e.clientX / innerWidth - 0.5
      scrollState.mouseY = e.clientY / innerHeight - 0.5
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <Loader />
      <Cursor />
      <BgCanvas />

      <Navbar />
      <main className="content">
        <Hero />
        <Fleet />
        <HowItWorks />
        <Stats />
        <Booking />
        <Testimonials />
        <Footer />
      </main>

      <a
        href="https://wa.me/919876543210"
        className="wa-float"
        target="_blank"
        rel="noopener"
        aria-label="Chat on WhatsApp"
        data-hover
      >
        <Whatsapp />
      </a>
    </>
  )
}
