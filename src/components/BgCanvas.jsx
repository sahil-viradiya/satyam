import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import Scene from '../three/Scene.jsx'

/* Adaptive DPR: start at 1.5, climb to 2 on strong GPUs, drop toward 1
   when frame rate dips — keeps motion smooth on every machine. */
export default function BgCanvas() {
  const [dpr, setDpr] = useState(1.5)

  return (
    <div className="bg-canvas">
      <Canvas
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: false,
          stencil: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        camera={{ position: [7, 2.4, 9], fov: 50, near: 0.1, far: 300 }}
      >
        <PerformanceMonitor
          onIncline={() => setDpr(Math.min(2, window.devicePixelRatio))}
          onDecline={() => setDpr(1)}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
    </div>
  )
}
