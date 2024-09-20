import { useRef } from 'react'
import { Link, Route, Router } from 'wouter'
import About from './pages/About'
import Home from './pages/Home'
import Base from './pages/Base'
import Glass from './pages/Glass.jsx'
import Hockey from './pages/Hockey.jsx'
import Wiggle from './pages/Wiggle.jsx'
import Shading from './pages/Shading.jsx'

const Navigation = () => {
  // const [isActive] = useRoute(props.href);
  return (
    <>
      <nav className="navigation">
        <Link href={'/r3f-logos/base'} className={(active) => (active ? 'active' : '')}>
          Base
        </Link>
        <Link href={'/r3f-logos/hockey'} className={(active) => (active ? 'active' : '')}>
          Hockey
        </Link>
        <Link href={'/r3f-logos/glass'} className={(active) => (active ? 'active' : '')}>
          Glass
        </Link>
        <Link href={'/r3f-logos/wiggle'} className={(active) => (active ? 'active' : '')}>
          Wiggle
        </Link>
        <Link href={'/r3f-logos/shading'} className={(active) => (active ? 'active' : '')}>
          Shading
        </Link>
        <Link href={'/r3f-logos/about'} className={(active) => (active ? 'active' : '')}>
          About
        </Link>
      </nav>
    </>
  )
}

const Header = () => {
  return (
    <header className="header">
      <Link href={'/r3f-logos/'} className={'logo'} title={'R3f Vinces'}>
        <svg width="200" height="220" viewBox="0 0 200 220" fill="black" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M77.1373 34.0754C71.1727 18.8447 53.0522 10.9916 36.6642 16.5352C20.2763 22.0787 11.8267 38.9196 17.7914 54.1504L57.9497 156.694L91.5536 70.887L77.1373 34.0754ZM100 49.3191L92.0541 29.0295C83.0909 6.14203 55.8611 -5.6587 31.235 2.67162C6.60875 11.002 -6.08863 36.3089 2.87458 59.1963L54.4802 190.97C61.6048 209.163 80.2708 220.351 99.9965 219.991C119.725 220.354 138.394 209.165 145.52 190.97L197.125 59.1964C206.089 36.309 193.391 11.002 168.765 2.67165C144.139 -5.65869 116.909 6.14215 107.946 29.0295L100 49.3191ZM100 92.4548L71.257 165.85C65.2924 181.08 73.7421 197.921 90.1301 203.465C93.3872 204.567 96.7129 205.139 99.9979 205.23C103.284 205.14 106.611 204.567 109.87 203.465C126.258 197.921 134.708 181.08 128.743 165.849L100 92.4548ZM142.05 156.694L108.446 70.887L122.863 34.0755C128.827 18.8447 146.948 10.9917 163.336 16.5352C179.724 22.0788 188.173 38.9198 182.209 54.1505L142.05 156.694Z"
          />
        </svg>
      </Link>
      <Navigation />
    </header>
  )
}

const Footer = () => {
  return (
    <footer className="footer">
      <a href="https://vinces.io" target="_blank" rel="noreferrer" title="Site Vinces.io">
        @vinces.io
      </a>
      <span> 〢 </span>
      <a href="https://github.com/Sp0ne" target="_blank" rel="noreferrer" title="Github Vinces">
        @Sp0ne
      </a>
      <span> 〢 2024</span>
    </footer>
  )
}
const Application = () => {
  const mainRef = useRef()
  return (
    <>
      <main ref={mainRef}>
        <Header />
        <Router base="/r3f-logos">
          <section className={'container'}>
            <Route path="/" component={Home} />
            <Route path="/hockey" component={Hockey} />
            <Route path="/glass" component={Glass} />
            <Route path="/wiggle" component={Wiggle} />
            <Route path="/shading" component={Shading} />
            <Route path="/base" component={Base} />
            <Route path="/about" component={About} />
          </section>
        </Router>
        <Footer />
      </main>
    </>
  )
}

export default Application
