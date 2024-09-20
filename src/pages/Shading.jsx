import {
  useGLTF,
  OrbitControls,
  PerspectiveCamera, Environment, ContactShadows, Grid, GizmoHelper, GizmoViewport, Outlines, useCursor
} from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { Suspense, useRef, useState } from 'react'
import Monitoring from '../components/Monitoring.jsx'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { DissolveMaterial } from '@/material/DissolveMaterial.jsx'

const Model = (props) => {
  const { itemDisplayed } = useControls({
    itemDisplayed: {
      value: "box",
      options: ["box", "sphere"],
    },
  });

  const [visibleItem, setVisibleItem] = useState(itemDisplayed);
  const onFadeOut = () => setVisibleItem(itemDisplayed);

  const ref = useRef()
  const { nodes } = useGLTF('./logo.glb')

  const [hovered, setHovered] = useState()
  useCursor(hovered, /*'pointer', 'auto', document.body*/)

  // Make a function to switch between the items and set the hovered state to false when switching




  return (
    <group
      ref={ref}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {visibleItem === "box" && (
        <mesh
          castShadow
          receiveShadow
          scale={2}
          position={[0, 1, 0]}
          rotation={[0, Math.PI, 0]}
          geometry={nodes.V.geometry}
          material={nodes.V.material}
          onPointerDown={() => setVisibleItem('sphere')}
          {...props}
        >
          <DissolveMaterial
            baseMaterial={nodes.V.material}
            visible={itemDisplayed === "box"}
            onFadeOut={onFadeOut}
            color="#E41DED"
          />
          {hovered && <Outlines thickness={0.03} angle={0} />}
        </mesh>
      )}
      {visibleItem === "sphere" && (
        <mesh
          castShadow
          receiveShadow
          scale={2}
          position={[0, 1, 0]}
          rotation={[0, Math.PI, 0]}
          geometry={nodes.V.geometry}
          material={nodes.V.material}
          onPointerDown={() => setVisibleItem('box')}
          {...props}
        >
          <DissolveMaterial
            baseMaterial={nodes.V.material}
            visible={itemDisplayed === "sphere"}
            onFadeOut={onFadeOut}
            color="#2f1169"
          />
          {hovered && <Outlines thickness={0.03} angle={0} />}
        </mesh>
      )}
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
        <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={75} />
        <ambientLight intensity={1.25} color={'#f0f0f0'} />
        <color attach="background" args={['#2f1169']} />
        <Environment preset="city" blur={1} />
        <ContactShadows resolution={512} position={[0, -2, 0]} opacity={1} scale={10} blur={3} far={4} />
        <Model />
        <Grid
          position={[0, -2.05, 0]}
          args={gridSize}
          sectionColor={'#e41ded'}
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
        {/* Grid Infinite */}
        {orbitControlA && <OrbitControls makeDefault />}
        <EffectComposer>
          <Bloom
            luminanceThreshold={1}
            intensity={1}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
      <div className="tips">Drag the letter</div>
    </section>
  )
}

export default Scene
