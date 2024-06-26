import { useControls } from 'leva'
import { useThree } from '@react-three/fiber'
import { Perf } from 'r3f-perf'

export default function Monitoring() {
  const { visible, minimal } = useControls(
    'Canvas.Perf',
    {
      visible: false,
      minimal: true
    },
    { collapsed: true }
  )
  const { width } = useThree((s) => s.size)

  return (
    <>
      {visible && (
        <Perf
          className={'r3f-perf-custom'}
          minimal={width < 920 || minimal}
          logsPerSecond="10"
          showGraph={false}
          matrixUpdate={true}
          antialias={true}
          position="top-right"
          style={{ top: '10px', right: '300px' }}
        />
      )}
    </>
  )
}
