import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowDown, ArrowRight, Expand, X } from 'lucide-react'
import { content } from './content'
import './styles.css'

const sectionIds = ['welcome', 'achievement', 'message', 'moments', 'dua', 'finale']
const ScrollButton = ({ target, children, className = '' }) => <button className={`button ${className}`} onClick={() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })}>{children}<ArrowRight size={17} /></button>

function Progress() {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && setCurrent(sectionIds.indexOf(e.target.id))), { threshold: .5 })
    sectionIds.forEach(id => observer.observe(document.getElementById(id)))
    return () => observer.disconnect()
  }, [])
  return <aside className="progress" aria-label="Page progress"><span>0{current + 1} / 06</span><div className="progress-dots">{sectionIds.map((id, i) => <button key={id} aria-label={`Go to section ${i + 1}`} className={i === current ? 'active' : ''} onClick={() => document.getElementById(id).scrollIntoView({behavior:'smooth'})} />)}</div></aside>
}

function Hero() { return <section id="welcome" className="screen hero"><div className="glow glow-one"/><div className="eyebrow reveal">A small gift, made with love</div><h1 className="reveal delay-1">Zainab… <i>🤍</i></h1><p className="hero-statement reveal delay-2">I have something for you.</p><p className="muted reveal delay-3">And I really wish I could have given it to you in person.</p><ScrollButton target="achievement" className="reveal delay-4">See what I have for you</ScrollButton><ArrowDown className="scroll-hint" size={18}/></section> }

function Achievement() { return <section id="achievement" className="screen achievement"><div className="section-inner"><div className="ornament">✦</div><p className="eyebrow">A moment to remember</p><h2>Congratulations,<br/><em>Mallama!</em></h2><div className="medal">🥈 <strong>2<sup>ND</sup> PLACE</strong></div><p className="competition">46th King Abdulaziz<br/>International Qur’an Competition</p><div className="journey"><span>🇬🇭 Ghana</span><b>⌄</b><span>📖 The Qur’an</span><b>⌄</b><span>🇸🇦 Saudi Arabia</span></div><blockquote>“Look how far the Qur’an has taken you.”</blockquote></div></section> }

function PersonalMessage() { return <section id="message" className="screen message"><div className="letter"><span className="letter-mark">❦</span><p className="eyebrow">From my heart to yours</p><h2>A little message<br/>for you…</h2><div className="letter-text">{content.personalMessage.map((p, i) => <p key={i}>{p}</p>)}</div></div></section> }

function Gallery() { const [open, setOpen] = useState(null); useEffect(() => { const close = e => e.key === 'Escape' && setOpen(null); addEventListener('keydown', close); return () => removeEventListener('keydown', close) }, []); return <section id="moments" className="screen moments"><div className="gallery-heading"><div><p className="eyebrow">The journey, in moments</p><h2>A few moments of<br/><em>a beautiful journey…</em></h2></div><p className="gallery-note">Four little windows into a moment worth remembering.</p></div><div className="gallery-frame"><div className="gallery">{content.photos.map((photo, i) => <button className={`photo photo-${i + 1}`} key={photo.src} onClick={() => setOpen(photo)} aria-label={`Expand photo: ${photo.alt}`}><img src={photo.src} alt={photo.alt}/><span className="photo-action"><Expand size={17}/></span>{i === 0 && <span className="photo-label">A beautiful journey <b>01 — 04</b></span>}</button>)}</div><p className="tap-hint"><span>✦</span> Tap a memory to see it closer</p></div>{open && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Expanded photograph" onClick={() => setOpen(null)}><button className="close" aria-label="Close photograph" onClick={() => setOpen(null)}><X/></button><img src={open.src} alt={open.alt} onClick={e => e.stopPropagation()}/></div>}</section> }

function Dua() { return <section id="dua" className="screen dua"><div className="dua-light"/><div className="dua-content"><p className="eyebrow">A prayer carried with love</p><h2>And now, a du’a<br/><em>for you… 🤲🏽</em></h2><p className="arabic" lang="ar" dir="rtl">{content.duaArabic}</p><p className="translation">O Allah, make the Qur’an the spring of her heart, the light of her chest, and her companion throughout her journey. Raise her through it in this world and the Hereafter.</p><div className="dua-rule"/><p className="personal-dua">May Allah make the Qur’an a proof for you, not against you. May He make you among its people and His special ones, and allow you to continue carrying His Book with sincerity, humility and excellence. Ameen. 🤍</p></div></section> }

function FallingStars() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current, context = canvas.getContext('2d'), reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame, last = performance.now(), width = 0, height = 0, stars = [], spawn = 0
    const resize = () => { const ratio = Math.min(devicePixelRatio || 1, 2); width = innerWidth; height = innerHeight; canvas.width = width * ratio; canvas.height = height * ratio; canvas.style.width = `${width}px`; canvas.style.height = `${height}px`; context.setTransform(ratio, 0, 0, ratio, 0, 0) }
    const star = (start = false) => ({ x: Math.random() * width, y: start ? Math.random() * height : -12 - Math.random() * height * .2, size: .7 + Math.random() * 2.1, speed: 16 + Math.random() * 29, drift: (Math.random() - .5) * 13, phase: Math.random() * Math.PI * 2, alpha: .23 + Math.random() * .48, cross: Math.random() > .78 })
    const draw = (s, time) => { const shimmer = .74 + Math.sin(time / 850 + s.phase) * .26; context.save(); context.globalAlpha = s.alpha * shimmer; context.fillStyle = '#fff5d7'; context.shadowColor = '#d8b66c'; context.shadowBlur = s.size * 5; if (s.cross) { context.beginPath(); context.moveTo(s.x, s.y - s.size * 2.4); context.lineTo(s.x + s.size * .46, s.y - s.size * .46); context.lineTo(s.x + s.size * 2.4, s.y); context.lineTo(s.x + s.size * .46, s.y + s.size * .46); context.lineTo(s.x, s.y + s.size * 2.4); context.lineTo(s.x - s.size * .46, s.y + s.size * .46); context.lineTo(s.x - s.size * 2.4, s.y); context.lineTo(s.x - s.size * .46, s.y - s.size * .46); context.closePath(); context.fill() } else { context.beginPath(); context.arc(s.x, s.y, s.size, 0, Math.PI * 2); context.fill() } context.restore() }
    const paintStatic = () => { stars = Array.from({ length: Math.max(14, Math.floor(width / 72)) }, () => star(true)); context.clearRect(0, 0, width, height); stars.forEach(s => draw(s, 0)) }
    const animate = time => { const delta = Math.min((time - last) / 1000, .05); last = time; spawn += delta; if (spawn > .14 && stars.length < 48) { stars.push(star()); spawn = 0 } stars.forEach(s => { s.y += s.speed * delta; s.x += (s.drift + Math.sin(time / 1500 + s.phase) * 5) * delta }); stars = stars.filter(s => s.y < height + 15); context.clearRect(0, 0, width, height); stars.forEach(s => draw(s, time)); frame = requestAnimationFrame(animate) }
    resize(); addEventListener('resize', resize); if (reduced) paintStatic(); else { stars = Array.from({ length: 12 }, () => star(true)); frame = requestAnimationFrame(animate) }
    return () => { cancelAnimationFrame(frame); removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="falling-stars" aria-hidden="true" />
}

function Finale() { const [opened, setOpened] = useState(false); return <section id="finale" className={`screen finale ${opened ? 'opened' : ''}`}>{opened && <FallingStars/>}<div className="final-content">{!opened ? <><p className="eyebrow">There’s still more</p><h2>One last thing…</h2><button className="button" onClick={() => setOpened(true)}>Open it <span>🤍</span></button></> : <div className="final-letter"><span className="letter-mark">✦</span><p>You thought that was all? 😂</p><p>I couldn’t be there physically, so I had to compensate somehow.</p><p>Congratulations once again, Mallama.</p><p>May Allah continue to raise you through the Qur’an, protect you wherever it takes you, and make you a source of goodness for everyone whose life you touch.</p><p className="proud">I’m so proud of you. 🤍</p><p className="signature">— From your friend who couldn’t make it home for the celebration</p><div className="closing"><strong>Congratulations, Zainab.</strong><span>May Allah take you even further. 🤍</span></div></div>}</div></section> }

function App(){ return <main><Progress/><Hero/><Achievement/><PersonalMessage/><Gallery/><Dua/><Finale/></main> }
createRoot(document.getElementById('root')).render(<App />)
