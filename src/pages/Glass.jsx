import {
  useGLTF,
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
  GizmoHelper,
  GizmoViewport,
  Text,
  Lightformer,
  MeshTransmissionMaterial, Cloud, Clouds, Grid
} from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { Suspense, useRef } from 'react'
import Monitoring from '../components/Monitoring.jsx'
import * as THREE from 'three'

const Model = (props) => {
  const ref = useRef()
  const { nodes } = useGLTF('./logo.glb')
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.set(Math.cos(t / 4) / 8, Math.sin(t / 3) / 4, 0.15 + Math.sin(t / 2) / 8)
    ref.current.position.y = (0.5 + Math.cos(t / 2)) / 7
  })
  return (
    <group ref={ref}>
      <mesh
        castShadow
        receiveShadow
        scale={2}
        position={[0, 0.8, 0]}
        rotation={[0, Math.PI, 0]}
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
        />
      </mesh>
    </ group>
  )
}
useGLTF.preload('./logo.glb')

function Zoom({ vec = new THREE.Vector3(0, 0, 10) }) {
  return useFrame((state) => {
    state.camera.position.lerp(vec.set(state.mouse.x * 3, state.mouse.y * 0.5, 15), 0.075)
    //state.camera.rotateX(state.mouse.y)
    state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 30, 0.775)
    state.camera.updateProjectionMatrix()
  })
}

const Scene = () => {
  const {  orbitControlG } = useControls(
    'Canvas.Physics',
    {
      orbitControlG: true
    },
    { collapsed: false }
  )
  return (
    <section className={'content fidget'}>
      <Leva collapsed titleBar={{ title: '⚙️ Settings' }} />
      <Canvas className="webgl" dpr={1.5}>
        <Monitoring />
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={75} />
          <ambientLight intensity={1.25} color={'#f0f0f0'} />
          <color attach="background" args={['#2f1169']} />
          <Environment preset="night">
            <Lightformer intensity={8} position={[10, 5, 0]} scale={[10, 50, 1]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
          </Environment>
          <ContactShadows resolution={512} position={[0, -2.3, 0]} opacity={1} scale={20} blur={3} far={5} />
          <Model position={[0, 0.8, 0]} rotation={[0, 0.5, 0]} />
          <Clouds limit={400} material={THREE.MeshBasicMaterial}>
            <Cloud position={[7, 2, 5]} rotation={[0, 30,0]} opacity={0.1} seed={10} fade={30} speed={0.1} growth={6} segments={40} volume={10} bounds={[4, 3, 1]}  color={'#f8b2fd'}/>
            <Cloud position={[-7, 2, 5]} rotation={[0, 30,0]} opacity={0.1} seed={10} fade={30} speed={0.1} growth={6} segments={40} volume={10} bounds={[4, 3, 1]}  color={'#f8b2fd'}/>
          </Clouds>
          <Text
            position={[0, 1, -80]}
            letterSpacing={-0.05}
            font="./fonts/Ubuntu/Ubuntu-Bold.ttf"
            fontSize={20}
            color={'#422181'}
            material-toneMapped={false}
            material-fog={false}
            anchorX="center"
            anchorY="middle">
            {`Sp0ne`}
          </Text>
        </Suspense>
        {/* Control */}
        <Zoom />
        {orbitControlG && <OrbitControls makeDefault />}
      </Canvas>
      <div className="tips">Drag the letter</div>
    </section>
  )
}

export default Scene
