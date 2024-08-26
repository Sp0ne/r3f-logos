import {
  Instances,
  Instance,
  useGLTF,
  PivotControls,
  OrbitControls,
  PerspectiveCamera,
  Outlines
} from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { Suspense, useRef, useEffect } from 'react'
import Monitoring from '../components/Monitoring.jsx'
import { WiggleBone } from 'wiggle'
import { SkinnedMesh } from 'three'

export function Model(props) {
  const { nodes, materials } = useGLTF('./logo-bones.glb')
  const wiggleBones = useRef([]);
  useEffect(() => {
    wiggleBones.current.length = 0;
    nodes.RootBone.traverse((bone) => {
      console.log(bone)
      if (bone.isBone && bone !== nodes.RootBone) {
        const wiggleBone = new WiggleBone(bone, {
          velocity: 0.45,
        });
        wiggleBones.current.push(wiggleBone);
      }
    });
    return () => {
      wiggleBones.current.forEach((wiggleBone) => {
        wiggleBone.reset();
        wiggleBone.dispose();
      });
    };
  }, [nodes]);

  useFrame(() => {
    wiggleBones.current.forEach((wiggleBone) => {
      wiggleBone.update();
    });
  });
  return (
    <group {...props} dispose={null}>
      <primitive object={nodes.RootBone} />
      <skinnedMesh
        geometry={nodes.V.geometry}
        material={materials.Glass}
        skeleton={nodes.V.skeleton}
      >
      <Outlines thickness={0.2} color="pink"/>
      </skinnedMesh>
    </group>
  )
}

useGLTF.preload('./logo-bones.glb')

const Floor = () => {
  const crossNumber = 25
  const crossLineWidth = 0.05
  const crossHeight = 0.2

  return (
    <>
      {/*<RigidBody type="fixed" friction={0.75} position={[0, -1, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[40, 0.2, 40]} />
          <meshStandardMaterial color="#6EF7C9" />
          <meshBasicMaterial color="#e04de8" transparent depthTest={false} opacity={0.5} />
        </mesh>
      </RigidBody>*/}
      <Instances position={[0, -0.5, 0]}>
        <planeGeometry args={[crossLineWidth, crossHeight]} />
        <meshBasicMaterial color="#e04de8" opacity={0.5} transparent />
        {Array.from({ length: crossNumber }, (_, y) =>
          Array.from({ length: crossNumber }, (_, x) => (
            <group key={x + ':' + y} position={[x * 3 - Math.floor(crossNumber / 2) * 3, 0.01, y * 3 - Math.floor(crossNumber / 2) * 3]}>
              <Instance rotation={[-Math.PI / 2, 0, 0]} />
              <Instance rotation={[-Math.PI / 2, 0, Math.PI / 2]} />
            </group>
          ))
        )}
        <gridHelper args={[80, 80]} position={[0, 0, 0]}>
          <meshBasicMaterial color="#FFFFFF" opacity={0.05} transparent />
        </gridHelper>
      </Instances>
    </>
  )
}

const Scene = () => {
  const { orbitControlF } = useControls(
    'Canvas.Control',
    {
      orbitControlF: true
    },
    { collapsed: false }
  )
  return (
    <section className={'content fidget'}>
      <Leva collapsed titleBar={{ title: '⚙️ Settings' }} />
      <Canvas className="webgl" dpr={1.5}>
        <Monitoring />
        <Suspense>
          <PerspectiveCamera />
          <ambientLight intensity={1.25} color={'#f0f0f0'} />
          <color attach="background" args={['#2f1169']} />
          <PivotControls
            scale={2}
            disableRotations
            disableScaling
            activeAxes={[true, false, true]}
            depthTest={false}
            hoveredColor="#e04de8"
          >
            <Model />
          </PivotControls>
          <Floor />
        </Suspense>
        {/* Grid Infinite */}
        {orbitControlF && <OrbitControls makeDefault/>}
      </Canvas>
      <div className="tips">Drag the hockey and hit the letter</div>
    </section>
  )
}

export default Scene
