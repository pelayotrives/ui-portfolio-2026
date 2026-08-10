/* Hallmark · pre-emit critique: P5 H5 E4 S5 R4 V5
 * macrostructure: Workbench · genre: editorial-playful · theme: Studio
 * audience: recruiters, studios and agencies · use: visual selection + contact
 */
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Lenis from 'lenis'
import './App.css'

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
    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)
    const context = gsap.context(() => {
      gsap.from('.site-nav, .hero__eyebrow, .hero h1, .hero__aside, .hero__scroll', {
        y: 28, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out',
      })
      gsap.from('.project-card', {
        y: 40, opacity: 0, duration: 0.9, stagger: 0.1, delay: 0.35, ease: 'power3.out',
      })
    }, pageRef)

    const cursor = document.querySelector<HTMLElement>('.cursor')
    const cursorTrails = gsap.utils.toArray<HTMLElement>('.cursor-trail')
    const hasPointer = window.matchMedia('(pointer: fine)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let onMove: ((event: PointerEvent) => void) | undefined
    let onOver: ((event: PointerEvent) => void) | undefined

    if (cursor && hasPointer && !prefersReducedMotion) {
      const moveX = gsap.quickTo(cursor, 'x', { duration: 0.24, ease: 'power3.out' })
      const moveY = gsap.quickTo(cursor, 'y', { duration: 0.24, ease: 'power3.out' })
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
      }
      onOver = (event: PointerEvent) => {
        const target = event.target as HTMLElement
        cursor.classList.toggle('cursor--interactive', Boolean(target.closest('a, button')))
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerover', onOver)
    }

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      context.revert()
      if (onMove) window.removeEventListener('pointermove', onMove)
      if (onOver) window.removeEventListener('pointerover', onOver)
    }
  }, [])

  return (
    <div className="site-shell" ref={pageRef}>
      <div className="cursor-trails" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <span className="cursor-trail" key={index} />)}</div>
      <div className="cursor" aria-hidden="true"><span /><b>✳</b></div>
      <header className="site-nav">
        <a className="wordmark" href="#top" aria-label="Pelayo Trives, back to top">PT<span>.</span></a>
        <p className="nav-note">UI designer<br />based in Madrid / Kyoto</p>
        <nav aria-label="Main navigation">
          <a href="#work">Selected work</a>
          <a href="#about">About</a>
          <a className="nav-contact" href="mailto:hello@pelayotrives.com">Let's talk <span>↗</span></a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__eyebrow"><span className="dot" /> Portfolio / 2026</div>
          <h1 id="hero-title">Interfaces with<br /><em>something</em> to say.</h1>
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
          <div className="about-copy"><h2 id="about-title">Hi, I’m Pelayo Trives<span>.</span></h2><p className="about-lede">A UI designer interested in the space between a good idea and the moment it clicks.</p><p>I work in Figma from the first slightly-too-rough sketch to the final tiny transition. I like systems that leave room for personality, and interfaces that reward a second look.</p><a className="text-link" href="https://linkedin.com/pelayo-trives-pozuelo">More about me <span>↗</span></a></div>
          <div className="about-orbit" aria-hidden="true"><div className="orbit orbit--outer" /><div className="orbit orbit--inner" /><span>✳</span><small>always<br />curious</small></div>
        </section>

        <section className="contact-section" aria-labelledby="contact-title"><p className="contact-kicker">Have a good project?</p><h2 id="contact-title">Let’s make<br /><em>the right thing.</em></h2><a className="contact-button" href="https://www.linkedin.com/in/pelayo-trives-pozuelo/">Start a conversation <span>↗</span></a></section>
      </main>
      <footer><span>© 2026 Pelayo Trives</span><span>Designed in Figma, built with care.</span><a href="#top">Back to top ↑</a></footer>
    </div>
  )
}

export default App
