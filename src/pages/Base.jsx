import {
  useGLTF,
  OrbitControls,
  PerspectiveCamera, Environment, ContactShadows, Grid, GizmoHelper, GizmoViewport
} from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { Suspense, useRef } from 'react'
import Monitoring from '../components/Monitoring.jsx'

const Model = (props) => {
  const ref = useRef()
  const { nodes } = useGLTF('./logo.glb')
  /*useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.set(Math.cos(t / 4) / 8, Math.sin(t / 3) / 4, 0.15 + Math.sin(t / 2) / 8)
    ref.current.position.y = (0.5 + Math.cos(t / 2)) / 7
  })*/
  return (
    <group ref={ref}>
      <mesh
        castShadow
        receiveShadow
        scale={2}
        position={[0, 1, 0]}
        rotation={[0, Math.PI, 0]}
        geometry={nodes.V.geometry}
        material={nodes.V.material}
        {...props}
      />
    </ group>
  )
}
useGLTF.preload('./logo.glb')

const Scene = () => {
  const {  orbitControlA } = useControls(
    'Canvas.Physics',
    {
      orbitControlA: true
    },
    { collapsed: false }
  )
  const { gridSize } = useControls(
    'Canvas.Grid',
    {
      gridSize: [10.5, 10.5]
    },
    { collapsed: false }
  )
  return (
    <section className={'content fidget'}>
      <Leva collapsed titleBar={{ title: '⚙️ Settings' }} />
      <Canvas className="webgl" dpr={1.5}>
        <Monitoring />
        <Suspense>
          <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={75} />
          <ambientLight intensity={1.25} color={'#f0f0f0'} />
          <color attach="background" args={['#2f1169']} />
          <Environment preset="city" blur={1} />
          <ContactShadows resolution={512} position={[0, -2, 0]} opacity={1} scale={10} blur={3} far={4} />
          <Model />
          <Grid
            position={[0, -2.05, 0]}
            args={gridSize}
            sectionColor={'#e04de8'}
            sectionSize={3}
            cellColor={'#f4c6f4'}
            cellSize={1}
            infiniteGrid
            fadeDistance={25}
            fadeStrength={1}
            followCamera={false}
          />
          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" />
          </GizmoHelper>
        </Suspense>
        {/* Grid Infinite */}
        {orbitControlA && <OrbitControls makeDefault />}
      </Canvas>
      <div className="tips">Drag the letter</div>
    </section>
  )
}

export default Scene
