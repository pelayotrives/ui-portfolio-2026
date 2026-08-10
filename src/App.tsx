/* Hallmark · pre-emit critique: P5 H5 E4 S5 R4 V5
 * macrostructure: Workbench · genre: editorial-playful · theme: Studio
 * audience: recruiters, studios and agencies · use: visual selection + contact
 */
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Lenis from 'lenis'
import './App.css'

type Project = {
  number: string
  title: string
  kind: string
  year: string
  palette: string
  note: string
  className: string
}

const projects: Project[] = [
  { number: '01', title: 'Noma', kind: 'Digital product', year: '2025', palette: 'lime', note: 'Un espacio digital para volver a lo esencial.', className: 'project--noma' },
  { number: '02', title: 'Morrow', kind: 'Brand system', year: '2025', palette: 'apricot', note: 'Una identidad que se mueve con la conversación.', className: 'project--morrow' },
  { number: '03', title: 'Rastro', kind: 'Editorial experience', year: '2024', palette: 'blue', note: 'Archivo, memoria y cultura visual en capas.', className: 'project--rastro' },
  { number: '04', title: 'Vela', kind: 'Mobile experience', year: '2024', palette: 'red', note: 'Pequeños rituales para grandes días.', className: 'project--vela' },
  { number: '05', title: 'Punto', kind: 'Campaign direction', year: '2023', palette: 'violet', note: 'La pausa también puede ser una decisión.', className: 'project--punto' },
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
  const [filter, setFilter] = useState('All work')
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
    return () => { cancelAnimationFrame(frame); lenis.destroy(); context.revert() }
  }, [])

  const visibleProjects = filter === 'All work' ? projects : projects.filter((project) => project.kind === filter)

  return (
    <div className="site-shell" ref={pageRef}>
      <header className="site-nav">
        <a className="wordmark" href="#top" aria-label="Pelayo Trives, volver al inicio">PT<span>.</span></a>
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
          <div className="filters" aria-label="Filter projects">
            {['All work', 'Digital product', 'Brand system', 'Editorial experience'].map((item) => (
              <button key={item} className={filter === item ? 'filter filter--active' : 'filter'} onClick={() => setFilter(item)}>{item}</button>
            ))}
          </div>
          <div className="project-grid">
            {visibleProjects.map((project, index) => (
              <article className={`project-card project-card--${index + 1}`} key={project.number}>
                <a href={`#project-${project.number}`} className="project-card__link" aria-label={`Ver caso de estudio ${project.title}`}>
                  <ProjectArtwork project={project} />
                  <div className="project-card__meta"><span>{project.number} / {project.kind}</span><span>{project.year} <b>↗</b></span></div>
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
