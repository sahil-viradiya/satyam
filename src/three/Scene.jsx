import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  Environment,
  Lightformer,
  Float,
  ContactShadows,
  MeshReflectorMaterial,
  Sparkles,
  Stars,
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import Car from './Car.jsx'
import Road from './Road.jsx'
import { scrollState } from '../store/scroll.js'

/* Cinematic camera shots keyed to scroll progress (car at origin, faces +Z). */
const SHOTS = [
  { p: 0.00, pos: [7, 2.4, 9], look: [0, 1.4, 0] },   // hero — 3/4 front, low
  { p: 0.20, pos: [12.5, 3.2, 0.5], look: [0, 1.5, 0] }, // fleet — side profile
  { p: 0.42, pos: [0, 3.8, -12], look: [0, 1.3, 3] },  // how — chase from behind
  { p: 0.62, pos: [6, 1.5, 9.5], look: [0, 1.2, 0] },  // stats — front low hero
  { p: 0.82, pos: [0.5, 9.5, 15], look: [0, 0.3, 0] }, // book — high wide
  { p: 1.00, pos: [12, 5, 12], look: [0, 1.4, 0] },    // footer — corner orbit
]

const lerp = THREE.MathUtils.lerp
const smooth = (t) => t * t * (3 - 2 * t)

function sampleShot(p, outPos, outLook) {
  let a = SHOTS[0], b = SHOTS[SHOTS.length - 1], t = 0
  if (p <= SHOTS[0].p) { a = b = SHOTS[0] }
  else if (p >= b.p) { a = b }
  else {
    for (let i = 0; i < SHOTS.length - 1; i++) {
      if (p >= SHOTS[i].p && p <= SHOTS[i + 1].p) {
        a = SHOTS[i]; b = SHOTS[i + 1]
        t = smooth((p - a.p) / (b.p - a.p))
        break
      }
    }
  }
  outPos.set(lerp(a.pos[0], b.pos[0], t), lerp(a.pos[1], b.pos[1], t), lerp(a.pos[2], b.pos[2], t))
  outLook.set(lerp(a.look[0], b.look[0], t), lerp(a.look[1], b.look[1], t), lerp(a.look[2], b.look[2], t))
}

function CameraRig() {
  const { camera } = useThree()
  const desiredPos = useRef(new THREE.Vector3(7, 2.4, 9)).current
  const desiredLook = useRef(new THREE.Vector3(0, 1.4, 0)).current
  const curLook = useRef(new THREE.Vector3(0, 1.4, 0)).current

  useFrame((state, dt) => {
    const p = THREE.MathUtils.clamp(scrollState.progress, 0, 1)
    const t = state.clock.elapsedTime
    const k = Math.min(1, dt * 2.2)

    sampleShot(p, desiredPos, desiredLook)
    // idle drift + mouse parallax
    desiredPos.x += Math.sin(t * 0.25) * 0.6 + scrollState.mouseX * 2.4
    desiredPos.y += Math.sin(t * 0.4) * 0.25 + scrollState.mouseY * 1.2

    camera.position.lerp(desiredPos, k)
    curLook.lerp(desiredLook, k)
    camera.lookAt(curLook)
  })
  return null
}

function PulseLights() {
  const l1 = useRef()
  const l2 = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (l1.current) l1.current.intensity = 55 + Math.sin(t * 2.2) * 35
    if (l2.current) l2.current.intensity = 42 + Math.cos(t * 1.7) * 26
  })
  return (
    <>
      <pointLight ref={l1} color="#ff6b00" position={[-7, 4, 5]} distance={45} />
      <pointLight ref={l2} color="#ff8c38" position={[7, 3, -4]} distance={45} />
      <pointLight color="#88aaff" position={[0, 10, 6]} intensity={22} distance={45} />
    </>
  )
}

export default function Scene() {
  return (
    <>
      <color attach="background" args={['#07070a']} />
      <fog attach="fog" args={['#07070a', 26, 135]} />

      <CameraRig />

      <ambientLight intensity={0.28} />
      <directionalLight position={[6, 14, 8]} intensity={0.8} color="#aab8ff" castShadow />
      <PulseLights />

      {/* hero car, gently floating, turned to face the road (+Z) */}
      <Float speed={1.3} rotationIntensity={0.14} floatIntensity={0.5} floatingRange={[-0.08, 0.22]}>
        <group position={[0, -0.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <Car />
        </group>
      </Float>

      <ContactShadows position={[0, -0.54, 0]} opacity={0.6} scale={28} blur={2.6} far={9} color="#000000" />

      {/* wet asphalt — reflective night road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]}>
        <planeGeometry args={[160, 400]} />
        <MeshReflectorMaterial
          resolution={512}
          mirror={0.5}
          mixBlur={10}
          mixStrength={1.6}
          blur={[300, 80]}
          roughness={0.9}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
          color="#070708"
          metalness={0.75}
        />
      </mesh>

      {/* the driving world */}
      <Road />

      {/* floating "road light" particles + stars */}
      <Sparkles count={130} scale={[40, 20, 60]} size={5} speed={0.35} color="#ff8c38" opacity={0.7} />
      <Sparkles count={70} scale={[30, 16, 40]} size={3} speed={0.6} color="#ffffff" opacity={0.5} />
      <Stars radius={90} depth={50} count={1600} factor={3} saturation={0} fade speed={0.5} />

      {/* in-memory studio environment (no external HDR download) */}
      <Environment resolution={256} frames={1}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <Lightformer intensity={2} color="#ffffff" form="rect" scale={[12, 4, 1]} position={[0, 6, -9]} />
          <Lightformer intensity={3} color="#ff8c38" form="rect" scale={[8, 3, 1]} position={[-8, 3, 2]} rotation={[0, Math.PI / 3, 0]} />
          <Lightformer intensity={2.4} color="#ff6b00" form="rect" scale={[8, 3, 1]} position={[8, 3, 2]} rotation={[0, -Math.PI / 3, 0]} />
          <Lightformer intensity={1.6} color="#88bbff" form="circle" scale={[5, 5, 1]} position={[0, 8, 4]} />
        </group>
      </Environment>

      {/* cinematic postprocessing */}
      <EffectComposer disableNormalPass multisampling={4}>
        <Bloom luminanceThreshold={0.22} luminanceSmoothing={0.9} intensity={0.95} mipmapBlur />
        <Vignette eskil={false} offset={0.22} darkness={0.9} />
      </EffectComposer>
    </>
  )
}
