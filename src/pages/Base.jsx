import {
  useGLTF,
  OrbitControls,
  Environment,
  ContactShadows,
  GizmoHelper,
  GizmoViewport
} from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { useRef } from 'react'
import Monitoring from '../components/Monitoring.jsx'
import { Floor } from '@/components/FloorGrid.jsx'

const Model = (props) => {
  const ref = useRef()
  const { nodes } = useGLTF('./logo.glb')
  return (
    <group ref={ref}>
      <mesh
        castShadow
        receiveShadow
        scale={2}
        position={[0, 0, 0]}
        rotation={[Math.PI / 2, Math.PI, Math.PI]}
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
    'Controls',
    {
      orbitControlA: true
    },
    { collapsed: false }
  )
  return (
    <section className={'content'}>
      <Leva collapsed titleBar={{ title: '⚙️ Settings' }} />
      <Canvas className="webgl" dpr={1.5} camera={{ position: [5,8,7], fov: 45 }}>
        {/* Performance */}
        <Monitoring />
        {/* Control */}
        {orbitControlA &&
          <OrbitControls
            makeDefault
            maxPolarAngle={Math.PI / 2}
            dampingFactor={0.05}
            enablePan={false}
            enableZoom={false}
            enableDamping
          />}
        {/* Environment */}
        <ambientLight intensity={1.25} color={'#f0f0f0'} />
        <color attach="background" args={['#2f1169']} />
        <Environment preset="city" blur={1} />
        {/* Scene */}
        <Model />
        <ContactShadows resolution={512} position={[0, -0.3, 0]} opacity={0.9} scale={15} blur={4} far={4} />
        <Floor />
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" />
        </GizmoHelper>
      </Canvas>
      <div className="tips">Drag the scene</div>
    </section>
  )
}

export default Scene
