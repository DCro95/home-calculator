'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'

const SECTIONS = [
  {
    num: '01',
    headline: 'Know your true take-home pay before you buy',
    cards: [
      { icon: '💰', title: 'Income & Tax Engine', body: 'Enter salaries, bonuses, and rental income for both borrowers. Select your state and filing status — the engine calculates your exact 2025 federal brackets, state income tax, and FICA in real time.' },
      { icon: '🎯', title: 'Max Borrowing Power', body: 'See your maximum affordable home price under three methods: 28% front-end DTI, 45% back-end DTI, and 30% of net income. Your target price is plotted against all three with a color-coded status bar.' },
      { icon: '⚖️', title: '50 / 30 / 20 Rule', body: 'Your income is mapped onto the 50/30/20 framework — Needs, Wants, and Savings — with animated progress bars showing exactly where you stand against each target.' },
    ],
  },
  {
    num: '02',
    headline: 'Model any mortgage scenario in seconds',
    cards: [
      { icon: '🏠', title: 'Full PITI Calculator', body: 'Input home price, down payment %, loan type (Fixed or 7/1 ARM), and term (10–30 yrs). Get your complete monthly PITI instantly — including PMI if under 20% down and local millage override.' },
      { icon: '📅', title: 'Amortization Table', body: 'View every payment broken into principal vs. interest with running balance. Add an extra principal payment and watch two schedules appear side by side — see years saved and total interest avoided.' },
      { icon: '🏡', title: 'Sell & Move Up', body: 'Already own a home? Enter your value, remaining mortgage, and selling costs. The app calculates your net equity and lets you apply it as a down payment — showing your new PITI vs. current payment.' },
    ],
  },
  {
    num: '03',
    headline: 'Stress-test your full financial picture',
    cards: [
      { icon: '📊', title: 'Complete Budget', body: '27 expense categories covering every obligated debt and discretionary line item. Home maintenance is auto-estimated at 1% of purchase price. See your monthly surplus or shortfall updated live.' },
      { icon: '📈', title: 'Invest vs Pay Down', body: 'Should you put extra cash toward your mortgage or invest in the market? Enter an amount and expected return — the app compares guaranteed interest savings vs. projected portfolio growth year by year.' },
      { icon: '📄', title: 'Full PDF Report', body: 'Download a professional report covering every section: income, mortgage, ratios, budget, equity analysis, and 50/30/20. Professional enough to bring to a lender meeting.' },
    ],
  },
]

// ── Particle sphere ───────────────────────────────────────────────────────────
function ParticleSphere({ particleCount = 1200 }: { particleCount?: number }) {
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

    const golden = Math.PI * (3 - Math.sqrt(5))
    const pts: { x: number; y: number; z: number }[] = []
    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = golden * i
      pts.push({ x: r * Math.cos(theta), y, z: r * Math.sin(theta) })
    }
    const isMag = pts.map(() => Math.random() < 0.055)

    const draw = () => {
      const W = canvas.offsetWidth, H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)
      const R = Math.min(W, H) * 0.44
      const cx = W / 2, cy = H / 2
      const cosX = Math.cos(t * 0.14), sinX = Math.sin(t * 0.14)
      const cosY = Math.cos(t * 0.09), sinY = Math.sin(t * 0.09)

      const proj = pts.map((p, idx) => {
        const x1 = p.x * cosY - p.z * sinY
        const z1 = p.x * sinY + p.z * cosY
        const y2 = p.y * cosX - z1 * sinX
        const z2 = p.y * sinX + z1 * cosX
        const sc = R / (R + z2 * 0.22 + 1)
        return { sx: cx + x1 * R * sc, sy: cy + y2 * R * sc, depth: (z2 + 1) / 2, z: z2, mag: isMag[idx] }
      })
      proj.sort((a, b) => a.z - b.z)

      for (const p of proj) {
        const op = 0.1 + p.depth * 0.75
        const sz = 0.55 + p.depth * 1.5
        const rr = p.mag ? 180 : 30 + Math.round(p.depth * 50)
        const gg = p.mag ? 50  : 150 + Math.round(p.depth * 80)
        const bb = p.mag ? 210 : 200 + Math.round(p.depth * 30)
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, sz, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rr},${gg},${bb},${op})`
        ctx.fill()
      }
      t += 0.0022
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [particleCount])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />
}

// ── Progress bar — FIXED (no duplicate last number) ──────────────────────────
function SectionProgress({ active, total, onChange }: { active: number; total: number; onChange: (i: number) => void }) {
  return (
    <div style={{
      position: 'absolute', top: 52, left: 0, right: 0, zIndex: 50,
      display: 'flex', alignItems: 'center',
      padding: '0 16px', height: 36,
      borderBottom: '1px dashed rgba(255,255,255,0.07)',
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
          {/* Number */}
          <button onClick={() => onChange(i)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
            color: active === i ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.22)',
            padding: '0 8px 0 0', flexShrink: 0, transition: 'color 0.3s',
          }}>
            {String(i + 1).padStart(2, '0')}
          </button>
          {/* Track — only between sections, not after the last */}
          {i < total - 1 && (
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)', position: 'relative', minWidth: 0 }}>
              {active === i && (
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#7b9ff5,#c084fc)',
                  boxShadow: '0 0 12px rgba(160,100,255,0.7)',
                }} />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Feature card ──────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, body, delay = 0 }: { icon: string; title: string; body: string; delay?: number }) {
  return (
    <div style={{
      padding: '14px 16px', borderRadius: 8,
      background: 'rgba(12,18,34,0.82)',
      border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(10px)',
      animation: `slideIn 0.35s ease ${delay}s both`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 7, flexShrink: 0,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.09)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e4eeee', marginBottom: 4, letterSpacing: '-0.01em' }}>{title}</div>
          <div style={{ fontSize: 11.5, color: 'rgba(170,195,195,0.55)', lineHeight: 1.6 }}>{body}</div>
        </div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeSection, setActiveSection] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const throttleRef = useRef(false)

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Desktop scroll-to-advance
  const handleWheel = useCallback((e: WheelEvent) => {
    if (isMobile) return
    const panel = panelRef.current
    if (!panel) return
    const rect = panel.getBoundingClientRect()
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
  }, [activeSection, isMobile])

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
        @keyframes slideIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes blink   { 0%,100%{opacity:.5} 50%{opacity:.1} }
        @keyframes glow    { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.8;transform:scale(1.06)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:1px }
        ::-webkit-scrollbar-thumb { background:rgba(100,200,200,.15) }
        ::selection { background:#1a2f3a; color:#e0f4f4 }
      `}</style>

      {/* ════════ NAV ════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '0 16px' : '0 40px', height: 52,
        borderBottom: '1px dashed rgba(255,255,255,0.08)',
        background: 'rgba(10,15,30,0.9)', backdropFilter: 'blur(16px)',
      }}>
        <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>
          🏠 HomeCalc
        </div>
        <div style={{ display: 'flex', gap: isMobile ? 6 : 8 }}>
          <Link href="/login" style={{
            padding: isMobile ? '6px 12px' : '7px 16px',
            borderRadius: 6, fontSize: isMobile ? 11 : 12, fontWeight: 600,
            color: 'rgba(208,216,216,0.6)', textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            Log In
          </Link>
          <Link href="/signup" style={{
            padding: isMobile ? '6px 12px' : '7px 16px',
            borderRadius: 6, fontSize: isMobile ? 11 : 12, fontWeight: 700,
            color: '#0a0f1e', background: '#d8f0ec', textDecoration: 'none',
          }}>
            {isMobile ? 'Sign Up' : 'Get Started Free'}
          </Link>
        </div>
      </nav>

      {/* ════════ HERO ════════ */}
      <section style={{
        position: 'relative', height: '100svh',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <ParticleSphere particleCount={isMobile ? 600 : 1200} />
        </div>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 20%, #0a0f1e 72%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'relative', zIndex: 10, textAlign: 'center',
          padding: isMobile ? '0 20px' : '0 24px',
          maxWidth: isMobile ? 380 : 660,
        }}>
          <div style={{
            display: 'inline-block', marginBottom: isMobile ? 16 : 22,
            padding: '5px 12px', borderRadius: 20,
            border: '1px solid rgba(100,210,200,0.18)', background: 'rgba(100,210,200,0.05)',
            fontSize: isMobile ? 9 : 11, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'rgba(130,215,205,0.7)',
          }}>
            Free for all 50 states + DC
          </div>

          <h1 style={{
            fontSize: isMobile ? '36px' : 'clamp(40px,6.5vw,68px)',
            fontWeight: 900, lineHeight: 1.07, letterSpacing: '-0.04em',
            color: '#fff', marginBottom: isMobile ? 14 : 18,
          }}>
            Know exactly what<br />
            <span style={{
              background: 'linear-gradient(135deg,#6dd5c8 0%,#5bc4e8 45%,#8b9cf5 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              you can afford
            </span>
          </h1>

          <p style={{
            fontSize: isMobile ? 13 : 'clamp(13px,1.6vw,17px)',
            color: 'rgba(208,216,216,0.45)', lineHeight: 1.65,
            maxWidth: isMobile ? 320 : 460, margin: `0 auto ${isMobile ? 24 : 34}px`,
          }}>
            The most comprehensive home affordability calculator available.
            Taxes, mortgage, budget &amp; investment comparison — all in one.
          </p>

          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 10 : 12, alignItems: 'center', justifyContent: 'center' }}>
            <Link href="/signup" style={{
              padding: isMobile ? '14px 0' : '13px 28px',
              width: isMobile ? '100%' : 'auto',
              borderRadius: 8, background: '#d8f0ec', color: '#0a0f1e',
              fontSize: isMobile ? 15 : 14, fontWeight: 800, textDecoration: 'none',
              letterSpacing: '-0.02em', textAlign: 'center',
              boxShadow: '0 0 32px rgba(100,210,200,0.18)',
            }}>
              Start Your Analysis →
            </Link>
            <Link href="/login" style={{
              padding: isMobile ? '13px 0' : '13px 28px',
              width: isMobile ? '100%' : 'auto',
              borderRadius: 8, background: 'rgba(255,255,255,0.04)',
              color: 'rgba(208,216,216,0.55)', fontSize: isMobile ? 14 : 14,
              fontWeight: 500, textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.09)', textAlign: 'center',
            }}>
              I Have an Account
            </Link>
          </div>
        </div>

        {/* Scroll cue — desktop only */}
        {!isMobile && (
          <div style={{ position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, zIndex: 10 }}>
            <span style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(208,216,216,0.22)' }}>Scroll Down</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 1, height: 7, background: 'rgba(100,210,200,0.3)', borderRadius: 1, animation: `blink 1.5s ease-in-out ${i*0.22}s infinite` }} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ════════ FEATURES — DESKTOP: sphere panel, MOBILE: stacked cards ════════ */}

      {/* ── MOBILE layout: simple stacked accordion ── */}
      {isMobile && (
        <div style={{ borderTop: '1px dashed rgba(255,255,255,0.07)', padding: '0 0 20px' }}>
          {/* Section tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px dashed rgba(255,255,255,0.07)',
            position: 'sticky', top: 52, zIndex: 40,
            background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(16px)',
          }}>
            {SECTIONS.map((s, i) => (
              <button key={i} onClick={() => setActiveSection(i)} style={{
                flex: 1, padding: '12px 0',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
                color: activeSection === i ? '#fff' : 'rgba(255,255,255,0.28)',
                borderBottom: `2px solid ${activeSection === i ? '#7b9ff5' : 'transparent'}`,
                transition: 'all 0.2s',
              }}>
                {s.num}
              </button>
            ))}
          </div>

          {/* Sphere — compact on mobile */}
          <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
            <ParticleSphere particleCount={500} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 20%, #0a0f1e 75%)',
              pointerEvents: 'none',
            }} />
            {/* Headline overlaid */}
            <div style={{
              position: 'absolute', bottom: 16, left: 16, right: 16, zIndex: 10,
              animation: 'fadeIn 0.35s ease both',
            }} key={`mh${activeSection}`}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(100,210,200,0.5)', marginBottom: 6 }}>
                {sec.num}
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#fff' }}>
                {sec.headline}
              </h2>
            </div>
          </div>

          {/* Cards */}
          <div key={`mc${activeSection}`} style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sec.cards.map((card, i) => (
              <FeatureCard key={card.title} {...card} delay={i * 0.07} />
            ))}
          </div>

          {/* Prev / Next */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 16px 0' }}>
            <button
              onClick={() => setActiveSection(s => Math.max(0, s - 1))}
              disabled={activeSection === 0}
              style={{
                padding: '10px 20px', borderRadius: 7, fontSize: 13, fontWeight: 700,
                background: activeSection === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: activeSection === 0 ? 'rgba(255,255,255,0.2)' : '#fff',
                cursor: activeSection === 0 ? 'default' : 'pointer',
              }}>
              ← Prev
            </button>
            <button
              onClick={() => setActiveSection(s => Math.min(SECTIONS.length - 1, s + 1))}
              disabled={activeSection === SECTIONS.length - 1}
              style={{
                padding: '10px 20px', borderRadius: 7, fontSize: 13, fontWeight: 700,
                background: activeSection === SECTIONS.length - 1 ? 'rgba(255,255,255,0.03)' : 'rgba(100,210,200,0.12)',
                border: `1px solid ${activeSection === SECTIONS.length - 1 ? 'rgba(255,255,255,0.08)' : 'rgba(100,210,200,0.25)'}`,
                color: activeSection === SECTIONS.length - 1 ? 'rgba(255,255,255,0.2)' : '#d8f0ec',
                cursor: activeSection === SECTIONS.length - 1 ? 'default' : 'pointer',
              }}>
              Next →
            </button>
          </div>
        </div>
      )}

      {/* ── DESKTOP layout: full-screen sphere panel ── */}
      {!isMobile && (
        <div
          ref={panelRef}
          style={{ position: 'relative', height: '100svh', overflow: 'hidden', borderTop: '1px dashed rgba(255,255,255,0.07)' }}
        >
          <SectionProgress active={activeSection} total={SECTIONS.length} onChange={setActiveSection} />
          <div style={{ position: 'absolute', inset: 0 }}><ParticleSphere /></div>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to right, rgba(10,15,30,0.96) 0%, rgba(10,15,30,0.15) 38%, rgba(10,15,30,0.15) 62%, rgba(10,15,30,0.96) 100%)',
          }} />

          <div style={{
            position: 'absolute', inset: 0, top: 88,
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            alignItems: 'center', padding: '0 48px', gap: 32,
          }}>
            {/* Left — headline */}
            <div key={`h${activeSection}`} style={{ animation: 'fadeIn 0.4s ease both' }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(100,210,200,0.45)', marginBottom: 18 }}>
                {sec.num}
              </div>
              <h2 style={{
                fontSize: 'clamp(28px,3.6vw,52px)', fontWeight: 900,
                letterSpacing: '-0.04em', lineHeight: 1.08, color: '#fff',
              }}>
                {sec.headline}
              </h2>
              <div style={{ display: 'flex', gap: 8, marginTop: 32 }}>
                {SECTIONS.map((_, i) => (
                  <button key={i} onClick={() => setActiveSection(i)} style={{
                    width: i === activeSection ? 22 : 6, height: 6, borderRadius: 3,
                    background: i === activeSection ? 'linear-gradient(90deg,#6dd5c8,#8b9cf5)' : 'rgba(255,255,255,0.14)',
                    border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.35s ease',
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                {[{ dir: '←', delta: -1 }, { dir: '→', delta: 1 }].map(({ dir, delta }) => {
                  const disabled = delta < 0 ? activeSection === 0 : activeSection === SECTIONS.length - 1
                  return (
                    <button key={dir}
                      onClick={() => !disabled && setActiveSection(s => s + delta)}
                      style={{
                        width: 36, height: 36, borderRadius: '50%', fontSize: 15,
                        background: disabled ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: disabled ? 'rgba(255,255,255,0.18)' : '#fff',
                        cursor: disabled ? 'default' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}>
                      {dir}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right — cards */}
            <div key={`c${activeSection}`} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sec.cards.map((card, i) => (
                <FeatureCard key={card.title} {...card} delay={i * 0.08} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════ CTA ════════ */}
      <section style={{
        borderTop: '1px dashed rgba(255,255,255,0.07)',
        padding: isMobile ? '60px 20px' : '90px 36px',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 400, height: 200,
          background: 'radial-gradient(ellipse, rgba(100,210,200,0.05) 0%, transparent 70%)',
          animation: 'glow 5s ease-in-out infinite', pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: isMobile ? 28 : 'clamp(26px,3.5vw,42px)',
            fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', marginBottom: 12,
          }}>
            Ready to run the numbers?
          </h2>
          <p style={{ fontSize: isMobile ? 13 : 14, color: 'rgba(208,216,216,0.36)', marginBottom: 28 }}>
            Free forever. No credit card required. Set up in 30 seconds.
          </p>
          <Link href="/signup" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: isMobile ? '14px 28px' : '14px 32px', borderRadius: 8,
            background: '#d8f0ec', color: '#0a0f1e',
            fontSize: isMobile ? 15 : 14, fontWeight: 800, textDecoration: 'none',
            letterSpacing: '-0.02em', boxShadow: '0 0 40px rgba(100,210,200,0.22)',
          }}>
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* ════════ LEGAL DISCLAIMER ════════ */}
      <section style={{
        borderTop: '1px dashed rgba(255,255,255,0.07)',
        padding: isMobile ? '32px 20px' : '48px 40px',
        background: 'rgba(6,10,20,0.6)',
      }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{
              display: 'inline-block', padding: '3px 10px', borderRadius: 4,
              background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)',
              fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'rgba(248,113,113,0.8)',
            }}>
              Legal Disclaimer
            </div>
          </div>

          {[
            <>
              <strong style={{ color: 'rgba(200,215,215,0.55)', fontWeight: 700 }}>IMPORTANT NOTICE — PLEASE READ CAREFULLY.</strong>{' '}
              HomeCalc (the &quot;Platform&quot;) and all computational outputs, projections, estimates, amortization schedules, tax calculations,
              debt-to-income analyses, investment comparisons, and related data generated thereby (collectively, the &quot;Outputs&quot;) are
              provided solely for <strong style={{ color: 'rgba(200,215,215,0.45)' }}>general informational and educational purposes</strong> and
              do <strong style={{ color: 'rgba(200,215,215,0.45)' }}>not</strong> constitute, and shall not be construed as constituting,
              financial advice, investment advice, mortgage advice, tax advice, legal advice, or any other form of professional advisory service
              regulated under applicable federal or state law.
            </>,
            <>
              All tax bracket data, standard deduction figures, FICA thresholds, state income tax rates, property tax averages,
              private mortgage insurance benchmarks, and interest rate assumptions reflected within the Platform are based upon
              publicly available information current as of the <strong style={{ color: 'rgba(200,215,215,0.45)' }}>2025 tax year</strong> and
              are subject to change without notice. State and local property tax rates represent <strong style={{ color: 'rgba(200,215,215,0.45)' }}>statewide averages only</strong> and
              may differ materially from the actual rate applicable to any specific parcel. Users are solely responsible for
              independently verifying all figures with the applicable taxing authority, mortgage lender, licensed real estate
              professional, and/or certified public accountant prior to making any financial decision.
            </>,
            <>
              THE PLATFORM IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW,
              THE OPERATOR EXPRESSLY DISCLAIMS ALL LIABILITY FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
              OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE PLATFORM OR RELIANCE ON ANY OUTPUT, INCLUDING ANY FINANCIAL LOSS.
            </>,
            <>
              Nothing herein establishes a fiduciary relationship or any professional advisory relationship.{' '}
              <strong style={{ color: 'rgba(200,215,215,0.45)' }}>You should always consult a licensed mortgage professional,
              CPA, Registered Investment Adviser, and/or real estate attorney</strong> before entering any financial commitment.
              Investment projections are purely hypothetical. Past performance of any index or asset class is not indicative
              of future results. By using this Platform you agree to be bound by the{' '}
              <Link href="/terms" style={{ color: 'rgba(100,210,200,0.6)', textDecoration: 'underline', textUnderlineOffset: 2 }}>
                Terms of Service
              </Link>.
            </>,
          ].map((para, i) => (
            <p key={i} style={{
              fontSize: isMobile ? 11 : 11, lineHeight: 1.85,
              color: 'rgba(180,195,195,0.38)', marginTop: i > 0 ? 12 : 0,
            }}>
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer style={{
        borderTop: '1px dashed rgba(255,255,255,0.07)',
        padding: isMobile ? '16px 20px' : '20px 40px',
        display: 'flex', flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? 8 : 10, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 12, fontWeight: 900, color: 'rgba(208,216,216,0.22)', letterSpacing: '-0.02em' }}>🏠 HomeCalc</span>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/terms" style={{ fontSize: 10, color: 'rgba(208,216,216,0.28)', textDecoration: 'none' }}>
            Terms of Service
          </Link>
          <span style={{ fontSize: 10, color: 'rgba(208,216,216,0.12)' }}>|</span>
          <span style={{ fontSize: 10, color: 'rgba(208,216,216,0.18)' }}>© 2026 HomeCalc. All rights reserved.</span>
        </div>
        <span style={{ fontSize: 10, color: 'rgba(208,216,216,0.16)' }}>For informational use only. Not financial advice.</span>
      </footer>
    </div>
  )
}
