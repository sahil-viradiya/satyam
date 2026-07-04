// Shared scroll state bridged from Lenis (DOM) into the R3F render loop.
// progress: 0 (top) -> 1 (bottom). velocity: raw from Lenis.
// smoothVel: frame-lerped velocity — use this for motion (no jitter).
export const scrollState = {
  progress: 0,
  velocity: 0,
  smoothVel: 0,
  mouseX: 0,
  mouseY: 0,
}
