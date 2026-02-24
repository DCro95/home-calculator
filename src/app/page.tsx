'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'

// ── Feature sections (Maze-style: left headline + right cards) ──────────────
const SECTIONS = [
  {
    num: '01',
    headline: 'Know your true\ntake-home pay\nbefore you buy',
    cards: [
      {
        icon: '💰',
        title: 'Income & Tax Engine',
        body: 'Enter salaries, bonuses, and rental income for both borrowers. Select your state and filing status — the engine calculates your exact 2025 federal brackets, state income tax, and FICA in real time.',
      },
      {
        icon: '🎯',
        title: 'Max Borrowing Power',
        body: 'See your maximum affordable home price under three methods: 28% front-end DTI, 45% back-end DTI, and 30% of net income. Your target price is plotted against all three with a color-coded status bar.',
      },
      {
        icon: '⚖️',
        title: '50 / 30 / 20 Rule',
        body: 'Your income is mapped onto the 50/30/20 framework — Needs, Wants, and Savings — with animated progress bars showing exactly where you stand against each target.',
      },
    ],
  },
  {
    num: '02',
    headline: 'Model any mortgage\nscenario in\nseconds',
    cards: [
      {
        icon: '🏠',
        title: 'Full PITI Calculator',
        body: 'Input home price, down payment %, loan type (Fixed or 7/1 ARM), and term (10–30 yrs). Get your complete monthly PITI instantly — including PMI if under 20% down and local millage override.',
      },
      {
        icon: '📅',
        title: 'Amortization Table',
        body: 'View every payment broken into principal vs. interest with running balance. Add an extra principal payment and watch two schedules appear side by side — see years saved and total interest avoided.',
      },
      {
        icon: '🏡',
        title: 'Sell & Move Up',
        body: 'Already own a home? Enter your value, remaining mortgage, and selling costs. The app calculates your net equity and lets you apply it as a down payment — showing your new PITI vs. current payment.',
      },
    ],
  },
  {
    num: '03',
    headline: 'Stress-test your\nfull financial\npicture',
    cards: [
      {
        icon: '📊',
        title: 'Complete Budget',
        body: '27 expense categories covering every obligated debt and discretionary line item. Home maintenance is auto-estimated at 1% of purchase price. See your monthly surplus or shortfall updated live.',
      },
      {
        icon: '📈',
        title: 'Invest vs Pay Down',
        body: 'Should you put extra cash toward your mortgage or invest in the market? Enter an amount and expected return — the app compares guaranteed interest savings vs. projected portfolio growth year by year.',
      },
      {
        icon: '📄',
        title: 'Full PDF Report',
        body: 'Download a professional report covering every section: income, mortgage, ratios, budget, equity analysis, and 50/30/20. Professional enough to bring to a lender meeting.',
      },
    ],
  },
]

// ── Particle Sphere ──────────────────────────────────────────────────────────
function ParticleSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let t = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const N = 1200
    const golden = Math.PI * (3 - Math.sqrt(5))
    const pts: { x: number; y: number; z: number }[] = []
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = golden * i
      pts.push({ x: r * Math.cos(theta), y, z: r * Math.sin(theta) })
    }

    // Pre-assign magenta flag per point (stable, not per frame)
    const isMagenta = pts.map(() => Math.random() < 0.055)

    const draw = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)

      const R = Math.min(W, H) * 0.44
      const cx = W / 2
      const cy = H / 2
      const rotX = t * 0.14
      const rotY = t * 0.09

      const cosX = Math.cos(rotX), sinX = Math.sin(rotX)
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY)

      const projected = pts.map((p, idx) => {
        const x1 = p.x * cosY - p.z * sinY
        const z1 = p.x * sinY + p.z * cosY
        const y2 = p.y * cosX - z1 * sinX
        const z2 = p.y * sinX + z1 * cosX
        const sc = R / (R + z2 * 0.22 + 1)
        return { sx: cx + x1 * R * sc, sy: cy + y2 * R * sc, depth: (z2 + 1) / 2, z: z2, magenta: isMagenta[idx] }
      })

      projected.sort((a, b) => a.z - b.z)

      for (const p of projected) {
        const opacity = 0.1 + p.depth * 0.75
        const sz = 0.55 + p.depth * 1.5
        let rr, gg, bb
        if (p.magenta) {
          rr = 180; gg = 50; bb = 210
        } else {
          rr = 30 + Math.round(p.depth * 50)
          gg = 150 + Math.round(p.depth * 80)
          bb = 200 + Math.round(p.depth * 30)
        }
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, sz, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rr},${gg},${bb},${opacity})`
        ctx.fill()
      }

      t += 0.0022
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />
}

// ── Progress bar (Maze-style) ─────────────────────────────────────────────────
function SectionProgress({ active, total, onChange }: { active: number; total: number; onChange: (i: number) => void }) {
  return (
    <div style={{
      position: 'absolute', top: 52, left: 0, right: 0, zIndex: 50,
      display: 'flex', alignItems: 'center',
      padding: '0 40px', height: 36,
      borderBottom: '1px dashed rgba(255,255,255,0.07)',
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <button onClick={() => onChange(i)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
            color: active === i ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.2)',
            padding: '0 10px 0 0', transition: 'color 0.3s',
          }}>
            {String(i + 1).padStart(2, '0')}
          </button>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)', position: 'relative' }}>
            {active === i && (
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: 9, height: 9, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7b9ff5, #c084fc)',
                boxShadow: '0 0 14px rgba(160,100,255,0.7)',
                transition: 'left 0.4s ease',
              }} />
            )}
          </div>
        </div>
      ))}
      <button onClick={() => onChange(total - 1)} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
        color: active === total - 1 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.2)',
        padding: '0 0 0 10px', transition: 'color 0.3s',
      }}>
        {String(total).padStart(2, '0')}
      </button>
    </div>
  )
}

// ── Feature card ──────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, body, delay = 0 }: { icon: string; title: string; body: string; delay?: number }) {
  return (
    <div style={{
      padding: '16px 18px', borderRadius: 8,
      background: 'rgba(12,18,34,0.75)',
      border: '1px solid rgba(255,255,255,0.07)',
      backdropFilter: 'blur(8px)',
      animation: `slideIn 0.4s ease ${delay}s both`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 7, flexShrink: 0,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e4eeee', marginBottom: 5, letterSpacing: '-0.01em' }}>{title}</div>
          <div style={{ fontSize: 11.5, color: 'rgba(170,195,195,0.5)', lineHeight: 1.65 }}>{body}</div>
        </div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeSection, setActiveSection] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const throttleRef = useRef(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleWheel = useCallback((e: WheelEvent) => {
    const panel = panelRef.current
    if (!panel) return
    const rect = panel.getBoundingClientRect()
    // Only intercept when panel fills the viewport
    if (rect.top > 40 || rect.bottom < window.innerHeight - 40) return

    if (e.deltaY > 0 && activeSection < SECTIONS.length - 1) {
      e.preventDefault()
      if (throttleRef.current) return
      throttleRef.current = true
      setActiveSection(s => s + 1)
      setTimeout(() => { throttleRef.current = false }, 700)
    } else if (e.deltaY < 0 && activeSection > 0) {
      e.preventDefault()
      if (throttleRef.current) return
      throttleRef.current = true
      setActiveSection(s => s - 1)
      setTimeout(() => { throttleRef.current = false }, 700)
    }
  }, [activeSection])

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  const sec = SECTIONS[activeSection]

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0f1e',
      fontFamily: '"DM Sans","Helvetica Neue",Arial,sans-serif',
      color: '#d0d8d8', overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700;9..40,900&display=swap');
        @keyframes slideIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes blink   { 0%,100%{opacity:.55} 50%{opacity:.12} }
        @keyframes glow    { 0%,100%{opacity:.45;transform:scale(1)} 50%{opacity:.85;transform:scale(1.07)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:1px }
        ::-webkit-scrollbar-thumb { background:rgba(100,200,200,.15) }
        ::selection { background:#1a2f3a; color:#e0f4f4 }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: 52,
        borderBottom: '1px dashed rgba(255,255,255,0.08)',
        background: 'rgba(10,15,30,0.85)',
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>
          🏠 HomeCalc
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/login" style={{
            padding: '7px 16px', borderRadius: 6, fontSize: 12, fontWeight: 600,
            color: 'rgba(208,216,216,0.6)', textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color='#fff'; el.style.borderColor='rgba(255,255,255,0.28)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color='rgba(208,216,216,0.6)'; el.style.borderColor='rgba(255,255,255,0.1)' }}>
            Log In
          </Link>
          <Link href="/signup" style={{
            padding: '7px 16px', borderRadius: 6, fontSize: 12, fontWeight: 700,
            color: '#0a0f1e', background: '#d8f0ec', textDecoration: 'none', transition: 'background 0.2s',
          }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background='#fff')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background='#d8f0ec')}>
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative', height: '100svh',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0 }}><ParticleSphere /></div>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 64% 64% at 50% 50%, transparent 22%, #0a0f1e 76%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: 660 }}>
          <div style={{
            display: 'inline-block', marginBottom: 22, padding: '5px 14px', borderRadius: 20,
            border: '1px solid rgba(100,210,200,0.18)', background: 'rgba(100,210,200,0.05)',
            fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(130,215,205,0.7)',
          }}>
            Free for all 50 states + DC
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 6.5vw, 68px)', fontWeight: 900,
            lineHeight: 1.07, letterSpacing: '-0.04em', color: '#fff', marginBottom: 18,
          }}>
            Know exactly what<br />
            <span style={{
              background: 'linear-gradient(135deg, #6dd5c8 0%, #5bc4e8 45%, #8b9cf5 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              you can afford
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(13px,1.6vw,17px)', color: 'rgba(208,216,216,0.45)', lineHeight: 1.65, maxWidth: 460, margin: '0 auto 34px' }}>
            The most comprehensive home affordability calculator available.
            Taxes, mortgage, budget analysis, and investment comparison — all in one.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{
              padding: '13px 28px', borderRadius: 8, background: '#d8f0ec', color: '#0a0f1e',
              fontSize: 14, fontWeight: 800, textDecoration: 'none', letterSpacing: '-0.02em',
              boxShadow: '0 0 32px rgba(100,210,200,0.18)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.background='#fff'; el.style.boxShadow='0 0 52px rgba(100,210,200,0.42)' }}
              onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.background='#d8f0ec'; el.style.boxShadow='0 0 32px rgba(100,210,200,0.18)' }}>
              Start Your Analysis →
            </Link>
            <Link href="/login" style={{
              padding: '13px 28px', borderRadius: 8, background: 'rgba(255,255,255,0.04)',
              color: 'rgba(208,216,216,0.5)', fontSize: 14, fontWeight: 500,
              textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.color='#fff'; el.style.background='rgba(255,255,255,0.08)' }}
              onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.color='rgba(208,216,216,0.5)'; el.style.background='rgba(255,255,255,0.04)' }}>
              I Have an Account
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position:'absolute', bottom:22, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:7, zIndex:10 }}>
          <span style={{ fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(208,216,216,0.22)' }}>Scroll Down</span>
          <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
            {[0,1,2].map(i=>(
              <div key={i} style={{ width:1, height:7, background:'rgba(100,210,200,0.3)', borderRadius:1, animation:`blink 1.5s ease-in-out ${i*0.22}s infinite` }}/>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAZE-STYLE SECTION PANEL ── */}
      <div
        ref={panelRef}
        style={{ position:'relative', height:'100svh', overflow:'hidden', borderTop:'1px dashed rgba(255,255,255,0.07)' }}
      >
        {/* Progress bar */}
        <SectionProgress active={activeSection} total={SECTIONS.length} onChange={setActiveSection} />

        {/* Sphere fills the background */}
        <div style={{ position:'absolute', inset:0 }}><ParticleSphere /></div>

        {/* Gradient: dark left & right, transparent center so sphere shows */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          background:'linear-gradient(to right, rgba(10,15,30,0.96) 0%, rgba(10,15,30,0.2) 40%, rgba(10,15,30,0.2) 60%, rgba(10,15,30,0.94) 100%)',
        }}/>

        {/* Main content */}
        <div style={{
          position:'absolute', inset:0, top:88,
          display:'grid', gridTemplateColumns:'1fr 1fr',
          alignItems:'center', padding:'0 48px', gap:32,
        }}>
          {/* LEFT — headline + controls */}
          <div key={`h${activeSection}`} style={{ animation:'fadeIn 0.4s ease both' }}>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(100,210,200,0.45)', marginBottom:18 }}>
              {sec.num}
            </div>
            <h2 style={{
              fontSize:'clamp(28px,3.6vw,52px)', fontWeight:900,
              letterSpacing:'-0.04em', lineHeight:1.08, color:'#fff', whiteSpace:'pre-line',
            }}>
              {sec.headline}
            </h2>

            {/* Dot indicators */}
            <div style={{ display:'flex', gap:8, marginTop:32 }}>
              {SECTIONS.map((_,i)=>(
                <button key={i} onClick={()=>setActiveSection(i)} style={{
                  width: i===activeSection ? 22 : 6, height:6, borderRadius:3,
                  background: i===activeSection ? 'linear-gradient(90deg,#6dd5c8,#8b9cf5)' : 'rgba(255,255,255,0.14)',
                  border:'none', cursor:'pointer', padding:0, transition:'all 0.35s ease',
                }}/>
              ))}
            </div>

            {/* Arrows */}
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              {[{dir:'←', delta:-1}, {dir:'→', delta:1}].map(({dir,delta})=>{
                const disabled = delta < 0 ? activeSection===0 : activeSection===SECTIONS.length-1
                return (
                  <button key={dir}
                    onClick={()=>!disabled && setActiveSection(s=>s+delta)}
                    style={{
                      width:36, height:36, borderRadius:'50%', fontSize:15,
                      background: disabled ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.07)',
                      border:'1px solid rgba(255,255,255,0.1)',
                      color: disabled ? 'rgba(255,255,255,0.18)' : '#fff',
                      cursor: disabled ? 'default' : 'pointer',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      transition:'all 0.2s',
                    }}>
                    {dir}
                  </button>
                )
              })}
            </div>
          </div>

          {/* RIGHT — feature cards */}
          <div key={`c${activeSection}`} style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {sec.cards.map((card,i)=>(
              <FeatureCard key={card.title} {...card} delay={i*0.08}/>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM CTA ── */}
      <section style={{
        borderTop:'1px dashed rgba(255,255,255,0.07)',
        padding:'90px 36px', textAlign:'center', position:'relative', overflow:'hidden',
      }}>
        <div style={{
          position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
          width:500, height:220,
          background:'radial-gradient(ellipse, rgba(100,210,200,0.05) 0%, transparent 70%)',
          animation:'glow 5s ease-in-out infinite', pointerEvents:'none',
        }}/>
        <div style={{ position:'relative', zIndex:1 }}>
          <h2 style={{ fontSize:'clamp(26px,3.5vw,42px)', fontWeight:900, color:'#fff', letterSpacing:'-0.04em', marginBottom:14 }}>
            Ready to run the numbers?
          </h2>
          <p style={{ fontSize:14, color:'rgba(208,216,216,0.36)', marginBottom:34 }}>
            Free forever. No credit card required. Set up in 30 seconds.
          </p>
          <Link href="/signup" style={{
            display:'inline-flex', alignItems:'center', gap:8,
            padding:'14px 32px', borderRadius:8,
            background:'#d8f0ec', color:'#0a0f1e',
            fontSize:14, fontWeight:800, textDecoration:'none', letterSpacing:'-0.02em',
            boxShadow:'0 0 40px rgba(100,210,200,0.22)', transition:'all 0.2s',
          }}
            onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background='#fff';el.style.boxShadow='0 0 60px rgba(100,210,200,0.45)'}}
            onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background='#d8f0ec';el.style.boxShadow='0 0 40px rgba(100,210,200,0.22)'}}>
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop:'1px dashed rgba(255,255,255,0.07)',
        padding:'18px 40px',
        display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8,
      }}>
        <span style={{ fontSize:12, fontWeight:900, color:'rgba(208,216,216,0.22)', letterSpacing:'-0.02em' }}>🏠 HomeCalc</span>
        <span style={{ fontSize:10, color:'rgba(208,216,216,0.16)' }}>Not financial advice. Consult a licensed mortgage professional.</span>
        <span style={{ fontSize:10, color:'rgba(208,216,216,0.16)' }}>© 2026</span>
      </footer>
    </div>
  )
}
