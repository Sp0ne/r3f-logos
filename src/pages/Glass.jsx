import {
  useGLTF,
  OrbitControls,
  Environment,
  MeshTransmissionMaterial
} from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { useRef } from 'react'
import Monitoring from '../components/Monitoring.jsx'
import * as THREE from 'three'
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
      >
        {/*<MeshTransmissionMaterial backside backsideThickness={10} thickness={5} />*/}
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={3}
          chromaticAberration={0.025}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.1}
          temporalDistortion={0.2}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          opacity={0.5}
        />
      </mesh>
    </ group>
  )
}
useGLTF.preload('./logo.glb')

function Zoom({ vec = new THREE.Vector3(0, 0, 10) }) {
  return useFrame((state) => {
    state.camera.position.lerp(vec.set(state.mouse.x + 5, state.mouse.y + 8, 7), 0.075)
    //state.camera.rotateX(state.mouse.y)
    // state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 30, 0.775)
    state.camera.updateProjectionMatrix()
  })
}

const Scene = () => {
  const {  orbitControlG } = useControls(
    'Controls',
    {
      orbitControlG: false
    },
    { collapsed: false }
  )
  return (
    <section className={'content'}>
      <Leva collapsed titleBar={{ title: '⚙️ Settings' }} />
      <Canvas className="webgl" dpr={1.5} camera={{ position: [5,8,7], fov: 40 }}>
        {/* Performance */}
        <Monitoring />
        {/* Control */}
        {orbitControlG &&
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
        <Floor />
        {/* Control */}
        <Zoom />
      </Canvas>
      <div className="tips">Move your cursor</div>
    </section>
  )
}

export default Scene
