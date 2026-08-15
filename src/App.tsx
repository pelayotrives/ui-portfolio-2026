/* Hallmark · pre-emit critique: P5 H5 E4 S5 R4 V5
 * macrostructure: Workbench · genre: editorial-playful · theme: Studio
 * audience: recruiters, studios and agencies · use: visual selection + contact
 */
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUp, ArrowUpRight, Asterisk } from 'lucide-react'
import Lenis from 'lenis'
import { Skeleton, configureBoneyard } from 'boneyard-js/react'
import './App.css'

gsap.registerPlugin(ScrollTrigger)
configureBoneyard({
  color: 'rgba(204, 197, 185, .46)',
  darkColor: 'rgba(255, 252, 242, .12)',
  animate: 'shimmer',
  shimmerColor: 'rgba(255, 252, 242, .72)',
  speed: '2.4s',
})

const loadThree = () => import('./three-runtime').then(({ THREE }) => THREE)

type Project = {
  number: string
  title: string
  year: string
  note: string
  className: string
  figmaUrl: string
  pdf: string
  image: string
}

type Extension = {
  title: string
  note: string
  image: string
  href: string
  categories: Array<'Design' | 'Utility' | 'MGMT' | 'Creativity'>
}

const projects: Project[] = [
  { number: '01', title: 'Octalea', year: '2026', note: 'A static studio site for AI development and automation.', className: 'project--octalea', figmaUrl: 'https://embed.figma.com/design/iDm8FZQwxA4wafq1K41uID/Portfolio?node-id=1-5&embed-host=share', pdf: 'projects/pdf/octalea.pdf', image: 'projects/octalea_image.webp' },
  { number: '02', title: 'Dealium', year: '2026', note: 'A tailored business consultancy for sharper decisions.', className: 'project--dealium', figmaUrl: 'https://embed.figma.com/design/iDm8FZQwxA4wafq1K41uID/Portfolio?node-id=1-1341&embed-host=share', pdf: 'projects/pdf/dealium.pdf', image: 'projects/dealium_image.webp' },
  { number: '03', title: 'Accra', year: '2025', note: 'A natural-products shop built for mindful browsing.', className: 'project--accra', figmaUrl: 'https://embed.figma.com/design/iDm8FZQwxA4wafq1K41uID/Portfolio?node-id=1-1959&embed-host=share', pdf: 'projects/pdf/accra.pdf', image: 'projects/accra_image.webp' },
  { number: '04', title: 'Sueños de Colores', year: '2025', note: 'A warm digital home for an early-years nursery.', className: 'project--suenos', figmaUrl: 'https://embed.figma.com/design/iDm8FZQwxA4wafq1K41uID/Portfolio?node-id=39-2&embed-host=share', pdf: 'projects/pdf/suenos_de_colores.pdf', image: 'projects/suenos_de_colores_image.webp' },
  { number: '05', title: 'Floddets', year: '2025', note: 'A handmade eyewear atelier for glasses and sunglasses.', className: 'project--floddets', figmaUrl: 'https://embed.figma.com/design/iDm8FZQwxA4wafq1K41uID/Portfolio?node-id=266-86&embed-host=share', pdf: 'projects/pdf/floddets.pdf', image: 'projects/floddets_image.webp' },
]

const extensions: Extension[] = [
  { title: 'Extensio Patronus', note: 'A control panel for keeping every browser extension in one tidy place.', image: 'projects/extensio_patronus_image.webp', href: 'https://chromewebstore.google.com/detail/extensio-patronus/ocmdlafnolpcdjjlbiabhiljojkjoolm', categories: ['MGMT', 'Utility'] },
  { title: 'Crop & Convert', note: 'Bulk image exports with preset and custom crops for social formats.', image: 'projects/crop_and_convert_image.webp', href: 'https://chromewebstore.google.com/detail/crop-convert/ikjkgiblokpgjfmkmogedlfdhkigicpb', categories: ['Design', 'Utility'] },
  { title: 'Buttonizer', note: 'A browser library for collecting and reusing custom buttons from the web.', image: 'projects/buttonizer_image.webp', href: 'https://chromewebstore.google.com/detail/buttonizer/cghjhagffajljkdapabcnbdnadllmkcp', categories: ['Creativity', 'Design'] },
  { title: 'Make Me Useful', note: 'A Pomodoro-style page blocker for staying with the task at hand.', image: 'projects/make_me_useful_image.webp', href: 'https://chromewebstore.google.com/detail/make-me-useful/pacfhmmocmgdknbnabhgipcfkjjehmla', categories: ['Utility', 'MGMT'] },
]

const clientLogos = [
  'logo_actiu.svg', 'logo_aenor.svg', 'logo_alhambra.svg', 'logo_amazon.svg', 'logo_bbva.svg',
  'logo_caixabank.svg', 'logo_cegid.svg', 'logo_cepsa.svg', 'logo_cle_de_peau.svg', 'logo_cloud_champion.svg',
  'logo_dacia.svg', 'logo_ecovidrio.svg', 'logo_elizabeth_arden.svg', 'logo_endesa.svg', 'logo_estrella_galicia.svg',
  'logo_filorga.svg', 'logo_genaq.svg', 'logo_gsk.svg', 'logo_iberdrola.svg', 'logo_ikea.svg',
  'logo_isdin.svg', 'logo_issey_miyake.svg', 'logo_kapturall.svg', 'logo_laliga.svg', 'logo_mahou.svg',
  'logo_microsoft.svg', 'logo_narciso_rodriguez.svg', 'logo_nars.svg', 'logo_naturgy.svg', 'logo_paradores.svg',
  'logo_peugeot.svg', 'logo_polestar.svg', 'logo_sandvik.svg', 'logo_santander.svg', 'logo_shiseido.svg',
  'logo_telefonica.svg', 'logo_universidad_europea.svg', 'logo_vicktor_and_rolf.svg',
] as const

const projectAreas: Record<string, string> = {
  '01': 'AI development & automation',
  '02': 'Business consulting',
  '03': 'Natural products e-commerce',
  '04': 'Children’s nursery',
  '05': 'Handmade eyewear atelier',
}

const contactLinks = [
  { letter: 'A', phrase: 'The classic hello', note: 'A reliable little inbox.', href: 'mailto:pelayotrivespozuelo@gmail.com' },
  { letter: 'B', phrase: 'Poke me', note: 'Slightly unstructured but useful.', href: 'https://www.linkedin.com/in/pelayo-trives-pozuelo/' },
  { letter: 'C', phrase: 'My geek side', note: 'Where the nerdy bits live.', href: 'https://github.com/pelayotrives' },
  { letter: 'D', phrase: 'Currently here', note: 'Probably near a good coffee.', href: 'https://maps.app.goo.gl/H5dVQjXYNSeXa2UT7' },
]

function ProjectArtwork({ project }: Readonly<{ project: Project }>) {
  const [loaded, setLoaded] = useState(false)
  const imageSrc = `${import.meta.env.BASE_URL}${project.image}`

  return (
    <Skeleton name={`project-artwork-${project.number}`} loading={!loaded} transition={240} className="artwork-skeleton" fallback={<div className="artwork-skeleton__fallback" aria-hidden="true"><img className="boneyard-preload-image" src={imageSrc} alt="" loading="lazy" decoding="async" onLoad={() => setLoaded(true)} onError={() => setLoaded(true)} /></div>}>
      <div className={`artwork ${project.className}`} aria-hidden="true">
        <img src={imageSrc} alt="" loading="lazy" decoding="async" onLoad={() => setLoaded(true)} onError={() => setLoaded(true)} />
      </div>
    </Skeleton>
  )
}

function ClientMarquee() {
  return (
    <div className="client-marquee-region" aria-label="Clients I have worked with">
      <div className="client-marquee" aria-hidden="true">
        <div className="client-marquee__track">{[0, 1].map((group) => <div className="client-marquee__group" key={group}>{clientLogos.map((logo) => <span className="client-marquee__item" key={`${group}-${logo}`}><img src={`${import.meta.env.BASE_URL}logos/${logo}`} alt="" loading="lazy" decoding="async" /></span>)}</div>)}</div>
      </div>
    </div>
  )
}

function ProjectViewerFrame({ project, view }: Readonly<{ project: Project; view: 'figma' | 'pdf' }>) {
  const [loaded, setLoaded] = useState(false)
  const source = view === 'figma' ? project.figmaUrl : `${import.meta.env.BASE_URL}${project.pdf}`
  const title = view === 'figma' ? `${project.title} interactive prototype` : `${project.title} case study PDF`

  return (
    <Skeleton name={`project-viewer-${view}`} loading={!loaded} transition={260} className="project-viewer__media-shell" fallback={<div className="project-viewer__media-fallback" aria-hidden="true"><iframe className="project-viewer__preload-frame" src={source} title={title} onLoad={() => setLoaded(true)} /></div>}>
      {view === 'figma' ? <iframe src={source} title={title} loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onLoad={() => setLoaded(true)} /> : <iframe className="project-viewer__pdf" src={source} title={title} loading="lazy" onLoad={() => setLoaded(true)} />}
    </Skeleton>
  )
}

function TypeText({ text, className }: Readonly<{ text: string; className: string }>) {
  return <em className={className} aria-label={text}>{Array.from(text).map((character, index) => <span aria-hidden="true" key={`${character}-${index}`}>{character === ' ' ? '\u00a0' : character}</span>)}</em>
}

function ProjectViewer({ project, onClose }: Readonly<{ project: Project; onClose: () => void }>) {
  const [view, setView] = useState<'figma' | 'pdf'>('figma')

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className="project-viewer" role="dialog" aria-modal="true" aria-labelledby="project-viewer-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="project-viewer__panel">
        <header className="project-viewer__header">
          <h2 id="project-viewer-title"><span>{project.number}</span> / {project.title}</h2>
          <div className="project-viewer__controls" aria-label={`${project.title} viewing options`}>
            <button className={view === 'figma' ? 'project-viewer__tab project-viewer__tab--active' : 'project-viewer__tab'} type="button" aria-pressed={view === 'figma'} onClick={() => setView('figma')}>Prototype</button>
            <button className={view === 'pdf' ? 'project-viewer__tab project-viewer__tab--active' : 'project-viewer__tab'} type="button" aria-pressed={view === 'pdf'} onClick={() => setView('pdf')}>Download</button>
          </div>
          <button className="project-viewer__close" type="button" onClick={onClose} aria-label={`Close ${project.title} viewer`}>Close <span>×</span></button>
        </header>
        <ProjectViewerFrame key={`${project.number}-${view}`} project={project} view={view} />
      </div>
    </div>
  )
}

function App() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    const updateLenis = (time: number) => lenis.raf(time * 1000)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nav = document.querySelector<HTMLElement>('.site-nav')
    const scrollProgressFill = document.querySelector<HTMLElement>('.scroll-progress__fill')
    const rewindOverlay = document.querySelector<HTMLElement>('.rewind-overlay')
    const rewindIcon = rewindOverlay?.querySelector<HTMLElement>('.rewind-overlay__icon')
    const setNavScrolled = (scrolled: boolean) => nav?.classList.toggle('site-nav--scrolled', scrolled)
    const updateScrollProgress = (scroll: number) => {
      const maximumScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      const progress = Math.min(1, Math.max(0, scroll / maximumScroll))
      if (scrollProgressFill) {
        gsap.set(scrollProgressFill, { scaleX: progress })
        scrollProgressFill.parentElement?.setAttribute('aria-valuenow', `${Math.round(progress * 100)}`)
      }
    }
    const handleScroll = ({ scroll }: { scroll: number }) => {
      setNavScrolled(scroll > 18)
      updateScrollProgress(scroll)
    }
    const handleNativeScroll = () => {
      setNavScrolled(window.scrollY > 18)
      updateScrollProgress(window.scrollY)
    }
    lenis.on('scroll', ScrollTrigger.update)
    lenis.on('scroll', handleScroll)
    window.addEventListener('scroll', handleNativeScroll, { passive: true })
    updateScrollProgress(window.scrollY)
    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)
    let disposeLoaderScene: (() => void) | undefined
    let disposeHeroOrbScene: (() => void) | undefined
    let heroOrbStart: gsap.core.Tween | undefined
    let rewindTimeline: gsap.core.Timeline | undefined
    let onBackToTop: ((event: MouseEvent) => void) | undefined
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
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25))
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
        heroOrbStart = gsap.delayedCall(loader ? 4.4 : 0, () => { void (async () => {
          try {
            const THREE = await loadThree()
            if (loaderCancelled || !heroOrbHost.isConnected) return
            const scene = new THREE.Scene()
            const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 20)
            camera.position.z = 5.8
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
            const constrainedDevice = window.matchMedia('(max-width: 700px)').matches || (navigator.hardwareConcurrency ?? 8) <= 4
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, constrainedDevice ? 1.15 : 1.6))
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
              canvas.width = 384
              canvas.height = 192
              const context2d = canvas.getContext('2d')
              if (!context2d) return null
              const gradient = context2d.createLinearGradient(0, 0, canvas.width, 0)
              gradient.addColorStop(0, '#403d39')
              gradient.addColorStop(0.16, '#eb5e28')
              gradient.addColorStop(0.3, '#fffcf2')
              gradient.addColorStop(0.44, '#7d77e8')
              gradient.addColorStop(0.58, '#252422')
              gradient.addColorStop(0.72, '#fffcf2')
              gradient.addColorStop(0.86, '#eb5e28')
              gradient.addColorStop(1, '#403d39')
              context2d.fillStyle = gradient
              context2d.fillRect(0, 0, canvas.width, canvas.height)
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
            const prismPhase = { value: 0 }
            const prismStrength = { value: 0.32 }
            const prismBaseStrength = 0.32
            const prismAxis = new THREE.Vector3(0.35, 0.78, 0.52).normalize()
            const glassMaterial = new THREE.MeshPhysicalMaterial({
              color: '#fffcf2', metalness: 0, roughness: 0.06, transmission: 0.88, thickness: 1.2,
              ior: 1.45, clearcoat: 0.9, clearcoatRoughness: 0.05, reflectivity: 0.82,
              transparent: true, envMapIntensity: 2.1, opacity: 0.68, depthWrite: false,
            })
            const prismMaterial = new THREE.ShaderMaterial({
              uniforms: { uPrismAxis: { value: prismAxis }, uPrismPhase: prismPhase, uPrismStrength: prismStrength },
              vertexShader: `
                varying vec3 vWorldNormal;
                varying vec3 vViewNormal;
                varying vec3 vViewDirection;
                void main() {
                  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
                  vWorldNormal = normalize(mat3(modelMatrix) * normal);
                  vViewNormal = normalize(normalMatrix * normal);
                  vViewDirection = normalize(-viewPosition.xyz);
                  gl_Position = projectionMatrix * viewPosition;
                }
              `,
              fragmentShader: `
                precision highp float;
                uniform vec3 uPrismAxis;
                uniform float uPrismPhase;
                uniform float uPrismStrength;
                varying vec3 vWorldNormal;
                varying vec3 vViewNormal;
                varying vec3 vViewDirection;
                void main() {
                  float incidence = dot(normalize(vWorldNormal), normalize(uPrismAxis));
                  float field = incidence * 3.8 + uPrismPhase * 6.2831853;
                  vec3 chroma = 0.5 + 0.5 * cos(field + vec3(0.0, 2.0943951, 4.1887902));
                  float facing = max(dot(normalize(vViewNormal), normalize(vViewDirection)), 0.0);
                  float rim = pow(1.0 - facing, 3.6);
                  float band = smoothstep(0.18, 0.82, 0.5 + 0.5 * sin(field));
                  float alpha = rim * band * uPrismStrength * 0.44;
                  gl_FragColor = vec4(mix(vec3(1.0), chroma, 0.9) * alpha, alpha);
                }
              `,
              transparent: true, depthWrite: false, side: THREE.DoubleSide,
            })
            const dandelionGroup = new THREE.Group()
            const dandelionSeedCount = constrainedDevice ? 76 : 132
            const dandelionLinePositions: number[] = []
            const dandelionTipPositions: number[] = []
            const goldenAngle = Math.PI * (3 - Math.sqrt(5))
            for (let index = 0; index < dandelionSeedCount; index += 1) {
              const normalized = (index + 0.5) / dandelionSeedCount
              const y = 1 - normalized * 2
              const ring = Math.sqrt(Math.max(0, 1 - y * y))
              const angle = index * goldenAngle
              const directionX = Math.cos(angle) * ring
              const directionZ = Math.sin(angle) * ring
              const length = 0.57 + (index % 5) * 0.035
              const tipX = directionX * length
              const tipY = 0.16 + y * length * 0.86
              const tipZ = directionZ * length
              dandelionLinePositions.push(0, 0.16, 0, tipX, tipY, tipZ)
              dandelionTipPositions.push(tipX, tipY, tipZ)
            }
            const dandelionGeometry = new THREE.BufferGeometry()
            dandelionGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dandelionLinePositions, 3))
            const dandelionTipGeometry = new THREE.BufferGeometry()
            dandelionTipGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dandelionTipPositions, 3))
            const dandelionLineMaterial = new THREE.LineBasicMaterial({ color: '#fffcf2', transparent: true, opacity: 0.72, depthTest: false })
            const dandelionTipMaterial = new THREE.PointsMaterial({ color: '#fffcf2', size: constrainedDevice ? 0.038 : 0.046, transparent: true, opacity: 0.92, depthTest: false, sizeAttenuation: true })
            const dandelionLines = new THREE.LineSegments(dandelionGeometry, dandelionLineMaterial)
            const dandelionTips = new THREE.Points(dandelionTipGeometry, dandelionTipMaterial)
            dandelionLines.renderOrder = 3
            dandelionTips.renderOrder = 3
            const dandelionStemGeometry = new THREE.BufferGeometry()
            dandelionStemGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, -0.98, 0, 0, 0.16, 0], 3))
            const dandelionStem = new THREE.LineSegments(dandelionStemGeometry, dandelionLineMaterial)
            dandelionStem.renderOrder = 3
            dandelionGroup.add(dandelionLines, dandelionTips, dandelionStem)
            dandelionGroup.scale.setScalar(0.86)

            const sphereGeometry = new THREE.SphereGeometry(1.36, constrainedDevice ? 48 : 64, constrainedDevice ? 48 : 64)
            const sphere = new THREE.Mesh(sphereGeometry, glassMaterial)
            const prismShell = new THREE.Mesh(sphereGeometry, prismMaterial)
            prismShell.scale.setScalar(1.004)
            const dandelionCoreGeometry = new THREE.SphereGeometry(0.13, constrainedDevice ? 10 : 16, constrainedDevice ? 10 : 16)
            const dandelionCoreMaterial = new THREE.MeshPhysicalMaterial({ color: '#ccc5b9', roughness: 0.28, metalness: 0.12, clearcoat: 0.4, transparent: true, opacity: 0.88 })
            const dandelionCore = new THREE.Mesh(dandelionCoreGeometry, dandelionCoreMaterial)
            dandelionCore.position.y = 0.16
            dandelionCore.renderOrder = 3
            dandelionGroup.add(dandelionCore)
            scrollRig.add(sphere, prismShell, dandelionGroup)
            scene.add(new THREE.AmbientLight('#fffcf2', 1.1))
            scene.add(new THREE.HemisphereLight('#fffcf2', '#403d39', 1.8))
            const keyLight = new THREE.DirectionalLight('#ffffff', 3.2)
            keyLight.position.set(2.6, 3.1, 4.8)
            scene.add(keyLight)
            const rimLight = new THREE.DirectionalLight('#ccc5b9', 1.4)
            rimLight.position.set(-3.4, -1.3, 2.4)
            scene.add(rimLight)
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
            let scrollProgress = 0
            let prismTarget = 0
            let pointerX = 0
            let pointerY = 0
            let pointerTargetX = 0
            let pointerTargetY = 0
            const heroSection = document.querySelector<HTMLElement>('.hero')
            const handleHeroPointerMove = (event: PointerEvent) => {
              if (!heroSection) return
              const bounds = heroSection.getBoundingClientRect()
              pointerTargetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
              pointerTargetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2
            }
            const handleHeroPointerLeave = () => {
              pointerTargetX = 0
              pointerTargetY = 0
            }
            heroSection?.addEventListener('pointermove', handleHeroPointerMove)
            heroSection?.addEventListener('pointerleave', handleHeroPointerLeave)
            const renderHero = () => {
              timer.update()
              const elapsed = timer.getElapsed()
              pointerX += (pointerTargetX - pointerX) * 0.065
              pointerY += (pointerTargetY - pointerY) * 0.065
              prismStrength.value += (prismTarget - prismStrength.value) * 0.08
              prismTarget = Math.max(prismBaseStrength, prismTarget * 0.94)
              const spin = elapsed * 0.32
              sphere.rotation.y = spin + scrollProgress * Math.PI * 0.8 + pointerX * 0.72
              sphere.rotation.x = Math.sin(elapsed * 0.16) * 0.045 + scrollProgress * 0.08 + pointerY * 0.42
              prismShell.rotation.copy(sphere.rotation)
              dandelionGroup.rotation.y = elapsed * 0.24 + scrollProgress * 0.28
              dandelionGroup.rotation.x = Math.sin(elapsed * 0.22) * 0.06 + pointerY * 0.12
              dandelionGroup.rotation.z = Math.cos(elapsed * 0.17) * 0.035
              scene.environmentRotation.y = elapsed * -0.04 + scrollProgress * -0.8 + pointerX * 0.2
              prismAxis.set(
                0.35 + pointerX * 0.5 + Math.sin(scrollProgress * Math.PI * 1.4) * 0.3,
                0.78 + pointerY * 0.32,
                0.52 + Math.cos(scrollProgress * Math.PI * 1.4) * 0.34,
              ).normalize()
              prismPhase.value = scrollProgress * 0.8 + pointerX * 0.12
              renderer.render(scene, camera)
            }
            const visibilityObserver = new IntersectionObserver(([entry]) => {
              if (entry?.isIntersecting) {
                timer.reset()
                renderer.setAnimationLoop(renderHero)
              } else renderer.setAnimationLoop(null)
            }, { threshold: 0.01 })
            visibilityObserver.observe(heroOrbHost)
            renderer.setAnimationLoop(renderHero)
            gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true, onUpdate: (self) => { scrollProgress = self.progress; prismTarget = Math.min(1, prismBaseStrength + Math.abs(self.getVelocity()) / 360) } } })
              .to(scrollRig.rotation, { y: Math.PI * 1.75, x: Math.PI * 0.26, ease: 'none' }, 0)
              .to(root.rotation, { z: -Math.PI * 0.18, ease: 'none' }, 0)
              .to(scrollRig.position, { x: -0.08, y: -0.16, ease: 'none' }, 0)
            disposeHeroOrbScene = () => {
              renderer.setAnimationLoop(null)
              heroSection?.removeEventListener('pointermove', handleHeroPointerMove)
              heroSection?.removeEventListener('pointerleave', handleHeroPointerLeave)
              observer.disconnect()
              visibilityObserver.disconnect()
              timer.dispose()
              sphere.geometry.dispose()
              dandelionGeometry.dispose()
              dandelionTipGeometry.dispose()
              dandelionStemGeometry.dispose()
              dandelionCoreGeometry.dispose()
              glassMaterial.dispose()
              prismMaterial.dispose()
              dandelionLineMaterial.dispose()
              dandelionTipMaterial.dispose()
              dandelionCoreMaterial.dispose()
              environmentTarget?.dispose()
              renderer.dispose()
              renderer.domElement.remove()
            }
          } catch {
            return undefined
          }
        })() })
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
      })
      media.add('(min-width: 1280px) and (prefers-reduced-motion: no-preference)', () => {
        const hero = document.querySelector<HTMLElement>('.hero')
        const orb = hero?.querySelector<HTMLElement>('.hero-orb')
        const portalOverlay = document.querySelector<HTMLElement>('.hero-portal-overlay')
        if (!hero || !orb || !portalOverlay) return undefined

        const getPortalOrigin = () => ({
          x: window.innerWidth / 2 - hero.getBoundingClientRect().left,
          y: window.innerHeight / 2 - hero.getBoundingClientRect().top,
        })
        const getOrbTarget = () => {
          const origin = getPortalOrigin()
          return {
            x: origin.x - (orb.offsetLeft + orb.offsetWidth / 2),
            y: origin.y - (orb.offsetTop + orb.offsetHeight / 2),
          }
        }
        const getPortalRadius = () => Math.ceil(Math.hypot(window.innerWidth, window.innerHeight))
        const getOrbScale = () => Math.min(2.9, Math.max(2.3, getPortalRadius() / Math.max(orb.offsetWidth, 1) * 0.32))
        const heroContent = [
          ...gsap.utils.toArray<HTMLElement>('.hero__eyebrow, .hero__title-line'),
        ]

        const portal = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: 'top -8%',
            end: () => `+=${Math.max(window.innerHeight * 1.15, 860)}`,
            pin: true,
            pinSpacing: false,
            scrub: 0.85,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        portal
          .set(portalOverlay, { autoAlpha: 1, '--hero-portal': '2px' }, 0)
          .to(heroContent, { y: -32, autoAlpha: 0, duration: 0.36, ease: 'none', stagger: 0.015 }, 0)
          .to(hero, { '--hero-grid-opacity': 0, duration: 0.28, ease: 'none' }, 0.16)
          .to(orb, { x: () => getOrbTarget().x, y: () => getOrbTarget().y, scale: 1.14, duration: 0.46, ease: 'none' }, 0)
          .to(orb, { scale: getOrbScale, autoAlpha: 0, duration: 0.58, ease: 'none' }, 0.42)
          .to(portalOverlay, { '--hero-portal': () => `${getPortalRadius()}px`, duration: 0.58, ease: 'none' }, 0.42)
          .set(portalOverlay, { autoAlpha: 0 }, 1)

        return () => portal.kill()
      })
      gsap.utils.toArray<HTMLElement>('.project-card').forEach((card, index) => {
        gsap.fromTo(card, { y: 42, opacity: 0, filter: 'blur(12px)' }, {
          y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.85, delay: index * 0.05, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 58%', end: 'bottom 42%', toggleActions: 'play reverse play reverse' },
        })
      })
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const track = document.querySelector<HTMLElement>('.client-marquee__track')
        if (!track) return undefined

        const loop = gsap.to(track, {
          xPercent: -50,
          duration: 68,
          ease: 'none',
          repeat: -1,
        })

        return () => loop.kill()
      })
      media.add('(min-width: 701px)', () => {
        const stage = document.querySelector<HTMLElement>('.extension-grid')
        const track = stage?.querySelector<HTMLElement>('.extension-track')
        const firstCard = track?.querySelector<HTMLElement>('.extension-card')
        if (!stage || !track || !firstCard) return undefined

        const getCardShift = () => {
          const gap = Number.parseFloat(getComputedStyle(track).gap) || 0
          return -(firstCard.getBoundingClientRect().width + gap)
        }
        const getPinOffset = () => Math.max(24, Math.round((window.innerHeight - stage.offsetHeight) / 2))

        const tween = gsap.to(track, {
          x: getCardShift,
          ease: 'none',
          scrollTrigger: {
            trigger: stage,
            start: () => `top top+=${getPinOffset()}`,
            end: () => `+=${Math.max(window.innerHeight * 0.9, 620)}`,
            pin: true,
            scrub: 0.9,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        return () => tween.kill()
      })
      media.add('(max-width: 700px) and (prefers-reduced-motion: no-preference)', () => {
        const stage = document.querySelector<HTMLElement>('.extension-grid')
        const track = stage?.querySelector<HTMLElement>('.extension-track')
        const firstCard = track?.querySelector<HTMLElement>('.extension-card')
        const cards = gsap.utils.toArray<HTMLElement>('.extension-card')
        if (!stage || !track || !firstCard || cards.length < 2) return undefined

        const getCardShift = () => {
          const gap = Number.parseFloat(getComputedStyle(track).gap) || 0
          return firstCard.getBoundingClientRect().width + gap
        }
        const getPinOffset = () => Math.max(24, Math.round((window.innerHeight - stage.offsetHeight) / 2))

        const tween = gsap.to(track, {
          x: () => -getCardShift() * (cards.length - 1),
          ease: 'none',
          scrollTrigger: {
            trigger: stage,
            start: () => `top top+=${getPinOffset()}`,
            end: () => `+=${Math.max(window.innerHeight * 1.05, 560) * (cards.length - 1)}`,
            pin: true,
            scrub: 0.9,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        return () => tween.kill()
      })
      gsap.utils.toArray<HTMLElement>('[data-scroll-divider]').forEach((divider) => {
        gsap.fromTo(divider, { '--divider-progress': 0 }, {
          '--divider-progress': 1,
          ease: 'none',
          scrollTrigger: { trigger: divider, start: 'top 84%', end: 'top 50%', scrub: 1.15, invalidateOnRefresh: true },
        })
      })
      media.add('(min-width: 701px)', () => {
        const panel = document.querySelector<HTMLElement>('.about-section')
        const innerPanel = panel?.querySelector<HTMLElement>('.about-panel__inner')
        if (!panel || !innerPanel) return undefined

        const measure = () => {
          panel.style.marginBottom = ''
          const panelHeight = panel.offsetHeight
          const innerHeight = innerPanel.scrollHeight
          const difference = Math.max(0, innerHeight - panelHeight)
          const fakeScrollRatio = difference > 0 ? difference / (difference + panelHeight) : 0
          if (fakeScrollRatio) panel.style.marginBottom = `${innerHeight * fakeScrollRatio}px`
          return { difference, fakeScrollRatio, innerHeight }
        }

        let metrics = measure()
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'top top',
            end: () => metrics.difference > 0 ? `+=${metrics.innerHeight}` : 'bottom top',
            pin: true,
            pinSpacing: false,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })

        if (metrics.difference > 0) {
          timeline.to(innerPanel, {
            y: () => -metrics.difference,
            duration: 1 / (1 - metrics.fakeScrollRatio) - 1,
            ease: 'none',
          })
        }
        timeline.fromTo(panel, { scale: 1, opacity: 1 }, { scale: 0.96, opacity: 0.94, duration: 0.9, ease: 'none' })
          .to(panel, { opacity: 0, duration: 0.1, ease: 'none' })

        const handleResize = () => {
          metrics = measure()
          ScrollTrigger.refresh()
        }
        window.addEventListener('resize', handleResize)
        return () => {
          window.removeEventListener('resize', handleResize)
          panel.style.marginBottom = ''
        }
      })
      media.add('(min-width: 701px)', () => {
        const panel = document.querySelector<HTMLElement>('.contact-links-section')
        const innerPanel = panel?.querySelector<HTMLElement>('.contact-links__list')
        if (!panel || !innerPanel) return undefined

        const measure = () => {
          panel.style.marginBottom = ''
          const panelHeight = panel.offsetHeight
          const innerHeight = innerPanel.scrollHeight
          const difference = Math.max(0, innerHeight - panelHeight)
          const fakeScrollRatio = difference > 0 ? difference / (difference + panelHeight) : 0
          if (fakeScrollRatio) panel.style.marginBottom = `${innerHeight * fakeScrollRatio}px`
          return { difference, fakeScrollRatio, innerHeight }
        }

        let metrics = measure()
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'top top',
            end: () => metrics.difference > 0 ? `+=${innerPanel.scrollHeight}` : 'bottom top',
            pin: true,
            pinSpacing: false,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })

        if (metrics.difference > 0) {
          timeline.to(innerPanel, {
            y: () => -metrics.difference,
            duration: 1 / (1 - metrics.fakeScrollRatio) - 1,
            ease: 'none',
          })
        }
        timeline.fromTo(panel, { scale: 1, opacity: 1 }, { scale: 0.96, opacity: 0.94, duration: 0.9, ease: 'none' })
          .to(panel, { opacity: 0, duration: 0.1, ease: 'none' })

        const handleResize = () => {
          metrics = measure()
          ScrollTrigger.refresh()
        }
        window.addEventListener('resize', handleResize)
        return () => {
          window.removeEventListener('resize', handleResize)
          panel.style.marginBottom = ''
        }
      })
      media.add('(max-width: 700px) and (prefers-reduced-motion: no-preference)', () => {
        const panel = document.querySelector<HTMLElement>('.about-section')
        const innerPanel = panel?.querySelector<HTMLElement>('.about-panel__inner')
        if (!panel || !innerPanel) return undefined

        const measure = () => {
          panel.style.height = '100svh'
          panel.style.overflow = 'hidden'
          panel.style.marginBottom = ''
          const panelHeight = panel.offsetHeight
          const innerHeight = innerPanel.scrollHeight
          const difference = Math.max(0, innerHeight - panelHeight)
          const fakeScrollRatio = difference > 0 ? difference / (difference + panelHeight) : 0
          if (fakeScrollRatio) panel.style.marginBottom = `${innerHeight * fakeScrollRatio}px`
          return { difference, fakeScrollRatio, innerHeight }
        }

        let metrics = measure()
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'top top',
            end: () => metrics.difference > 0 ? `+=${metrics.innerHeight}` : 'bottom top',
            pin: true,
            pinSpacing: false,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })

        if (metrics.difference > 0) {
          timeline.to(innerPanel, { y: () => -metrics.difference, duration: 1 / (1 - metrics.fakeScrollRatio) - 1, ease: 'none' })
        }
        timeline.fromTo(panel, { scale: 1, opacity: 1 }, { scale: 0.96, opacity: 0.94, duration: 0.9, ease: 'none' })
          .to(panel, { opacity: 0, duration: 0.1, ease: 'none' })

        const handleResize = () => {
          metrics = measure()
          ScrollTrigger.refresh()
        }
        window.addEventListener('resize', handleResize)
        return () => {
          window.removeEventListener('resize', handleResize)
          panel.style.height = ''
          panel.style.overflow = ''
          panel.style.marginBottom = ''
        }
      })
      media.add('(max-width: 700px) and (prefers-reduced-motion: no-preference)', () => {
        const panel = document.querySelector<HTMLElement>('.contact-links-section')
        const innerPanel = panel?.querySelector<HTMLElement>('.contact-links__list')
        if (!panel || !innerPanel) return undefined

        const measure = () => {
          panel.style.height = '100svh'
          panel.style.overflow = 'hidden'
          panel.style.marginBottom = ''
          const panelHeight = panel.offsetHeight
          const innerHeight = innerPanel.scrollHeight
          const difference = Math.max(0, innerHeight - panelHeight)
          const fakeScrollRatio = difference > 0 ? difference / (difference + panelHeight) : 0
          if (fakeScrollRatio) panel.style.marginBottom = `${innerHeight * fakeScrollRatio}px`
          return { difference, fakeScrollRatio, innerHeight }
        }

        let metrics = measure()
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'top top',
            end: () => metrics.difference > 0 ? `+=${metrics.innerHeight}` : 'bottom top',
            pin: true,
            pinSpacing: false,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })

        if (metrics.difference > 0) {
          timeline.to(innerPanel, { y: () => -metrics.difference, duration: 1 / (1 - metrics.fakeScrollRatio) - 1, ease: 'none' })
        }
        timeline.fromTo(panel, { scale: 1, opacity: 1 }, { scale: 0.96, opacity: 0.94, duration: 0.9, ease: 'none' })
          .to(panel, { opacity: 0, duration: 0.1, ease: 'none' })

        const handleResize = () => {
          metrics = measure()
          ScrollTrigger.refresh()
        }
        window.addEventListener('resize', handleResize)
        return () => {
          window.removeEventListener('resize', handleResize)
          panel.style.height = ''
          panel.style.overflow = ''
          panel.style.marginBottom = ''
        }
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
          color: '#eb5e28',
          webkitTextStrokeWidth: '0px',
          skewX: -11,
          ease: 'none',
          scrollTrigger: {
            trigger: '.about-section',
            start: 'top 56%',
            end: 'top 18%',
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
      gsap.to('.contact-star', {
        rotation: 360,
        ease: 'none',
        scrollTrigger: {
          trigger: '.contact-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.4,
          invalidateOnRefresh: true,
        },
      })
      gsap.fromTo('.contact-section', {
        '--contact-extra-height': '0svh', '--contact-offset': '0px', '--contact-top-extra': '0px', '--contact-flow-extra': '0px', '--contact-grid-opacity': 0,
      }, {
        '--contact-extra-height': '28svh', '--contact-offset': '-82px', '--contact-top-extra': '82px', '--contact-flow-extra': '82px',
        ease: 'none', scrollTrigger: { trigger: '.contact-section', start: 'top 85%', end: 'top 10%', scrub: 1, invalidateOnRefresh: true },
      })
      gsap.fromTo('.contact-section', { '--contact-grid-opacity': 0 }, { '--contact-grid-opacity': 0.42, ease: 'none', scrollTrigger: { trigger: '.contact-section', start: 'top 52%', end: 'top 12%', scrub: 0.8, invalidateOnRefresh: true } })
      gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: '.contact-morph',
          start: 'top 72%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
        },
      })
        .to('.contact-morph__current span', { opacity: 0, duration: 0.36, stagger: { each: 0.025, from: 'end' } })
        .to('.contact-morph__next span', { opacity: 1, duration: 0.42, stagger: 0.035 })

      const backToTop = document.querySelector<HTMLAnchorElement>('[data-back-to-top]')
      if (backToTop && rewindOverlay && rewindIcon) {
        onBackToTop = (event) => {
          event.preventDefault()
          rewindTimeline?.kill()

          if (prefersReducedMotion) {
            lenis.scrollTo(0, { immediate: true, force: true })
            window.scrollTo({ top: 0, behavior: 'auto' })
            return
          }

          rewindOverlay.setAttribute('aria-hidden', 'false')
          rewindOverlay.classList.add('rewind-overlay--active')
          rewindTimeline = gsap.timeline({
            defaults: { ease: 'power2.inOut' },
            onComplete: () => {
              rewindOverlay.classList.remove('rewind-overlay--active')
              rewindOverlay.setAttribute('aria-hidden', 'true')
            },
          })
            .set(rewindOverlay, { autoAlpha: 0 })
            .set(rewindIcon, { autoAlpha: 0, scale: 0.52, x: 18, rotation: -16 })
            .to(rewindOverlay, { autoAlpha: 1, duration: 0.14, ease: 'power2.out' })
            .to(rewindIcon, { autoAlpha: 1, scale: 1, x: 0, rotation: 0, duration: 0.3, ease: 'back.out(1.7)' }, '-=.04')
            .add(() => {
              lenis.scrollTo(0, {
                duration: 0.9,
                easing: (value) => 1 - ((1 - value) ** 3),
                lock: true,
                force: true,
              })
            }, '+=.03')
            .to(rewindIcon, { scale: 0.82, x: -10, duration: 0.72, ease: 'power2.inOut' }, '<')
            .to(rewindOverlay, { autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, '>-0.02')
        }
        backToTop.addEventListener('click', onBackToTop)
      }
    }, pageRef)

    const cursor = document.querySelector<HTMLElement>('.cursor')
    const cursorCore = cursor?.querySelector<HTMLElement>('span')
    const cursorOrbit = cursor?.querySelector<HTMLElement>('b')
    const cursorTrails = gsap.utils.toArray<HTMLElement>('.cursor-trail')
    const contactSection = document.querySelector<HTMLElement>('.contact-section')
    const contactTitle = document.querySelector<HTMLElement>('.contact-title-wrap')
    const contactLinkElements = gsap.utils.toArray<HTMLElement>('[data-contact-link]')
    const hasPointer = window.matchMedia('(pointer: fine)').matches
    let onMove: ((event: PointerEvent) => void) | undefined
    let onOver: ((event: PointerEvent) => void) | undefined
    let onContactLeave: (() => void) | undefined
    let onWindowLeave: (() => void) | undefined
    let interactive = false
    let activeContactLink: HTMLElement | undefined

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
        const hoveredPhrase = (event.target as Element).closest<HTMLElement>('.contact-link__phrase')
        const contactLink = hoveredPhrase?.closest<HTMLElement>('[data-contact-link]') ?? undefined
        if (contactLink !== activeContactLink) {
          if (activeContactLink) {
            activeContactLink.classList.remove('contact-link--active')
            const previousPhrase = activeContactLink.querySelector<HTMLElement>('.contact-link__phrase')
            if (previousPhrase) gsap.to(previousPhrase, { '--contact-radius': '0px', letterSpacing: '-0.075em', duration: 0.32, ease: 'power2.out', overwrite: true })
          }
          activeContactLink = contactLink
          if (activeContactLink) {
            activeContactLink.classList.add('contact-link--active')
            const currentPhrase = activeContactLink.querySelector<HTMLElement>('.contact-link__phrase')
            if (currentPhrase) gsap.to(currentPhrase, { '--contact-radius': '30px', letterSpacing: '-0.02em', duration: 0.42, ease: 'power3.out', overwrite: true })
          }
        }
        if (contactLink) {
          const phrase = contactLink.querySelector<HTMLElement>('.contact-link__phrase')
          if (phrase) {
            const phraseBounds = phrase.getBoundingClientRect()
            phrase.style.setProperty('--contact-x', `${event.clientX - phraseBounds.left}px`)
            phrase.style.setProperty('--contact-y', `${event.clientY - phraseBounds.top}px`)
          }
        }
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
      onWindowLeave = () => {
        setInteractive(false)
        if (activeContactLink) {
          activeContactLink.classList.remove('contact-link--active')
          const phrase = activeContactLink.querySelector<HTMLElement>('.contact-link__phrase')
          if (phrase) gsap.to(phrase, { '--contact-radius': '0px', letterSpacing: '-0.075em', duration: 0.32, ease: 'power2.out', overwrite: true })
          activeContactLink = undefined
        }
      }
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
      heroOrbStart?.kill()
      loaderCancelled = true
      disposeLoaderScene?.()
      disposeHeroOrbScene?.()
      if (onMove) window.removeEventListener('pointermove', onMove)
      if (onOver) window.removeEventListener('pointerover', onOver)
      if (onWindowLeave) window.removeEventListener('pointerleave', onWindowLeave)
      if (onContactLeave) contactSection?.removeEventListener('pointerleave', onContactLeave)
      if (onBackToTop) document.querySelector<HTMLAnchorElement>('[data-back-to-top]')?.removeEventListener('click', onBackToTop)
      rewindTimeline?.kill()
      contactLinkElements.forEach((link) => gsap.killTweensOf(link))
    }
  }, [])

  return (
    <div className="site-shell" ref={pageRef}>
      <div className="intro-loader" aria-hidden="false"><div className="intro-loader__inner"><div className="intro-loader__messages"><p className="intro-loader__message">Getting the design in shape</p><p className="intro-loader__message">Loading the images</p><p className="intro-loader__message">Updating the experience</p></div><div className="intro-loader__canvas" aria-hidden="true" /><span className="intro-loader__count">Pelayo Trives | Product Engineer</span></div></div>
      <div className="rewind-overlay" aria-hidden="true">
        <div className="rewind-overlay__content">
          <img className="rewind-overlay__icon" src={`${import.meta.env.BASE_URL}rewind-icon.svg`} alt="" aria-hidden="true" />
          <span className="rewind-overlay__label">REWINDING...</span>
        </div>
      </div>
      <div className="scroll-progress" role="progressbar" aria-label="Page scroll progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}><span className="scroll-progress__fill" /></div>
      <div className="cursor-trails" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <span className="cursor-trail" key={index} />)}</div>
      <div className="cursor" aria-hidden="true"><span /><b><Asterisk aria-hidden="true" /></b></div>
      <header className="site-nav" data-scroll-divider="bottom">
        <div className="site-nav__brand"><a className="wordmark" href="#top" aria-label="Pelayo Trives, back to top">PT<span>.</span></a></div>
        <div className="site-nav__meta"><p className="nav-note">Product Engineer<br />based in Kyoto</p></div>
        <nav className="site-nav__actions" aria-label="Main navigation">
          <a href="#work">Selected work</a>
          <a href="#about">About</a>
          <a className="nav-contact" href="mailto:pelayotrivespozuelo@gmail.com">Let's talk <ArrowUpRight className="icon-arrow" aria-hidden="true" /></a>
        </nav>
      </header>
      <div className="hero-portal-overlay" aria-hidden="true" />

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__eyebrow"><span className="dot" /> Pelayo Trives | Product Engineer</div>
          <h1 id="hero-title"><span className="hero__title-line">Interfaces with</span><span className="hero__title-line"><em>something</em> to say.</span></h1>
          <div className="hero-orb" aria-hidden="true"><div className="hero-orb__canvas" /></div>
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title" data-scroll-divider="top">
          <div className="section-head">
            <div><span className="section-index">01</span><h2 id="work-title">A few things<br />I’ve made.</h2></div>
            <p>Five case studies in product thinking, visual systems and the joy of a well-placed detail.</p>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => (
              <article className={`project-card project-card--${index + 1}`} key={project.number}>
                <a href={`#project-${project.number}`} className="project-card__link" aria-label={`View ${project.title} case study`} onClick={(event) => { event.preventDefault(); setSelectedProject(project) }}>
                  <ProjectArtwork project={project} />
                  <div className="project-card__meta" data-scroll-divider="bottom"><span>{project.number} / {projectAreas[project.number]}</span><span>{project.year} <ArrowUpRight className="icon-arrow" aria-hidden="true" /></span></div>
                  <h3>{project.title}</h3><p>{project.note}</p>
                </a>
              </article>
            ))}
          </div>
          <div className="extension-work" data-scroll-divider="top">
            <div className="extension-work__heading">
              <div><span className="section-index">Chrome Browser Tools</span><h3>Small utilities,<br />built to help.</h3></div>
              <p>A growing collection of small tools for the everyday frictions worth smoothing out.</p>
            </div>
            <div className="extension-grid">
              <div className="extension-track">
                {extensions.map((extension) => (
                  <a className="extension-card" href={extension.href} key={extension.title} target="_blank" rel="noreferrer" aria-label={`Open ${extension.title} in Chrome Web Store`}>
                    <img src={`${import.meta.env.BASE_URL}${extension.image}`} alt="" loading="lazy" decoding="async" />
                    <div className="extension-card__body"><div className="extension-card__copy"><h4>{extension.title}</h4><p>{extension.note}</p></div><div className="extension-card__badges">{extension.categories.map((category) => <span className={`extension-badge extension-badge--${category.toLowerCase()}`} key={category}>{category}</span>)}</div><div className="extension-card__footer"><span className="extension-card__cta">Go to extension <ArrowUpRight className="icon-arrow" aria-hidden="true" /></span></div></div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title" data-scroll-divider="top">
          <div className="about-panel__inner">
            <div className="section-index">02</div>
            <div className="about-copy"><h2 id="about-title">Hi, I’m <span className="about-title__name">Pelayo</span> Trives<span>.</span></h2><ClientMarquee /><p className="about-lede">A Product Engineer interested in the space between a good idea and the moment it clicks.</p><p>I work in Figma from the first slightly-too-rough sketch to the final tiny transition. I like systems that leave room for personality, and interfaces that reward a second look.</p><div className="timeline" aria-label="Education and experience timeline"><div className="timeline__track" /><div className="timeline__progress" /><div className="timeline__item"><span className="timeline__date">2023—Now</span><span className="timeline__dot" aria-hidden="true" /><div><h3>Culpass</h3><p>Full Stack Developer &amp; Technical Project Manager.</p></div></div><div className="timeline__item"><span className="timeline__date">2024—2026</span><span className="timeline__dot" aria-hidden="true" /><div><h3>VIU · Universidad Internacional de Valencia</h3><p>Master’s degree in Artificial Intelligence, Machine Learning and Computational Optimization.</p></div></div><div className="timeline__item"><span className="timeline__date">2023—2025</span><span className="timeline__dot" aria-hidden="true" /><div><h3>Luce Innovative Technologies</h3><p>Full Stack Developer.</p></div></div><div className="timeline__item"><span className="timeline__date">2023—2024</span><span className="timeline__dot" aria-hidden="true" /><div><h3>Kapturall</h3><p>Front-End Developer &amp; UX/UI Design Lead.</p></div></div><div className="timeline__item"><span className="timeline__date">2023</span><span className="timeline__dot" aria-hidden="true" /><div><h3>Vocento.Medios</h3><p>Front-End Developer for editorial and online publishing experiences.</p></div></div><div className="timeline__item"><span className="timeline__date">2018—2022</span><span className="timeline__dot" aria-hidden="true" /><div><h3>UOC · Universitat Oberta de Catalunya</h3><p>Bachelor in Multimedia.</p></div></div></div><a className="text-link" href="https://www.linkedin.com/in/pelayo-trives-pozuelo/">More about me <ArrowUpRight className="icon-arrow" aria-hidden="true" /></a></div>
          </div>
        </section>

        <section className="contact-links-section" id="contact" aria-labelledby="contact-links-title" data-scroll-divider="top">
          <h2 id="contact-links-title" className="sr-only">Contact Pelayo Trives</h2>
          <div className="contact-links__list">
            {contactLinks.map((link) => (
              <a className="contact-link" data-contact-link data-scroll-divider="bottom" href={link.href} key={link.letter} target={link.href.startsWith('mailto:') ? undefined : '_blank'} rel={link.href.startsWith('mailto:') ? undefined : 'noreferrer'}>
                <span className="contact-link__number">{link.letter}</span>
                <span className="contact-link__phrase"><span className="contact-link__base">{link.phrase}</span><span className="contact-link__hover" aria-hidden="true">{link.phrase}</span></span>
                <span className="contact-link__note">{link.note}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="contact-section" aria-labelledby="contact-title"><div className="contact-star" aria-hidden="true"><Asterisk className="contact-star__icon" /></div><p className="contact-kicker">Have a good project?</p><div className="contact-title-wrap"><h2 id="contact-title">Let’s make<br /><span className="contact-morph"><TypeText className="contact-morph__current" text="the right thing." /><TypeText className="contact-morph__next" text="the best." /></span></h2><h2 className="contact-title-glow" aria-hidden="true">Let’s make<br /><span className="contact-morph"><TypeText className="contact-morph__current" text="the right thing." /><TypeText className="contact-morph__next" text="the best." /></span></h2></div><a className="contact-button" href="https://www.linkedin.com/in/pelayo-trives-pozuelo/">Start a conversation <ArrowUpRight className="icon-arrow" aria-hidden="true" /></a></section>
      </main>
      <footer><span>© 2026 Pelayo Trives</span><a data-back-to-top href="#top">Back to top <ArrowUp className="icon-arrow" aria-hidden="true" /></a></footer>
      {selectedProject && <ProjectViewer project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </div>
  )
}

export default App
