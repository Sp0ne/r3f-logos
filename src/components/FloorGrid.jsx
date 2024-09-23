import { Instance, Instances, Text } from '@react-three/drei'
import { useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

export const TextCustom = () => {
  // State to hold the current cursor position
  const [cursorPosition, setCursorPosition] = useState([0, 0]);
  const [cameraPosition, setCameraPosition] = useState([0, 0, 0]);

  // Get the mouse position and camera from the Three.js context
  const { pointer, viewport, camera } = useThree();

  // Update the cursor position based on the mouse movement in the scene
  useFrame(() => {
    const x = pointer.x * (viewport.width / 2);
    const y = pointer.y * (viewport.height / 2);
    setCursorPosition([x, y]);
    setCameraPosition([camera.position.x, camera.position.y, camera.position.z]);
  });

  return (
    <>
      <Text
        position={[3.1, -0.5, -3.5]}
        rotation={[Math.PI / 2, Math.PI, Math.PI]}
        letterSpacing={0.01}
        font="./fonts/Ubuntu/Ubuntu-Bold.ttf"
        fontSize={0.25}
        color={'#543d93'}
        anchorX="left"
        anchorY="middle">
        {`Pointer\n`}
        {`x: ${cursorPosition[0].toFixed(5)} \n`}
        {`y: ${cursorPosition[1].toFixed(5)}`}
      </Text>
      <Text
        position={[-4.9, -0.5, 3.5]}
        rotation={[Math.PI / 2, Math.PI, Math.PI]}
        letterSpacing={0.01}
        font="./fonts/Ubuntu/Ubuntu-Bold.ttf"
        fontSize={0.25}
        color={'#543d93'}
        anchorX="left"
        anchorY="middle">
        {`Camera\n`}
        {`x: ${cameraPosition[0].toFixed(5)} \n`}
        {`y: ${cameraPosition[1].toFixed(5)} \n`}
        {`z: ${cameraPosition[2].toFixed(5)}`}
      </Text>
      <Text
        position={[-5.5, -0.5, -2.1]}
        rotation={[Math.PI / 2, Math.PI, -Math.PI / 2]}
        letterSpacing={0.01}
        font="./fonts/Ubuntu/Ubuntu-Bold.ttf"
        fontSize={0.35}
        color={'#543d93'}
        anchorX="left"
        anchorY="middle">
        {`vinces.io`}
      </Text>
    </>
  )
}
export const Floor = () => {
  const crossNumber = 25
  const crossLineWidth = 0.05
  const crossHeight = 0.2

  return (
    <>
      <TextCustom />
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
