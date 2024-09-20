import {
  Instances,
  Instance,
  useGLTF,
  PivotControls,
  OrbitControls,
  PerspectiveCamera,
  Outlines, DragControls, PresentationControls, ContactShadows, MeshTransmissionMaterial
} from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { Suspense, useRef, useEffect, useState } from 'react'
import Monitoring from '../components/Monitoring.jsx'
import { WiggleBone } from 'wiggle'
import { SkinnedMesh } from 'three'
import { WiggleRigHelper } from "wiggle/helper";
import * as THREE from 'three'
import { Bloom, EffectComposer } from '@react-three/postprocessing'

export function Model(props) {

  const ref = useRef();

  const { nodes, materials } = useGLTF('./logo-bones.glb')
  const wiggleBones = useRef([]);
  const sceneThree = useThree((state) => state.scene)
  const [hovered, setHovered] = useState(false)

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

    /*const helper = new WiggleRigHelper({
      skeleton: nodes.V.skeleton,
      dotSize: 0.3,
      lineWidth: 0.04,
    })
    sceneThree.add(helper)*/

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

  const handleDragEnd = () => {
    if (ref.current) {
      console.log(ref.current.position)
      ref.current.position.y = -0.4;
    }
  };

  const config = useControls({
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
    <PresentationControls
      global
      config={{ mass: 4, tension: 500 }}
      snap={{ mass: 4, tension: 1500 }}
      rotation={[0, 0, 0]}
      polar={[0, 0]}
      azimuth={[-Math.PI / 3, Math.PI / 3]}>
      <DragControls
        transformGroup={true}
        axisLock={'z'}
        dragLimits={[[-1,1],[-1,1],[0,0]]}
        onDragEnd={handleDragEnd}>
        <group ref={ref}  rotation={[0, 0, 0]} {...props} dispose={null}>
          <skinnedMesh
            geometry={nodes.V.geometry}
            material={materials.Glass}
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
    </PresentationControls>

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
      <Instances position={[0, -0.3, 0]}>
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



function Zoom({ vec = new THREE.Vector3(0, 0, 10) }) {
  return useFrame((state) => {
    state.camera.position.lerp(vec.set(state.mouse.x * 3, state.mouse.y * 0.5, 15), 0.075)
    //state.camera.rotateX(state.mouse.y)
    state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 30, 0.775)
    state.camera.updateProjectionMatrix()
  })
}


const Scene = () => {
  const { orbitControlF } = useControls(
    'Canvas.Control',
    {
      orbitControlF: false
    },
    { collapsed: false }
  )

  return (
    <section className={'content fidget'}>
      <Leva collapsed titleBar={{ title: '⚙️ Settings' }} />
      <Canvas className="webgl" dpr={1.5}>
        <Monitoring />
          <PerspectiveCamera position={[0, 5, 10]} />
          <ambientLight intensity={1.25} color={'#f0f0f0'} />
          <color attach="background" args={['#2f1169']} />
          {/*<PivotControls
            scale={2}
            disableRotations
            disableScaling
            activeAxes={[true, false, true]}
            depthTest={false}
            hoveredColor="#e04de8"
          >*/}
            {/*<PresentationControls
              global
              config={{ mass: 4, tension: 500 }}
              snap={{ mass: 4, tension: 1500 }}
              rotation={[0, 0, 0]}
              polar={[0, 0]}
              azimuth={[-Math.PI / 1.4, Math.PI / 2]}>
              <DragControls
                transformGroup={true}
                axisLock={'z'}
                dragLimits={[[-1,1],[-1,1],[0,0]]}
                onDragEnd={handleDragEnd}>*/}
                <Model position={[0, -0.4, 0]} />
              {/*</DragControls>
            </PresentationControls>*/}

          <ContactShadows position={[0, -1.4, 0]} opacity={0.75} scale={10} blur={3} far={4} />
          <Floor />
        {/* Control */}
        {/*<Zoom />*/}
        {orbitControlF && <OrbitControls makeDefault/>}
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
