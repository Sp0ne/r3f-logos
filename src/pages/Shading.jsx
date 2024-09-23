import {
  useGLTF,
  OrbitControls,
  Environment,
  Outlines,
  useCursor, Edges
} from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { useRef, useState } from 'react'
import Monitoring from '../components/Monitoring.jsx'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { DissolveMaterial } from '@/material/DissolveMaterial.jsx'
import { Floor } from '@/components/FloorGrid.jsx'

const Model = (props) => {
  const { itemDisplayed } = useControls({
    itemDisplayed: {
      value: "box",
      options: ["box", "sphere"],
    },
  });

  const [visibleItem, setVisibleItem] = useState(itemDisplayed);
  const onFadeOut = () => {
    setVisibleItem(itemDisplayed)
  };

  const ref = useRef()
  const { nodes } = useGLTF('./logo.glb')

  const [hovered, setHovered] = useState()
  useCursor(hovered, /*'pointer', 'auto', document.body*/)

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
          position={[0, 0, 0]}
          rotation={[Math.PI / 2, Math.PI, Math.PI]}
          geometry={nodes.V.geometry}
          material={nodes.V.material}
          {...props}
        >
          <DissolveMaterial
            baseMaterial={nodes.V.material}
            visible={itemDisplayed === "box"}
            onFadeOut={onFadeOut}
            color="#E41DED"
          />
          {hovered && <Outlines thickness={0.03} angle={0} color="#e04de8"/>}
          {hovered && <Edges scale={1.0} threshold={2} linewidth={2} color="#e04de8" />}
        </mesh>
      )}
      {visibleItem === "sphere" && (
        <mesh
          castShadow
          receiveShadow
          scale={2}
          position={[0, 0, 0]}
          rotation={[Math.PI / 2, Math.PI, -Math.PI / 2]}
          geometry={nodes.V.geometry}
          material={nodes.V.material}
          {...props}
        >
          <DissolveMaterial
            baseMaterial={nodes.V.material}
            visible={itemDisplayed === 'sphere'}
            onFadeOut={onFadeOut}
            color="#2f1169"
          />


          {hovered && <Outlines thickness={0.03} angle={0} color="#e04de8"/>}
          {hovered && <Edges scale={1.0} threshold={2} linewidth={2} color="#e04de8" />}
        </mesh>
      )}
    </ group>
  )
}
useGLTF.preload('./logo.glb')

const Scene = () => {
  const { orbitControlA } = useControls(
    'Controls',
    {
      orbitControlA: true
    },
    { collapsed: false }
  )


  return (
    <section className={'content fidget'}>
      <Leva collapsed titleBar={{ title: '⚙️ Settings' }} />
      <Canvas className="webgl" dpr={1.5} camera={{ position: [5,8,7], fov: 40 }}>
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
        <Floor />
        {/* Effects */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={1}
            intensity={0.5}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
      <div className="tips">Hit the letter</div>
    </section>
  )
}

export default Scene
