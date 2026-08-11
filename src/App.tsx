/* Hallmark · pre-emit critique: P5 H5 E4 S5 R4 V5
 * macrostructure: Workbench · genre: editorial-playful · theme: Studio
 * audience: recruiters, studios and agencies · use: visual selection + contact
 */
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const loadThree = () => import('three')

type Project = {
  number: string
  title: string
  year: string
  note: string
  className: string
}

const projects: Project[] = [
  { number: '01', title: 'Octalea', year: '2025', note: 'A digital space for returning to what matters.', className: 'project--octalea' },
  { number: '02', title: 'Dealium', year: '2025', note: 'An identity that moves with the conversation.', className: 'project--dealium' },
  { number: '03', title: 'Accra', year: '2024', note: 'Archive, memory and visual culture in layers.', className: 'project--accra' },
  { number: '04', title: 'Sueños de Colores', year: '2024', note: 'Small rituals for making larger days count.', className: 'project--suenos' },
  { number: '05', title: 'Floddets', year: '2023', note: 'A pause can be a decision, too.', className: 'project--floddets' },
]

function ProjectArtwork({ project }: Readonly<{ project: Project }>) {
  return (
    <div className={`artwork ${project.className}`} aria-hidden="true">
      <div className="artwork__label">fig. {project.number}</div>
      <div className="artwork__shape artwork__shape--one" />
      <div className="artwork__shape artwork__shape--two" />
      <div className="artwork__shape artwork__shape--three" />
      <span className="artwork__word">{project.title}</span>
      <span className="artwork__stamp">FIGMA / UI / 00{project.number}</span>
    </div>
  )
}

function TypeText({ text, className }: Readonly<{ text: string; className: string }>) {
  return <em className={className} aria-label={text}>{Array.from(text).map((character, index) => <span aria-hidden="true" key={`${character}-${index}`}>{character === ' ' ? '\u00a0' : character}</span>)}</em>
}

function App() {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    const updateLenis = (time: number) => lenis.raf(time * 1000)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nav = document.querySelector<HTMLElement>('.site-nav')
    const setNavScrolled = (scrolled: boolean) => nav?.classList.toggle('site-nav--scrolled', scrolled)
    const handleScroll = ({ scroll }: { scroll: number }) => setNavScrolled(scroll > 18)
    const handleNativeScroll = () => setNavScrolled(window.scrollY > 18)
    lenis.on('scroll', ScrollTrigger.update)
    lenis.on('scroll', handleScroll)
    window.addEventListener('scroll', handleNativeScroll, { passive: true })
    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)
    let disposeLoaderScene: (() => void) | undefined
    let disposeHeroOrbScene: (() => void) | undefined
    let loaderCancelled = false
    let loaderFinished = false
    const media = gsap.matchMedia()
    const context = gsap.context(() => {
      const loader = document.querySelector<HTMLElement>('.intro-loader')
      const canvasHost = document.querySelector<HTMLElement>('.intro-loader__canvas')
      const messages = gsap.utils.toArray<HTMLElement>('.intro-loader__message')
      const loaderProgress = { value: 0 }
      if (loader && canvasHost && !prefersReducedMotion) {
        void (async () => {
          try {
            const THREE = await loadThree()
            if (loaderCancelled || loaderFinished || !loader.isConnected) return
            const scene = new THREE.Scene()
            const camera = new THREE.OrthographicCamera(-2.2, 2.2, 2.2, -2.2, 0.1, 10)
            camera.position.z = 5
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            canvasHost.appendChild(renderer.domElement)
            const material = new THREE.MeshBasicMaterial({ color: '#eb5e28', transparent: true, opacity: 0.96 })
            const createPolygon = (sides: number) => {
              const shape = new THREE.Shape()
              for (let index = 0; index < sides; index += 1) {
                const angle = -Math.PI / 2 + (index / sides) * Math.PI * 2
                const x = Math.cos(angle) * 1.12
                const y = Math.sin(angle) * 1.12
                if (index === 0) shape.moveTo(x, y)
                else shape.lineTo(x, y)
              }
              shape.closePath()
              return new THREE.ShapeGeometry(shape, 2)
            }
            let polygonGeometry = createPolygon(3)
            const polygon = new THREE.Mesh(polygonGeometry, material)
            scene.add(polygon)
            let currentSides = 3
            const resize = () => renderer.setSize(canvasHost.clientWidth, canvasHost.clientHeight, false)
            resize()
            window.addEventListener('resize', resize)
            const timer = new THREE.Timer()
            timer.connect(document)
            renderer.setAnimationLoop(() => {
              timer.update()
              const elapsed = timer.getElapsed()
              const progress = loaderProgress.value
              const nextSides = Math.min(8, 3 + Math.floor(progress * 5))
              if (nextSides !== currentSides) {
                polygonGeometry.dispose()
                polygonGeometry = createPolygon(nextSides)
                polygon.geometry = polygonGeometry
                currentSides = nextSides
              }
              material.opacity = 0.88 + Math.sin(elapsed * 1.5) * 0.04
              polygon.rotation.z = progress * Math.PI * 10 + elapsed * 0.08
              polygon.scale.setScalar(1 + Math.sin(elapsed * 1.3) * 0.018)
              renderer.render(scene, camera)
            })
            disposeLoaderScene = () => {
              renderer.setAnimationLoop(null)
              window.removeEventListener('resize', resize)
              timer.dispose()
              material.dispose()
              polygonGeometry.dispose()
              renderer.dispose()
              renderer.domElement.remove()
            }
          } catch {
            return undefined
          }
        })()
      }
      const heroOrbHost = document.querySelector<HTMLElement>('.hero-orb__canvas')
      if (heroOrbHost && !prefersReducedMotion) {
        void (async () => {
          try {
            const THREE = await loadThree()
            if (loaderCancelled || !heroOrbHost.isConnected) return
            const scene = new THREE.Scene()
            const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 20)
            camera.position.z = 5.8
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            renderer.outputColorSpace = THREE.SRGBColorSpace
            renderer.toneMapping = THREE.ACESFilmicToneMapping
            renderer.toneMappingExposure = 1.08
            renderer.setClearColor(0x000000, 0)
            heroOrbHost.appendChild(renderer.domElement)
            const root = new THREE.Group()
            const scrollRig = new THREE.Group()
            root.add(scrollRig)
            scene.add(root)
            const createEnvironment = () => {
              const canvas = document.createElement('canvas')
              canvas.width = 1024
              canvas.height = 512
              const context2d = canvas.getContext('2d')
              if (!context2d) return null
              const gradient = context2d.createLinearGradient(0, 0, canvas.width, 0)
              gradient.addColorStop(0, '#403d39')
              gradient.addColorStop(0.18, '#fff8ee')
              gradient.addColorStop(0.34, '#ccc5b9')
              gradient.addColorStop(0.52, '#252422')
              gradient.addColorStop(0.7, '#eb5e28')
              gradient.addColorStop(0.84, '#fff5e8')
              gradient.addColorStop(1, '#403d39')
              context2d.fillStyle = gradient
              context2d.fillRect(0, 0, canvas.width, canvas.height)
              context2d.globalCompositeOperation = 'screen'
              context2d.globalAlpha = 0.32
              for (let index = 0; index < 8; index += 1) {
                const x = 80 + index * 128
                const band = context2d.createLinearGradient(x - 70, 0, x + 70, 0)
                band.addColorStop(0, 'rgba(255,252,242,0)')
                band.addColorStop(0.5, 'rgba(255,252,242,0.9)')
                band.addColorStop(1, 'rgba(255,252,242,0)')
                context2d.fillStyle = band
                context2d.fillRect(x - 70, 0, 140, canvas.height)
              }
              const sourceTexture = new THREE.CanvasTexture(canvas)
              sourceTexture.colorSpace = THREE.SRGBColorSpace
              sourceTexture.mapping = THREE.EquirectangularReflectionMapping
              const pmremGenerator = new THREE.PMREMGenerator(renderer)
              const environmentTarget = pmremGenerator.fromEquirectangular(sourceTexture)
              sourceTexture.dispose()
              pmremGenerator.dispose()
              return environmentTarget
            }
            const environmentTarget = createEnvironment()
            if (environmentTarget) scene.environment = environmentTarget.texture
            const createLightTexture = (variant: 'halo' | 'caustic') => {
            const canvas = document.createElement('canvas')
            canvas.width = 1024
            canvas.height = 1024
            const context2d = canvas.getContext('2d')
            if (!context2d) return null
            context2d.clearRect(0, 0, canvas.width, canvas.height)
            if (variant === 'halo') {
              const gradient = context2d.createRadialGradient(512, 512, 70, 512, 512, 500)
              gradient.addColorStop(0, 'rgba(255,252,242,0.95)')
              gradient.addColorStop(0.18, 'rgba(255,252,242,0.55)')
              gradient.addColorStop(0.44, 'rgba(255,252,242,0.18)')
              gradient.addColorStop(1, 'rgba(255,252,242,0)')
              context2d.fillStyle = gradient
              context2d.fillRect(0, 0, canvas.width, canvas.height)
            } else {
              context2d.globalCompositeOperation = 'screen'
              const strokes = [
                { x: 330, y: 400, width: 320, height: 160, angle: -0.42, alpha: 0.42 },
                { x: 560, y: 580, width: 360, height: 180, angle: 0.2, alpha: 0.28 },
                { x: 700, y: 350, width: 220, height: 120, angle: 0.56, alpha: 0.22 },
              ]
              strokes.forEach(({ x, y, width, height, angle, alpha }) => {
                context2d.save()
                context2d.translate(x, y)
                context2d.rotate(angle)
                context2d.scale(width / 2, height / 2)
                const gradient = context2d.createRadialGradient(0, 0, 0.12, 0, 0, 1)
                gradient.addColorStop(0, `rgba(255,252,242,${alpha})`)
                gradient.addColorStop(0.62, `rgba(255,252,242,${alpha * 0.5})`)
                gradient.addColorStop(1, 'rgba(255,252,242,0)')
                context2d.fillStyle = gradient
                context2d.beginPath()
                context2d.ellipse(0, 0, 1, 0.58, 0, 0, Math.PI * 2)
                context2d.fill()
                context2d.restore()
              })
            }
            const texture = new THREE.CanvasTexture(canvas)
            texture.colorSpace = THREE.SRGBColorSpace
            texture.needsUpdate = true
            return texture
          }
            const haloTexture = createLightTexture('halo')
            const causticTexture = createLightTexture('caustic')
            const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: '#fffcf2',
            metalness: 0,
            roughness: 0.024,
            transmission: 0.98,
            thickness: 1.45,
            ior: 1.42,
            clearcoat: 1,
            clearcoatRoughness: 0.02,
            attenuationDistance: 2.8,
            attenuationColor: '#fff4eb',
            reflectivity: 0.72,
            transparent: true,
            envMapIntensity: 2.2,
            opacity: 0.56,
            depthWrite: false,
          })
            const innerShellMaterial = new THREE.MeshPhysicalMaterial({
            color: '#ffffff',
            roughness: 0.14,
            transmission: 0.92,
            thickness: 0.85,
            ior: 1.24,
            clearcoat: 0.72,
            transparent: true,
            opacity: 0.12,
            side: THREE.BackSide,
            depthWrite: false,
          })
            const veilMaterial = new THREE.MeshBasicMaterial({ color: '#fffcf2', transparent: true, opacity: 0.06, depthWrite: false })
            const mistMaterial = new THREE.MeshStandardMaterial({ color: '#fff8f0', roughness: 0.56, metalness: 0, transparent: true, opacity: 0.08, depthWrite: false })
            const mistSecondaryMaterial = mistMaterial.clone()
            mistSecondaryMaterial.opacity = 0.055
            const highlightMaterial = new THREE.MeshBasicMaterial({ color: '#fffcf2', transparent: true, opacity: 0.54, depthWrite: false })
            const causticMaterial = new THREE.SpriteMaterial({
            map: causticTexture ?? undefined,
            color: '#fffcf2',
            transparent: true,
            opacity: 0.34,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
            const causticRearMaterial = causticMaterial.clone()
            causticRearMaterial.opacity = 0.2
            const haloMaterial = new THREE.SpriteMaterial({
            map: haloTexture ?? undefined,
            color: '#fffcf2',
            transparent: true,
            opacity: 0.18,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
            const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.36, 86, 86), glassMaterial)
            const innerShell = new THREE.Mesh(new THREE.SphereGeometry(1.24, 72, 72), innerShellMaterial)
            const innerVeil = new THREE.Mesh(new THREE.SphereGeometry(1.02, 52, 52), veilMaterial)
            const mistOne = new THREE.Mesh(new THREE.IcosahedronGeometry(0.72, 5), mistMaterial)
            const mistTwo = new THREE.Mesh(new THREE.IcosahedronGeometry(0.48, 4), mistSecondaryMaterial)
            mistTwo.position.set(0.34, -0.12, 0.16)
            const highlightArc = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.022, 12, 124), highlightMaterial)
            highlightArc.position.set(-0.38, 0.48, 0.96)
            highlightArc.scale.y = 0.28
            highlightArc.rotation.set(Math.PI * 0.18, Math.PI * 0.05, -Math.PI * 0.11)
            const glint = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 24), highlightMaterial.clone())
            glint.position.set(-0.56, 0.64, 1.02)
            glint.material.opacity = 0.76
            const halo = new THREE.Sprite(haloMaterial)
            halo.scale.set(4.2, 4.2, 1)
            halo.position.set(0.08, 0.02, -0.44)
            const causticFront = new THREE.Sprite(causticMaterial)
            causticFront.scale.set(2.25, 1.5, 1)
            causticFront.position.set(0.04, -0.14, 0.98)
            const causticRear = new THREE.Sprite(causticRearMaterial)
            causticRear.scale.set(2.55, 1.85, 1)
            causticRear.position.set(0.3, 0.22, -0.18)
            const createLightRibbon = (points: Array<{ x: number; y: number; z: number }>, opacity: number) => {
              const curve = new THREE.CatmullRomCurve3(points.map(({ x, y, z }) => new THREE.Vector3(x, y, z)), false, 'centripetal', 0.35)
              const geometry = new THREE.TubeGeometry(curve, 96, 0.018, 8, false)
              const material = new THREE.MeshBasicMaterial({ color: '#fffcf2', transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })
              return { mesh: new THREE.Mesh(geometry, material), geometry, material }
            }
            const lightRibbonOne = createLightRibbon([
              { x: -0.92, y: 0.16, z: 0.32 }, { x: -0.5, y: 0.55, z: 0.58 },
              { x: 0, y: 0.25, z: 0.74 }, { x: 0.48, y: 0.54, z: 0.42 }, { x: 0.88, y: 0.2, z: 0.54 },
            ], 0.52)
            const lightRibbonTwo = createLightRibbon([
              { x: -0.8, y: -0.32, z: 0.28 }, { x: -0.3, y: -0.62, z: 0.46 },
              { x: 0.18, y: -0.34, z: 0.68 }, { x: 0.6, y: -0.52, z: 0.3 }, { x: 0.86, y: -0.14, z: 0.42 },
            ], 0.36)
            lightRibbonOne.mesh.rotation.set(0.18, -0.14, -0.1)
            lightRibbonTwo.mesh.rotation.set(-0.22, 0.12, 0.18)
            scrollRig.add(halo, causticRear, sphere, innerShell, innerVeil, mistOne, mistTwo, causticFront, lightRibbonOne.mesh, lightRibbonTwo.mesh, highlightArc, glint)
            scene.add(new THREE.AmbientLight('#fffcf2', 1.5))
            scene.add(new THREE.HemisphereLight('#fffcf2', '#403d39', 2.2))
            const keyLight = new THREE.DirectionalLight('#ffffff', 3.8)
            keyLight.position.set(2.6, 3.1, 4.8)
            scene.add(keyLight)
            const fillLight = new THREE.PointLight('#fff2dc', 3.2, 10, 2)
            fillLight.position.set(-1.7, 1.9, 2.1)
            scene.add(fillLight)
            const rimLight = new THREE.DirectionalLight('#ccc5b9', 1.6)
            rimLight.position.set(-3.4, -1.3, 2.4)
            scene.add(rimLight)
            const warmCausticLight = new THREE.PointLight('#eb5e28', 0.8, 6, 2.1)
            warmCausticLight.position.set(1.2, -0.9, 2.6)
            scene.add(warmCausticLight)
            const resize = () => {
            const width = heroOrbHost.clientWidth
            const height = heroOrbHost.clientHeight
            if (!width || !height) return
            camera.aspect = width / height
            camera.updateProjectionMatrix()
            renderer.setSize(width, height, false)
            }
            const observer = new ResizeObserver(resize)
            observer.observe(heroOrbHost)
            resize()
            const timer = new THREE.Timer()
            timer.connect(document)
            renderer.setAnimationLoop(() => {
              timer.update()
              const elapsed = timer.getElapsed()
              mistOne.rotation.set(elapsed * 0.08, elapsed * 0.12, elapsed * 0.05)
              mistTwo.rotation.set(-elapsed * 0.09, elapsed * 0.07, -elapsed * 0.08)
              causticFront.position.x = 0.04 + Math.sin(elapsed * 0.85) * 0.06
              causticFront.position.y = -0.14 + Math.cos(elapsed * 0.72) * 0.035
              causticFront.material.rotation = Math.sin(elapsed * 0.36) * 0.2
              causticRear.position.x = 0.3 + Math.cos(elapsed * 0.58) * 0.08
              causticRear.position.y = 0.22 + Math.sin(elapsed * 0.44) * 0.05
              causticRear.material.rotation = -0.14 + Math.cos(elapsed * 0.3) * 0.22
              lightRibbonOne.mesh.rotation.z = -0.1 + Math.sin(elapsed * 0.36) * 0.08
              lightRibbonTwo.mesh.rotation.z = 0.18 + Math.cos(elapsed * 0.28) * 0.1
              halo.material.opacity = 0.15 + Math.sin(elapsed * 0.75) * 0.03
              highlightArc.rotation.z = -Math.PI * 0.11 + Math.sin(elapsed * 0.7) * 0.04
              glint.scale.setScalar(1 + Math.sin(elapsed * 1.2) * 0.08)
              renderer.render(scene, camera)
            })
            gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } })
              .to(scrollRig.rotation, { y: Math.PI * 1.75, x: Math.PI * 0.26, ease: 'none' }, 0)
              .to(root.rotation, { z: -Math.PI * 0.18, ease: 'none' }, 0)
              .to(scrollRig.position, { x: -0.08, y: -0.16, ease: 'none' }, 0)
            disposeHeroOrbScene = () => {
              renderer.setAnimationLoop(null)
              observer.disconnect()
              timer.dispose()
              ;[sphere, innerShell, innerVeil, mistOne, mistTwo, lightRibbonOne.mesh, lightRibbonTwo.mesh, highlightArc, glint].forEach((mesh) => mesh.geometry.dispose())
              ;[glassMaterial, innerShellMaterial, veilMaterial, mistMaterial, mistSecondaryMaterial, highlightMaterial, glint.material, haloMaterial, causticMaterial, causticRearMaterial].forEach((material) => material.dispose())
              lightRibbonOne.material.dispose()
              lightRibbonTwo.material.dispose()
              haloTexture?.dispose()
              causticTexture?.dispose()
              environmentTarget?.dispose()
              renderer.dispose()
              renderer.domElement.remove()
            }
          } catch {
            return undefined
          }
        })()
      }
      if (loader && !prefersReducedMotion) {
        const loaderTimeline = gsap.timeline({ onComplete: () => loader.setAttribute('aria-hidden', 'true') })
        messages.forEach((message, index) => {
          loaderTimeline
            .fromTo(message, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.38, ease: 'power3.out' }, index === 0 ? 0.15 : '+=0.18')
            .to(message, { autoAlpha: 0, y: -10, duration: 0.28, ease: 'power2.in' }, '+=0.58')
            .to(loaderProgress, { value: (index + 1) / messages.length, duration: 0.65, ease: 'power2.inOut' }, '<-0.12')
        })
        loaderTimeline.to(loader, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '+=0.08').call(() => { loaderFinished = true; disposeLoaderScene?.() })
      } else if (loader) gsap.set(loader, { autoAlpha: 0 })
      gsap.from('.site-nav, .hero__eyebrow, .hero__aside, .hero__scroll', {
        y: 28, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out',
      })
      gsap.fromTo('.hero__title-line', { yPercent: 110, opacity: 0, filter: 'blur(14px)' }, {
        yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.hero h1', start: 'top 58%', end: 'bottom 44%', toggleActions: 'play reverse play reverse' },
      })
      gsap.utils.toArray<HTMLElement>('.project-card').forEach((card, index) => {
        gsap.fromTo(card, { y: 42, opacity: 0, filter: 'blur(12px)' }, {
          y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.85, delay: index * 0.05, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 58%', end: 'bottom 42%', toggleActions: 'play reverse play reverse' },
        })
      })
      gsap.fromTo('.timeline__progress', { scaleY: 0 }, { scaleY: 1, transformOrigin: 'top center', ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 64%', end: 'bottom 54%', scrub: 0.8 } })
      gsap.utils.toArray<HTMLElement>('.timeline__dot').forEach((dot) => {
        gsap.timeline({ scrollTrigger: { trigger: dot, start: 'top 56%', end: 'bottom 44%', toggleActions: 'play reverse play reverse' } })
          .fromTo(dot, { scale: 0, opacity: 0, rotation: -70 }, { scale: 1.35, opacity: 1, rotation: 12, duration: 0.36, ease: 'power4.out' })
          .to(dot, { scale: 0.86, rotation: -5, duration: 0.28, ease: 'power2.inOut' })
          .to(dot, { scale: 1, rotation: 0, duration: 0.58, ease: 'elastic.out(1, 0.45)' })
      })
      const aboutName = document.querySelector<HTMLElement>('.about-title__name')
      if (aboutName) {
        gsap.to(aboutName, {
          color: 'rgba(37, 36, 34, 0)',
          webkitTextStrokeWidth: '1px',
          webkitTextStrokeColor: '#252422',
          ease: 'none',
          scrollTrigger: {
            trigger: '.about-section',
            start: 'top 68%',
            end: 'top 30%',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })
      }
      media.add('(min-width: 701px)', () => {
        const navActions = document.querySelector<HTMLElement>('.site-nav__actions')
        if (nav && navActions) {
          const getNavShift = () => {
            const navBounds = nav.getBoundingClientRect()
            const actionsBounds = navActions.getBoundingClientRect()
            const navCenter = navBounds.left + navBounds.width / 2
            const actionsCenter = actionsBounds.left + actionsBounds.width / 2
            return navCenter - actionsCenter
          }
          gsap.timeline({
            scrollTrigger: {
              trigger: '.hero',
              start: 'top top',
              end: '+=180',
              scrub: 0.9,
              invalidateOnRefresh: true,
            },
          })
            .to(nav, { '--nav-progress': 1, ease: 'none' }, 0)
            .to('.site-nav__brand', { autoAlpha: 0, x: -34, y: -4, ease: 'none' }, 0)
            .to('.site-nav__meta', { autoAlpha: 0, x: -22, ease: 'none' }, 0)
            .to(navActions, { x: () => getNavShift(), ease: 'none' }, 0)
        }
      })
      const arrowGraphic = document.querySelector<HTMLElement>('.about-orbit__graphic')
      const arrowPath = document.querySelector<SVGPathElement>('.about-arrow__path')
      const arrowHead = document.querySelector<SVGPathElement>('.about-arrow__head')
      if (arrowGraphic && arrowPath && arrowHead) {
        gsap.set(arrowPath, { strokeDashoffset: 1 })
        gsap.set(arrowHead, { autoAlpha: 0, scale: 0.25, transformOrigin: 'center center' })
        gsap.timeline({
          scrollTrigger: {
            trigger: '.about-section',
            start: 'top 72%',
            end: 'bottom 24%',
            scrub: 1.05,
            invalidateOnRefresh: true,
          },
        })
          .to(arrowPath, { strokeDashoffset: 0, ease: 'none' }, 0)
          .to(arrowGraphic, { xPercent: -8, yPercent: 5, rotation: -5, ease: 'none' }, 0)
          .to(arrowHead, { autoAlpha: 1, scale: 1, ease: 'power2.out' }, 0.76)
      }
      gsap.to('.contact-star', { rotation: 360, ease: 'none', scrollTrigger: { trigger: '.contact-section', start: 'top bottom', end: 'bottom top', scrub: 2 } })
      gsap.fromTo('.contact-section', {
        '--contact-extra-height': '0svh', '--contact-offset': '0px', '--contact-top-extra': '0px', '--contact-flow-extra': '0px',
      }, {
        '--contact-extra-height': '28svh', '--contact-offset': '-82px', '--contact-top-extra': '82px', '--contact-flow-extra': '82px',
        ease: 'none', scrollTrigger: { trigger: '.contact-section', start: 'top 85%', end: 'top 10%', scrub: 1, invalidateOnRefresh: true },
      })
      gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.contact-section', start: 'top 20%', end: 'top -5%', scrub: 0.45, invalidateOnRefresh: true } })
        .to('.contact-morph__current span', { opacity: 0, duration: 0.48, stagger: { each: 0.035, from: 'end' } })
        .to('.contact-morph__next span', { opacity: 1, duration: 0.48, stagger: 0.05 })
    }, pageRef)

    const cursor = document.querySelector<HTMLElement>('.cursor')
    const cursorCore = cursor?.querySelector<HTMLElement>('span')
    const cursorOrbit = cursor?.querySelector<HTMLElement>('b')
    const cursorTrails = gsap.utils.toArray<HTMLElement>('.cursor-trail')
    const contactSection = document.querySelector<HTMLElement>('.contact-section')
    const contactTitle = document.querySelector<HTMLElement>('.contact-title-wrap')
    const hasPointer = window.matchMedia('(pointer: fine)').matches
    let onMove: ((event: PointerEvent) => void) | undefined
    let onOver: ((event: PointerEvent) => void) | undefined
    let onContactLeave: (() => void) | undefined
    let onWindowLeave: (() => void) | undefined
    let interactive = false

    if (cursor && cursorCore && cursorOrbit && hasPointer && !prefersReducedMotion) {
      const moveX = gsap.quickTo(cursor, 'x', { duration: 0.24, ease: 'power3.out' })
      const moveY = gsap.quickTo(cursor, 'y', { duration: 0.24, ease: 'power3.out' })
      const setInteractive = (next: boolean) => {
        if (next === interactive) return
        interactive = next
        cursor.classList.toggle('cursor--interactive', next)
        gsap.to(cursorCore, { scale: next ? 1.16 : 1, duration: 0.32, ease: 'power2.inOut', overwrite: true })
        gsap.to(cursorOrbit, { rotation: next ? 360 : 0, duration: 0.7, ease: 'power2.inOut', overwrite: true })
      }
      onMove = (event: PointerEvent) => {
        moveX(event.clientX)
        moveY(event.clientY)
        cursorTrails.forEach((trail, index) => {
          gsap.to(trail, {
            x: event.clientX,
            y: event.clientY,
            duration: 0.22 + index * 0.045,
            ease: 'power3.out',
            overwrite: 'auto',
          })
        })
        setInteractive(Boolean((event.target as Element).closest('a, button')))
        if (contactSection && contactTitle) {
          const bounds = contactSection.getBoundingClientRect()
          const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom
          if (inside) {
            const titleBounds = contactTitle.getBoundingClientRect()
            contactTitle.style.setProperty('--cursor-x', `${event.clientX - titleBounds.left}px`)
            contactTitle.style.setProperty('--cursor-y', `${event.clientY - titleBounds.top}px`)
            contactTitle.classList.add('contact-title-wrap--active')
          } else contactTitle.classList.remove('contact-title-wrap--active')
        }
      }
      onOver = (event: PointerEvent) => {
        setInteractive(Boolean((event.target as Element).closest('a, button')))
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerover', onOver)
      onWindowLeave = () => setInteractive(false)
      window.addEventListener('pointerleave', onWindowLeave)
      onContactLeave = () => contactTitle?.classList.remove('contact-title-wrap--active')
      contactSection?.addEventListener('pointerleave', onContactLeave)
    }

    return () => {
      gsap.ticker.remove(updateLenis)
      lenis.off('scroll', ScrollTrigger.update)
      lenis.off('scroll', handleScroll)
      window.removeEventListener('scroll', handleNativeScroll)
      lenis.destroy()
      context.revert()
      media.revert()
      loaderCancelled = true
      disposeLoaderScene?.()
      disposeHeroOrbScene?.()
      if (onMove) window.removeEventListener('pointermove', onMove)
      if (onOver) window.removeEventListener('pointerover', onOver)
      if (onWindowLeave) window.removeEventListener('pointerleave', onWindowLeave)
      if (onContactLeave) contactSection?.removeEventListener('pointerleave', onContactLeave)
    }
  }, [])

  return (
    <div className="site-shell" ref={pageRef}>
      <div className="intro-loader" aria-hidden="false"><div className="intro-loader__inner"><div className="intro-loader__messages"><p className="intro-loader__message">Getting the design in shape</p><p className="intro-loader__message">Loading the images</p><p className="intro-loader__message">Updating the experience</p></div><div className="intro-loader__canvas" aria-hidden="true" /><span className="intro-loader__count">Pelayo Trives — Product Engineer</span></div></div>
      <div className="cursor-trails" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <span className="cursor-trail" key={index} />)}</div>
      <div className="cursor" aria-hidden="true"><span /><b>✳</b></div>
      <header className="site-nav">
        <div className="site-nav__brand"><a className="wordmark" href="#top" aria-label="Pelayo Trives, back to top">PT<span>.</span></a></div>
        <div className="site-nav__meta"><p className="nav-note">Product engineer<br />based in Kyoto</p></div>
        <nav className="site-nav__actions" aria-label="Main navigation">
          <a href="#work">Selected work</a>
          <a href="#about">About</a>
          <a className="nav-contact" href="mailto:hello@pelayotrives.com">Let's talk <span>↗</span></a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__eyebrow"><span className="dot" /> Portfolio / 2026</div>
          <h1 id="hero-title"><span className="hero__title-line">Interfaces with</span><span className="hero__title-line"><em>something</em> to say.</span></h1>
          <p className="hero__aside">I turn complex ideas into clear, tactile digital experiences — with a soft spot for the strange bits.</p>
          <a className="hero__scroll" href="#work"><span>Scroll to explore</span><span className="arrow">↓</span></a>
          <div className="hero-orb" aria-hidden="true"><div className="hero-orb__canvas" /></div>
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <div className="section-head">
            <div><span className="section-index">01</span><h2 id="work-title">A few things<br />I’ve made.</h2></div>
            <p>Five case studies in product thinking, visual systems and the joy of a well-placed detail.</p>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => (
              <article className={`project-card project-card--${index + 1}`} key={project.number}>
                <a href={`#project-${project.number}`} className="project-card__link" aria-label={`View ${project.title} case study`}>
                  <ProjectArtwork project={project} />
                  <div className="project-card__meta"><span>{project.number} / Selected work</span><span>{project.year} <b>↗</b></span></div>
                  <h3>{project.title}</h3><p>{project.note}</p>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <div className="section-index">02</div>
          <div className="about-copy"><h2 id="about-title">Hi, I’m <span className="about-title__name">Pelayo</span> Trives<span>.</span></h2><p className="about-lede">A UI designer interested in the space between a good idea and the moment it clicks.</p><p>I work in Figma from the first slightly-too-rough sketch to the final tiny transition. I like systems that leave room for personality, and interfaces that reward a second look.</p><div className="timeline" aria-label="Education and experience timeline"><div className="timeline__track" /><div className="timeline__progress" /><div className="timeline__item"><span className="timeline__date">2023—Now</span><span className="timeline__dot" aria-hidden="true" /><div><h3>Culpass</h3><p>Full Stack Developer &amp; Technical Project Manager.</p></div></div><div className="timeline__item"><span className="timeline__date">2024—2026</span><span className="timeline__dot" aria-hidden="true" /><div><h3>VIU · Universidad Internacional de Valencia</h3><p>Master’s degree in Artificial Intelligence, Machine Learning and Computational Optimization.</p></div></div><div className="timeline__item"><span className="timeline__date">2023—2025</span><span className="timeline__dot" aria-hidden="true" /><div><h3>Luce Innovative Technologies</h3><p>Full Stack Developer.</p></div></div><div className="timeline__item"><span className="timeline__date">2023—2024</span><span className="timeline__dot" aria-hidden="true" /><div><h3>Kapturall</h3><p>Front-End Developer &amp; UX/UI Design Lead.</p></div></div><div className="timeline__item"><span className="timeline__date">2023</span><span className="timeline__dot" aria-hidden="true" /><div><h3>Vocento.Medios</h3><p>Front-End Developer for editorial and online publishing experiences.</p></div></div><div className="timeline__item"><span className="timeline__date">2018—2022</span><span className="timeline__dot" aria-hidden="true" /><div><h3>VIU · Universitat Oberta de Catalunya</h3><p>University degree in Multimedia.</p></div></div></div><a className="text-link" href="https://www.linkedin.com/in/pelayo-trives-pozuelo/">More about me <span>↗</span></a></div>
          <div className="about-orbit" aria-hidden="true"><div className="about-orbit__graphic"><svg className="about-arrow" viewBox="0 0 280 220" role="presentation"><path className="about-arrow__path" pathLength="1" d="M 30 165 C 8 72 74 18 142 52 C 205 84 220 164 163 180 C 104 197 63 135 104 91 C 141 53 214 68 248 36" /><path className="about-arrow__head" d="M 248 36 L 229 35 M 248 36 L 242 54" /></svg></div><small>follow<br />the thread</small></div>
        </section>

        <section className="contact-section" aria-labelledby="contact-title"><div className="contact-star" aria-hidden="true">✳</div><p className="contact-kicker">Have a good project?</p><div className="contact-title-wrap"><h2 id="contact-title">Let’s make<br /><span className="contact-morph"><TypeText className="contact-morph__current" text="the right thing." /><TypeText className="contact-morph__next" text="the best." /></span></h2><h2 className="contact-title-glow" aria-hidden="true">Let’s make<br /><span className="contact-morph"><TypeText className="contact-morph__current" text="the right thing." /><TypeText className="contact-morph__next" text="the best." /></span></h2></div><a className="contact-button" href="https://www.linkedin.com/in/pelayotrives-pozuelo/">Start a conversation <span>↗</span></a></section>
      </main>
      <footer><span>© 2026 Pelayo Trives</span><span>Proudly designed by Pelayo Trives.</span><a href="#top">Back to top ↑</a></footer>
    </div>
  )
}

export default App
