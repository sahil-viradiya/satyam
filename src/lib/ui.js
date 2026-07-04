/* Button ripple effect */
export function ripple(e) {
  const btn = e.currentTarget
  const span = document.createElement('span')
  span.className = 'ripple'
  const rect = btn.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  span.style.width = span.style.height = size + 'px'
  span.style.left = e.clientX - rect.left - size / 2 + 'px'
  span.style.top = e.clientY - rect.top - size / 2 + 'px'
  btn.appendChild(span)
  setTimeout(() => span.remove(), 700)
}

/* Smooth-scroll to an anchor using Lenis if available */
export function scrollTo(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -10 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
