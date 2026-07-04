import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../store/scroll.js'

const DASH_SPACING = 7
const DASH_COUNT = 48
const LAMP_SPACING = 18
const LAMP_COUNT = 16

/* A single roadside lamp post (emissive head, no real light — bloom sells it). */
function Lamp({ side }) {
  return (
    <group position={[side * 9.5, 0, 0]}>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 6, 8]} />
        <meshStandardMaterial color="#1b1b1b" metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh position={[-side * 0.9, 5.9, 0]} rotation={[0, 0, side * 0.5]}>
        <cylinderGeometry args={[0.08, 0.08, 2, 8]} />
        <meshStandardMaterial color="#1b1b1b" metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh position={[-side * 1.7, 5.7, 0]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#ffcf8a" emissive="#ff9a3c" emissiveIntensity={4} toneMapped={false} />
      </mesh>
    </group>
  )
}

/* Distant city silhouette for depth — slow parallax. */
function Skyline() {
  const ref = useRef()
  const buildings = useMemo(() => {
    const out = []
    const R = 95
    for (let i = 0; i < 80; i++) {
      const a = (i / 80) * Math.PI * 2
      const r = R + (Math.random() - 0.5) * 26
      const w = 4 + Math.random() * 7
      const h = 10 + Math.random() * 38
      out.push({
        pos: [Math.cos(a) * r, h / 2 - 0.5, Math.sin(a) * r],
        scale: [w, h, w],
        lit: Math.random() > 0.6,
      })
    }
    return out
  }, [])

  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.004 })

  return (
    <group ref={ref}>
      {buildings.map((b, i) => (
        <mesh key={i} position={b.pos} scale={b.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#070708"
            emissive={b.lit ? '#ff6b00' : '#0a0a0a'}
            emissiveIntensity={b.lit ? 0.35 : 0}
            metalness={0.2}
            roughness={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}

/* The whole road system. Markings + lamps scroll past the car to read as
   "driving"; speed reacts to scroll velocity, with a gentle idle creep. */
export default function Road() {
  const dashes = useRef()
  const lamps = useRef()
  const drive = useRef(0)

  useFrame((_, dt) => {
    drive.current += dt * 5 + Math.abs(scrollState.velocity) * 0.25
    const d = drive.current
    // wrap each group within one spacing unit → seamless infinite road
    if (dashes.current) dashes.current.position.z = (d % DASH_SPACING)
    if (lamps.current) lamps.current.position.z = (d % LAMP_SPACING)
  })

  const dashEls = useMemo(() => {
    const els = []
    for (let i = 0; i < DASH_COUNT; i++) {
      const z = (i - DASH_COUNT / 2) * DASH_SPACING
      els.push(
        <mesh key={i} position={[0, -0.52, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.45, 3.4]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffd9a0" emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
      )
    }
    return els
  }, [])

  const lampEls = useMemo(() => {
    const els = []
    for (let i = 0; i < LAMP_COUNT; i++) {
      const z = (i - LAMP_COUNT / 2) * LAMP_SPACING
      els.push(
        <group key={i} position={[0, 0, z]}>
          <Lamp side={1} />
          <Lamp side={-1} />
        </group>
      )
    }
    return els
  }, [])

  return (
    <>
      {/* side lane lines (static, emissive) */}
      {[5.4, -5.4].map((x) => (
        <mesh key={x} position={[x, -0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.3, 360]} />
          <meshStandardMaterial color="#ff6b00" emissive="#ff6b00" emissiveIntensity={0.8} toneMapped={false} />
        </mesh>
      ))}
      <group ref={dashes}>{dashEls}</group>
      <group ref={lamps}>{lampEls}</group>
      <Skyline />
    </>
  )
}
