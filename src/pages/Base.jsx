import { useGLTF, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { Suspense } from 'react'
import Monitoring from '../components/Monitoring.jsx'

const Model = () => {
  const { nodes } = useGLTF('./logo.glb')
  return (
    <>
      <mesh castShadow receiveShadow scale={2} position={[0, 0.5, 0]} rotation={[0,Math.PI,0]} geometry={nodes.V.geometry} material={nodes.V.material}>
        <meshBasicMaterial attach="material" color="#e04de8" transparent depthTest={false} opacity={0.8} />
      </mesh>
    </>
  )
}

const Scene = () => {
  const {  orbitControl } = useControls(
    'Canvas.Physics',
    {
      orbitControl: true
    },
    { collapsed: false }
  )
  return (
    <section className={'content fidget'}>
      <Leva collapsed titleBar={{ title: '⚙️ Settings' }} />
      <Canvas className="webgl" dpr={1.5}>
        <Monitoring />
        <Suspense>
          <PerspectiveCamera makeDefault position={[0, 0, -10]} fov={75} />
          <ambientLight intensity={1.25} color={'#f0f0f0'} />
          <color attach="background" args={['#2f1169']} />
          <Model />
        </Suspense>
        {/* Grid Infinite */}
        {orbitControl && <OrbitControls makeDefault />}
      </Canvas>
      <div className="tips">Drag the letter</div>
    </section>
  )
}

export default Scene
