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

function ProjectArtwork({ project }: { project: Project }) {
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
    let loaderCancelled = false
    const context = gsap.context(() => {
      const loader = document.querySelector<HTMLElement>('.intro-loader')
      const canvasHost = document.querySelector<HTMLElement>('.intro-loader__canvas')
      const messages = gsap.utils.toArray<HTMLElement>('.intro-loader__message')
      const loaderProgress = { value: 0 }
      if (loader && canvasHost && !prefersReducedMotion) {
        import('three').then((THREE) => {
        if (loaderCancelled || !loader.isConnected) return
        const scene = new THREE.Scene()
        const camera = new THREE.OrthographicCamera(-4.4, 4.4, 2, -2, 0.1, 10)
        camera.position.z = 5
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        canvasHost.appendChild(renderer.domElement)
        const geometry = new THREE.PlaneGeometry(5.2, 2.8)
        const material = new THREE.ShaderMaterial({
          uniforms: { uProgress: { value: loaderProgress.value }, uTime: { value: 0 } },
          transparent: true,
          depthWrite: false,
          vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
          fragmentShader: `
            varying vec2 vUv;
            uniform float uProgress;
            uniform float uTime;
            float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
            void main() {
              vec2 p = vUv * 2.0 - 1.0;
              float outer = length(p) - 0.68;
              float inner = length(p - vec2(0.22, 0.0)) - 0.58;
              float moon = max(outer, -inner);
              float sdf = mix(outer, moon, smoothstep(0.18, 0.84, uProgress));
              float blur = 0.025 + 0.07 * sin(uProgress * 3.14159);
              float shape = 1.0 - smoothstep(-blur, blur, sdf);
              float glow = exp(-max(length(p) - 0.65, 0.0) * 7.0) * (1.0 - uProgress * 0.35);
              float rays = (sin(atan(p.y, p.x) * 12.0 + uTime * 0.8) * 0.5 + 0.5) * 0.06 * (1.0 - uProgress);
              vec3 sun = vec3(0.921, 0.369, 0.157);
              vec3 moonColor = vec3(1.0, 0.988, 0.949);
              vec3 color = mix(sun, moonColor, smoothstep(0.42, 0.92, uProgress));
              float alpha = max(shape, glow * 0.22 + rays * shape);
              gl_FragColor = vec4(color, alpha);
            }
          `,
        })
        const celestialBody = new THREE.Mesh(geometry, material)
        scene.add(celestialBody)
        const resize = () => renderer.setSize(canvasHost.clientWidth, canvasHost.clientHeight, false)
        resize()
        window.addEventListener('resize', resize)
        const clock = new THREE.Clock()
        renderer.setAnimationLoop(() => {
          const elapsed = clock.getElapsedTime()
          material.uniforms.uProgress.value = loaderProgress.value
          material.uniforms.uTime.value = elapsed
          celestialBody.rotation.z = Math.sin(elapsed * 0.7) * 0.04
          renderer.render(scene, camera)
        })
        disposeLoaderScene = () => {
          renderer.setAnimationLoop(null)
          window.removeEventListener('resize', resize)
          geometry.dispose()
          material.dispose()
          renderer.dispose()
          renderer.domElement.remove()
        }
        }).catch(() => undefined)
      }
      if (loader && !prefersReducedMotion) {
        const loaderTimeline = gsap.timeline({ onComplete: () => loader.setAttribute('aria-hidden', 'true') })
        messages.forEach((message, index) => {
          loaderTimeline
            .fromTo(message, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.38, ease: 'power3.out' }, index === 0 ? 0.15 : '+=0.18')
            .to(message, { autoAlpha: 0, y: -10, duration: 0.28, ease: 'power2.in' }, '+=0.58')
            .to(loaderProgress, { value: (index + 1) / messages.length, duration: 0.65, ease: 'power2.inOut' }, '<-0.12')
        })
        loaderTimeline.to(loader, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '+=0.08').call(() => disposeLoaderScene?.())
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
      gsap.to('.contact-star', { rotation: 360, ease: 'none', scrollTrigger: { trigger: '.contact-section', start: 'top bottom', end: 'bottom top', scrub: 2 } })
      gsap.fromTo('.contact-section', {
        '--contact-extra-height': '0svh', '--contact-offset': '0px', '--contact-top-extra': '0px',
      }, {
        '--contact-extra-height': '28svh', '--contact-offset': '-82px', '--contact-top-extra': '82px',
        ease: 'none', scrollTrigger: { trigger: '.contact-section', start: 'top 85%', end: 'top 10%', scrub: 1, invalidateOnRefresh: true },
      })
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
      loaderCancelled = true
      disposeLoaderScene?.()
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
        <a className="wordmark" href="#top" aria-label="Pelayo Trives, back to top">PT<span>.</span></a>
        <p className="nav-note">Product engineer<br />based in Kyoto</p>
        <nav aria-label="Main navigation">
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
          <div className="hero__scribble" aria-hidden="true">↝</div>
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
          <div className="about-copy"><h2 id="about-title">Hi, I’m Pelayo Trives<span>.</span></h2><p className="about-lede">A UI designer interested in the space between a good idea and the moment it clicks.</p><p>I work in Figma from the first slightly-too-rough sketch to the final tiny transition. I like systems that leave room for personality, and interfaces that reward a second look.</p><div className="timeline" aria-label="Education and experience timeline"><div className="timeline__track" /><div className="timeline__progress" /><div className="timeline__item"><span className="timeline__date">2023—Now</span><span className="timeline__dot" aria-hidden="true" /><div><h3>Culpass</h3><p>Full Stack Developer &amp; Technical Project Manager.</p></div></div><div className="timeline__item"><span className="timeline__date">2024—2026</span><span className="timeline__dot" aria-hidden="true" /><div><h3>VIU · Universidad Internacional de Valencia</h3><p>Master’s degree in Artificial Intelligence, Machine Learning and Computational Optimization.</p></div></div><div className="timeline__item"><span className="timeline__date">2023—2025</span><span className="timeline__dot" aria-hidden="true" /><div><h3>Luce Innovative Technologies</h3><p>Full Stack Developer.</p></div></div><div className="timeline__item"><span className="timeline__date">2023—2024</span><span className="timeline__dot" aria-hidden="true" /><div><h3>Kapturall</h3><p>Front-End Developer &amp; UX/UI Design Lead.</p></div></div><div className="timeline__item"><span className="timeline__date">2023</span><span className="timeline__dot" aria-hidden="true" /><div><h3>Vocento.Medios</h3><p>Front-End Developer for editorial and online publishing experiences.</p></div></div><div className="timeline__item"><span className="timeline__date">2018—2022</span><span className="timeline__dot" aria-hidden="true" /><div><h3>VIU · Universitat Oberta de Catalunya</h3><p>University degree in Multimedia.</p></div></div></div><a className="text-link" href="https://www.linkedin.com/in/pelayo-trives-pozuelo/">More about me <span>↗</span></a></div>
          <div className="about-orbit" aria-hidden="true"><div className="orbit orbit--outer" /><div className="orbit orbit--inner" /><span>✳</span><small>always<br />curious</small></div>
        </section>

        <section className="contact-section" aria-labelledby="contact-title"><div className="contact-star" aria-hidden="true">✳</div><p className="contact-kicker">Have a good project?</p><div className="contact-title-wrap"><h2 id="contact-title">Let’s make<br /><em>the right thing.</em></h2><h2 className="contact-title-glow" aria-hidden="true">Let’s make<br /><em>the right thing.</em></h2></div><a className="contact-button" href="https://www.linkedin.com/in/pelayo-trives-pozuelo/">Start a conversation <span>↗</span></a></section>
      </main>
      <footer><span>© 2026 Pelayo Trives</span><span>Designed in Figma, built with care.</span><a href="#top">Back to top ↑</a></footer>
    </div>
  )
}

export default App
