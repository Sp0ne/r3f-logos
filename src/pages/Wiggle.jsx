import {
  useGLTF,
  OrbitControls,
  DragControls, MeshTransmissionMaterial, Environment
} from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { useRef, useEffect, useState } from 'react'
import Monitoring from '../components/Monitoring.jsx'
import { WiggleBone } from 'wiggle'
import { WiggleRigHelper } from "wiggle/helper";
import * as THREE from 'three'
import { Floor } from '@/components/FloorGrid.jsx'

export function Model(props) {

  const ref = useRef();

  const { nodes, materials } = useGLTF('./logo-bones.glb')
  const wiggleBones = useRef([]);
  const sceneThree = useThree((state) => state.scene)
  const [hovered, setHovered] = useState(false)


  // Add helper
  const helper = new WiggleRigHelper({
    skeleton: nodes.V.skeleton,
    dotSize: 0.3,
    lineWidth: 0.04,
  })


  const { wiggleRigHelper } = useControls(
    'WiggleRigHelper',
    {
      wiggleRigHelper: false
    },
    { collapsed: false }
  )


  useEffect(() => {
    document.body.style.cursor = hovered ? 'grab' : 'auto'
  }, [hovered])

  useEffect(() => {
    wiggleBones.current.length = 0;
    nodes.RootBone.traverse((bone) => {
      console.log(bone)
      if (bone.isBone && bone !== nodes.RootBone) {
        const wiggleBone = new WiggleBone(bone, {
          velocity: 0.30,
        });
        wiggleBones.current.push(wiggleBone);
      }
    });

    return () => {
      wiggleBones.current.forEach((wiggleBone) => {
        wiggleBone.reset();
        wiggleBone.dispose();
        helper.dispose()
      });
    };
  }, [nodes]);

  useFrame(() => {
    wiggleBones.current.forEach((wiggleBone) => {
      wiggleBone.update();
    });

    if(wiggleRigHelper){
      sceneThree.add(helper)
    }
  });

  const config = useControls(
    'Material',
    {
      meshPhysicalMaterial: false,
      transmissionSampler: false,
      backside: false,
      samples: { value: 10, min: 1, max: 32, step: 1 },
      resolution: { value: 2048, min: 256, max: 2048, step: 256 },
      transmission: { value: 1, min: 0, max: 1 },
      roughness: { value: 0.0, min: 0, max: 1, step: 0.01 },
      thickness: { value: 3.5, min: 0, max: 10, step: 0.01 },
      ior: { value: 1.5, min: 1, max: 5, step: 0.01 },
      chromaticAberration: { value: 0.06, min: 0, max: 1 },
      anisotropy: { value: 0.1, min: 0, max: 1, step: 0.01 },
      distortion: { value: 0.0, min: 0, max: 1, step: 0.01 },
      distortionScale: { value: 0.3, min: 0.01, max: 1, step: 0.01 },
      temporalDistortion: { value: 0.5, min: 0, max: 1, step: 0.01 },
      clearcoat: { value: 1, min: 0, max: 1 },
      attenuationDistance: { value: 0.5, min: 0, max: 10, step: 0.01 },
      attenuationColor: '#ffffff',
      color: '#e04de8',
      bg: '#a184a3'
  })

  return (
    <DragControls
      transformGroup={true}
      axisLock={'y'}
      dragLimits={[[-4,4],[0,0],[-4,4]]}
    >
      <group ref={ref} {...props}>
        <skinnedMesh
          castShadow
          receiveShadow
          scale={2}
          position={[0, 0, 2]}
          rotation={[Math.PI / 2, Math.PI, Math.PI]}
          geometry={nodes.V.geometry}
          material={materials['Material.001']}
          skeleton={nodes.V.skeleton}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <primitive object={nodes.RootBone} />
          {/*<Outlines thickness={0.1} color="pink"/>*/}
          <MeshTransmissionMaterial background={new THREE.Color(config.bg)} {...config} />
        </skinnedMesh>
      </group>
    </DragControls>
  )
}

useGLTF.preload('./logo-bones.glb')


const Scene = () => {
  const { orbitControlF } = useControls(
    'Controls',
    {
      orbitControlF: false
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
        {orbitControlF &&
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
      </Canvas>
      <div className="tips">Drag the letter</div>
    </section>
  )
}

export default Scene
