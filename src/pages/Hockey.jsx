import { OrthographicCamera, useGLTF, Edges, PivotControls, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { useRef, useEffect, useState, useCallback } from 'react'
import { BallCollider, Physics, RigidBody, useFixedJoint } from '@react-three/rapier'
import * as THREE from 'three'
import Monitoring from '../components/Monitoring.jsx'
import { Floor } from '@/components/FloorGrid.jsx'

const Pointer = () => {
  const shouldCollide = useRef(false);
  const ref = useRef();
  const vec = new THREE.Vector3();

  useFrame(({ pointer, viewport }) => {
    const horizontalMovement = ((pointer.x * viewport.width) / 2) * 0.8;
    const verticalMovement = (pointer.y * viewport.height) / 2;

    // We only want to apply the force if
    // - the user is using a mouse
    // - the user holds and drags the finger on the screen
    // => this is to avoid weird side effects where users loose the collider on the screen causing
    // unwanted edge cases on mobile
    if (shouldCollide.current) {
      vec.set(
        0 - verticalMovement + horizontalMovement,
        0,
        0 - verticalMovement - horizontalMovement
      );
    } else {
      // when not interacting with the screen, keep the collider out of reach
      vec.set(0, 25, 0);
    }

    ref.current?.setNextKinematicTranslation(vec);
  });

  const onMouseDown = useCallback(() => {
    // Finger on the screen detected -> we can turn on the shouldCollide flag
    shouldCollide.current = true;
  }, []);

  const onMouseMove = useCallback(() => {
    // Mouse move detected -> we can turn on the shouldCollide flag (we're on a desktop env)
    shouldCollide.current = true;
  }, []);

  const onMouseUp = () => {
    // Finger off the screen detected -> we can turn off the shouldCollide flag
    shouldCollide.current = false;
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchstart", onMouseDown);
    document.addEventListener("touchend", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchstart", onMouseDown);
      document.removeEventListener("touchend", onMouseUp);
    };
  }, [onMouseDown, onMouseMove]);

  return (
    <RigidBody
      position={[5, 5, 5]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      {/*<boxGeometry />*/}
      <cylinderGeometry args={[0.8, 0.8, 0.8, 30]} />
      <meshBasicMaterial color="#e04de8" wireframe transparent depthTest={false} opacity={0.0} />
      <Edges scale={1.0} threshold={12} linewidth={2} color="#e04de8" />
      <BallCollider args={[1.5]} />
    </RigidBody>
  );
};

function Movable({ children, startPosition = [0, 0, 0], ...props }) {
  const obj = useRef()
  const pointer = useRef()
  const [matrix] = useState(() => new THREE.Matrix4())
  const vec = new THREE.Vector3()

  // Set initial position based on startPosition prop
  useEffect(() => {
    matrix.setPosition(new THREE.Vector3(...startPosition))
  }, [startPosition, matrix])

  // A fixed constraint chaining the empty rigid body to the object rigid body
  useFixedJoint(pointer, obj, [
    [0, 0, 0],
    [0, 0, 0, 1],
    [0, 0, 0],
    [0, 0, 0, 1]
  ])
  return (
    <group {...props}>
      {/** Pivot controls a matrix, and steers the empty rigid body below */}
      <PivotControls
        matrix={matrix}
        scale={2}
        disableRotations
        disableScaling
        activeAxes={[true, false, true]}
        depthTest={false}
        position={startPosition}
        hoveredColor="#e04de8"
        // When drag is over snap matrix back to the object
        onDragEnd={() => matrix.setPosition(vec.copy(obj.current?.translation()))}
        // Get pivot matrix, apply it to the empty RB
        onDrag={(local) => pointer.current?.setNextKinematicTranslation(vec.setFromMatrixPosition(local))}
      />
      {/** Empty RB is tied to cursor via pivot control above */}
      <RigidBody canSleep={false} type="kinematicPosition" ref={pointer} position={startPosition} />
      {/** Actual RB is tied to the empty via fixed constraint with CCD */}
      <RigidBody ccd canSleep={false} colliders={'cuboid'} enabledRotations={[false, false, false]} ref={obj} position={startPosition}>
        {children}
      </RigidBody>
    </group>
  )
}

const Hockey = () => {
  const physMesh = useRef()
  const { nodes } = useGLTF('./logo.glb')
  const { stiffness, enableRotations, enableTranslations } = useControls(
    'Fidget',
    {
      stiffness: {
        value: 0.5,
        min: 0.1,
        max: 2,
        step: 0.1
      },
      enableRotations: {
        value: true
      },
      enableTranslations: {
        value: true
      }
    },
    { collapsed: false }
  )

  useFrame((state) => {
    const { camera } = state

    // Convert Rapier quaternion to Three.js quaternion
    const currentRotation = physMesh.current.rotation()
    const quaternion = new THREE.Quaternion(currentRotation.x, currentRotation.y, currentRotation.z, currentRotation.w)

    // Convert Three.js quaternion to Euler
    const currentEuler = new THREE.Euler().setFromQuaternion(quaternion, 'XYZ')
    // Get the rotation around the Y axis we need to apply in reverse
    const deltaY = -currentEuler.y
    // Reset rotation
    const angularImpulse = new THREE.Vector3(0, deltaY, 0).multiplyScalar(stiffness * 12.5)
    physMesh.current.applyTorqueImpulse(angularImpulse)

    // Convert Rapier vector to Three.js vector
    const currentTranslation = physMesh.current.translation()
    const translation = new THREE.Vector3(currentTranslation.x, currentTranslation.y, currentTranslation.z)

    // Apply the force in reverse
    const translationImpulse = translation.negate().multiplyScalar(stiffness * 25)
    physMesh.current?.applyImpulse(translationImpulse)

    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      {/** Makes contents movable */}
      <Movable startPosition={[5, 0, 2]}>
        <mesh>
          {/*<boxGeometry />*/}
          <cylinderGeometry args={[0.8, 0.8, 0.8, 30]} />
          <meshBasicMaterial color="#e04de8" wireframe transparent depthTest={false} opacity={0.0} />
          <Edges scale={1.0} threshold={12} linewidth={2} color="#e04de8" />
        </mesh>
      </Movable>
      {/*<Pointer />*/}
      <RigidBody
        ref={physMesh}
        linearDamping={4}
        angularDamping={1}
        friction={0.1}
        gravityScale={1}
        mass={0.6}
        enabledTranslations={[enableTranslations, false, enableTranslations]}
        enabledRotations={[false, enableRotations, false]}
        position={[0, 0, 0]}
        colliders={'cuboid'}
      >
        <mesh scale={3.5} position={[0, 0.5, 0]} rotation={[Math.PI / 2, Math.PI, Math.PI]} geometry={nodes.V.geometry}>
          <meshBasicMaterial color="#e04de8" wireframe transparent depthTest={false} opacity={0.0} />
          <Edges scale={1.0} threshold={2} linewidth={2} color="#e04de8" />
        </mesh>
      </RigidBody>
    </>
  )
}

const Scene = () => {
  const { debugPhysics, orbitControlF } = useControls(
    'Controls',
    {
      debugPhysics: false,
      orbitControlF: false
    },
    { collapsed: false }
  )
  return (
    <section className={'content fidget'}>
      <Leva collapsed titleBar={{ title: '⚙️ Settings' }} />
      <Canvas className="webgl" dpr={1.5}>
        {/* Performance */}
        <Monitoring />
        {/* Camera */}
        <OrthographicCamera makeDefault position={[5,8,7]} zoom={50} near={1} far={80} />
        {/* Control */}
        {orbitControlF && <OrbitControls makeDefault />}
        {/* Environment */}
        <ambientLight intensity={1.25} color={'#f0f0f0'} />
        <color attach="background" args={['#2f1169']} />
        {/* Scene */}
        <Physics gravity={[0, 0, 0]} debug={debugPhysics} timeStep="vary">
          <Hockey />
          <Floor />
        </Physics>
      </Canvas>
      {/* Ux */}
      <div className="tips">Drag the hockey and hit the letter</div>
    </section>
  )
}

export default Scene
