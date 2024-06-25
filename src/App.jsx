import "./styles.css";
import {
  Instances,
  Instance,
  OrthographicCamera,
  useGLTF,
  Edges,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { Suspense, useRef, useCallback, useEffect } from "react";
import { Physics, RigidBody, BallCollider } from "@react-three/rapier";
import * as THREE from "three";

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
      <BallCollider args={[1.5]} />
    </RigidBody>
  );
};

const Fidget = () => {
  const crossNumber = 25;
  const crossLineWidth = 0.05;
  const crossHeight = 0.2;

  const physMesh = useRef();

  const { nodes } = useGLTF("./logo.glb");

  const { stiffness, enableRotations, enableTranslations } = useControls({
    stiffness: {
      value: 0.3,
      min: 0.1,
      max: 2,
      step: 0.1,
    },
    enableRotations: {
      value: true,
    },
    enableTranslations: {
      value: true,
    },
  });

  useFrame((state) => {
    const { camera } = state;

    // Convert Rapier quaternion to Three.js quaternion
    const currentRotation = physMesh.current.rotation();
    const quaternion = new THREE.Quaternion(
      currentRotation.x,
      currentRotation.y,
      currentRotation.z,
      currentRotation.w
    );

    // Convert Three.js quaternion to Euler
    const currentEuler = new THREE.Euler().setFromQuaternion(quaternion, "XYZ");
    // Get the rotation around the Y axis we need to apply in reverse
    const deltaY = -currentEuler.y;
    // Reset rotation
    const angularImpulse = new THREE.Vector3(0, deltaY, 0).multiplyScalar(
      stiffness * 10
    );
    physMesh.current.applyTorqueImpulse(angularImpulse);

    // Convert Rapier vector to Three.js vector
    const currentTranslation = physMesh.current.translation();
    const translation = new THREE.Vector3(
      currentTranslation.x,
      currentTranslation.y,
      currentTranslation.z
    );

    // Apply the force in reverse
    const translationImpulse = translation
      .negate()
      .multiplyScalar(stiffness * 10);
    physMesh.current?.applyImpulse(translationImpulse);

    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <OrthographicCamera
        makeDefault
        position={[10, 10, 10]}
        zoom={40}
        near={0.01}
        far={100}
      />
      <Pointer />
      <RigidBody
        ref={physMesh}
        linearDamping={4}
        angularDamping={1}
        friction={0.1}
        enabledTranslations={[enableTranslations, false, enableTranslations]}
        enabledRotations={[false, enableRotations, false]}
        position={[0, 0, 0]}
        colliders="trimesh"
      >
        <mesh scale={40.0} geometry={nodes.V.geometry}>
          <meshBasicMaterial
            color="#e04de8"
            wireframe
            transparent
            opacity={0.0}
          />
          <Edges scale={1.0} threshold={1.5} color="#e04de8" />
        </mesh>
      </RigidBody>

      <Instances position={[0, -2, 0]}>
        <planeGeometry args={[crossLineWidth, crossHeight]} />
        <meshBasicMaterial color="#e04de8" opacity={0.5} transparent />
        {Array.from({ length: crossNumber }, (_, y) =>
          Array.from({ length: crossNumber }, (_, x) => (
            <group
              key={x + ":" + y}
              position={[
                x * 3 - Math.floor(crossNumber / 2) * 3,
                0.01,
                y * 3 - Math.floor(crossNumber / 2) * 3,
              ]}
            >
              <Instance rotation={[-Math.PI / 2, 0, 0]} />
              <Instance rotation={[-Math.PI / 2, 0, Math.PI / 2]} />
            </group>
          ))
        )}
        <gridHelper args={[100, 100]} position={[0, 0, 0]}>
          <meshBasicMaterial color="#FFFFFF" opacity={0.05} transparent />
        </gridHelper>
      </Instances>
    </>
  );
};

const Scene = () => {
  const mainRef = useRef()
  return (
    <main ref={mainRef}>
      <header className="header">
        <a href={'/'} className="logo" title={'R3f Vinces'}>
          <svg width="200" height="220" viewBox="0 0 200 220" fill="black" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M77.1373 34.0754C71.1727 18.8447 53.0522 10.9916 36.6642 16.5352C20.2763 22.0787 11.8267 38.9196 17.7914 54.1504L57.9497 156.694L91.5536 70.887L77.1373 34.0754ZM100 49.3191L92.0541 29.0295C83.0909 6.14203 55.8611 -5.6587 31.235 2.67162C6.60875 11.002 -6.08863 36.3089 2.87458 59.1963L54.4802 190.97C61.6048 209.163 80.2708 220.351 99.9965 219.991C119.725 220.354 138.394 209.165 145.52 190.97L197.125 59.1964C206.089 36.309 193.391 11.002 168.765 2.67165C144.139 -5.65869 116.909 6.14215 107.946 29.0295L100 49.3191ZM100 92.4548L71.257 165.85C65.2924 181.08 73.7421 197.921 90.1301 203.465C93.3872 204.567 96.7129 205.139 99.9979 205.23C103.284 205.14 106.611 204.567 109.87 203.465C126.258 197.921 134.708 181.08 128.743 165.849L100 92.4548ZM142.05 156.694L108.446 70.887L122.863 34.0755C128.827 18.8447 146.948 10.9917 163.336 16.5352C179.724 22.0788 188.173 38.9198 182.209 54.1505L142.05 156.694Z"/>
          </svg>
        </a>
      </header>
      <Canvas dpr={1.5}>
        <Suspense>
          <ambientLight intensity={1.25} color={"#f0f0f0"} />
          <color attach="background" args={["#2f1169"]} />
          <Physics gravity={[0, 0, 0]}>
            <Fidget />
          </Physics>
        </Suspense>
      </Canvas>
      <footer className="footer">
        <span role="img" aria-label="hey">
          👋🏻
        </span>{' '}
        <a href="https://vinces.io" target="_blank" rel="noreferrer" title="Site Vinces.io">
          vinces.io
        </a>{' '}
        〢
        <a href="https://github.com/Sp0ne" target="_blank" rel="noreferrer" title="Github Vinces">
          @Sp0ne
        </a>
      </footer>
    </main>
  );
};

export default Scene;
