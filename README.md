# r3f-logos

_Simple Three.js Experience with R3F and logos._

🧪 **v0.1.0** **〢** 🔗 [Live Demo](https://sp0ne.github.io/r3f-logos/)

---

![Screen Starter](public/screenshots/r3f-logos.png)

---

## 💾 Installation

👇 Install the following packages

```shell
yarn
```

## 🥑 Usage 〢 Get Started

👇 Start or Build the application

```shell
yarn start
# Or
yarn preview
```

👉 Go to [http://localhost:3000/r3f-logos/](http://localhost:3000/r3f-logos/)

## 💾 Code Clean

```shell
yarn lint        # Run linter global
yarn format      # Run prettier format
```

## 🚀 Deploy on Gh-pages

```shell
yarn build && yarn deploy
# yarn deploy -- -m "Deploy to GitHub Pages"
```

### ⚙️ Config vite ⚡

Change config in `vite.config.vue` if you want:

```javascript
export default defineConfig({
  base: '/r3f-logos/', // Adapt it ! (just for GH-PAGES)
  server: {
    port: 3000 // Default 3000: Adapt it !
  }
  // ...stuff...
})
```

Reminder 📦:

```bash
# update dependencies. need existing yarn.lock file
yarn upgrade-interactive
```

---

## 💾 Ecosystem

- Node.js [**v18.0 min**](https://nodejs.org/en/) 📦
- Three.js [**v0.145.0**](https://github.com/mrdoob/three.js/) 📦
- Powered with [Vite](https://vite.dev/) 📦
- [vite-plugin-glsl](https://github.com/UstymUkhman/vite-plugin-glsl) Simple Shaders support (glsl) 🎨
- [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) React renderer for threejs
- [@react-three/drei](https://github.com/pmndrs/drei) useful helpers for react-three-fiber
- [react-spring](https://github.com/pmndrs/react-spring) a spring-physics-based animation library
- [leva`](https://github.com/pmndrs/leva) create GUI controls in seconds

---

> 👋🏻: Have Fun 🍻
> 🦝 [vinces.io][vinces] **〢** 🐙 [@Sp0ne][vinces-git]

---

[vinces]: https://vinces.io
[vinces-git]: https://github.com/Sp0ne
