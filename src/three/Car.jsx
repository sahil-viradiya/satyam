import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { scrollState } from '../store/scroll.js'

/* Fleet colours — body shifts through these as you scroll the page,
   echoing Swift / City / Innova / Fortuner. */
const FLEET_COLORS = ['#FF6B00', '#3aa0ff', '#39d98a', '#c084fc'].map((c) => new THREE.Color(c))

/* Stylized premium car (RoundedBox + Cylinder). Local forward = +X.
   Wheels spin with scroll speed, body recolours with scroll, faux
   headlight beams light the night road. */
export default function Car(props) {
  const group = useRef()
  const wheels = useRef([])
  const wheelRot = useRef(0)
  const tmp = useRef(new THREE.Color()).current

  const bodyMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#FF6B00', metalness: 0.85, roughness: 0.25, envMapIntensity: 1.4 }),
    []
  )
  const glassMat = {
    color: '#0a1a2a', metalness: 0.95, roughness: 0.05,
    transparent: true, opacity: 0.65, envMapIntensity: 2,
  }

  useFrame((state, dt) => {
    // wheels roll faster with scroll velocity
    const spin = 2.0 + Math.min(Math.abs(scrollState.velocity) * 0.5, 9)
    wheelRot.current -= spin * dt
    wheels.current.forEach((w) => { if (w) w.rotation.x = wheelRot.current })

    // body colour glides through the fleet palette across the page
    const p = THREE.MathUtils.clamp(scrollState.progress, 0, 1)
    const seg = p * (FLEET_COLORS.length - 1)
    const i = Math.floor(seg)
    const f = seg - i
    tmp.copy(FLEET_COLORS[i]).lerp(FLEET_COLORS[Math.min(i + 1, FLEET_COLORS.length - 1)], f)
    bodyMaterial.color.lerp(tmp, 0.06)

    // subtle lean into acceleration
    if (group.current) {
      group.current.rotation.z = THREE.MathUtils.lerp(
        group.current.rotation.z,
        THREE.MathUtils.clamp(-scrollState.velocity * 0.006, -0.08, 0.08),
        0.08
      )
    }
  })

  const wheelPositions = [
    [1.95, 0.62, 1.18],
    [1.95, 0.62, -1.18],
    [-1.95, 0.62, 1.18],
    [-1.95, 0.62, -1.18],
  ]

  return (
    <group ref={group} {...props} dispose={null}>
      {/* lower body */}
      <RoundedBox args={[6.1, 1.1, 2.7]} radius={0.35} smoothness={6} position={[0, 1.05, 0]} material={bodyMaterial} castShadow />
      {/* mid body / shoulder */}
      <RoundedBox args={[5.5, 0.9, 2.5]} radius={0.32} smoothness={6} position={[0, 1.8, 0]} material={bodyMaterial} castShadow />

      {/* cabin */}
      <RoundedBox args={[3.1, 1.15, 2.2]} radius={0.3} smoothness={6} position={[-0.25, 2.65, 0]} castShadow>
        <meshStandardMaterial color="#141414" metalness={0.7} roughness={0.3} />
      </RoundedBox>

      {/* windshield + rear glass */}
      <mesh position={[1.4, 2.62, 0]} rotation={[0, 0, -0.32]}>
        <boxGeometry args={[0.12, 1.0, 2.0]} />
        <meshStandardMaterial {...glassMat} />
      </mesh>
      <mesh position={[-1.85, 2.62, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.12, 1.0, 2.0]} />
        <meshStandardMaterial {...glassMat} />
      </mesh>
      <mesh position={[-0.25, 2.7, 1.06]}>
        <boxGeometry args={[2.7, 0.78, 0.08]} />
        <meshStandardMaterial {...glassMat} />
      </mesh>
      <mesh position={[-0.25, 2.7, -1.06]}>
        <boxGeometry args={[2.7, 0.78, 0.08]} />
        <meshStandardMaterial {...glassMat} />
      </mesh>

      {/* headlights + faux beams (local forward = +X) */}
      {[1, -1].map((z) => (
        <group key={`h${z}`}>
          <mesh position={[3.08, 1.2, z * 0.85]}>
            <boxGeometry args={[0.18, 0.4, 0.62]} />
            <meshStandardMaterial color="#fff8d0" emissive="#fff0b0" emissiveIntensity={3.2} toneMapped={false} />
          </mesh>
          <mesh position={[7.2, 1.0, z * 0.95]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[1.5, 8, 24, 1, true]} />
            <meshBasicMaterial color="#ffd9a0" transparent opacity={0.07} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>
      ))}
      {/* taillights */}
      {[1, -1].map((z) => (
        <mesh key={`tl${z}`} position={[-3.08, 1.35, z * 0.85]}>
          <boxGeometry args={[0.16, 0.34, 0.55]} />
          <meshStandardMaterial color="#ff2a2a" emissive="#ff0000" emissiveIntensity={2.6} toneMapped={false} />
        </mesh>
      ))}

      {/* grille accent */}
      <mesh position={[3.12, 0.85, 0]}>
        <boxGeometry args={[0.1, 0.25, 1.6]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.4} />
      </mesh>

      {/* wheels — ref on hub group so rim + tyre spin together */}
      {wheelPositions.map((p, i) => (
        <group key={i} position={p} ref={(el) => (wheels.current[i] = el)}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.72, 0.72, 0.5, 30]} />
            <meshStandardMaterial color="#0c0c0c" metalness={0.4} roughness={0.75} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.34, 0.34, 0.52, 6]} />
            <meshStandardMaterial color="#d8d8d8" metalness={0.95} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
