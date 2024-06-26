import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { PillsIcon } from '@/components/icons/pills.jsx'
import { SoundOnIcon } from '@/components/icons/sounds.jsx'
import { GamepadIcon } from '@/components/icons/gamepad.jsx'
import { BoxIcon } from '@/components/icons/box.jsx'
import { PackageCheckIcon, PackageIcon } from '@/components/icons/package.jsx'
import useGame from '../stores/useGame'
import '../assets/scss/style.scss'

export default function Loader(/*{ delay = 2000 }*/) {
  const { active, progress, item, loaded, total } = useProgress()
  const [status, setStatus, start] = useGame((state) => [state.status, state.setStatus, state.start])

  useEffect(() => {
    if (progress === 100 && status === 'loading') {
      setStatus('ready')
    }
  }, [progress, status, setStatus])

  const [fadeLoader, setFadeLoader] = useState(false)

  const onStartClick = () => {
    setFadeLoader(true)
    setTimeout(() => {
      start()
    }, 300)
  }

  return (
    (status === 'loading' || status === 'ready') && (
      <section className={`loader ${fadeLoader ? 'loader-fade' : ''}`}>
        <div className="loader-wrapper">
          <div className="loader--capsule"></div>
          <div className="loader--actions">
            <button className="loader--actions--button" onClick={onStartClick} disabled={status === 'loading'}>
              <PillsIcon /> {status}
            </button>
            <div className="loader--actions--states">
              <p>
                <SoundOnIcon color={'#666666'} />
                <span>Sound</span>
                <strong>On</strong>
              </p>
              <p>
                <GamepadIcon color={'#666666'} />
                <strong>Key</strong>
                <span>Control</span>
              </p>
            </div>
          </div>
        </div>
        <div className="loader-progress">
          <p className="small">
            {active ? 'Loading' : 'Loaded'} {loaded} / {total} items
            <BoxIcon color={'#666666'} />
          </p>
          <p className="small">
            {active ? 'Loading' : 'Loaded'} {item}
            <BoxIcon color={'#666666'} />
          </p>
          <p className="small">
            Status: {status}
            {status === 'loading' ? <PackageIcon color={'#666666'} /> : <PackageCheckIcon color={'#666666'} />}
          </p>
          <p className="progress">
            {Math.floor(progress)}
            {/*<small>%</small>*/}
          </p>
        </div>
      </section>
    )
  )
}
