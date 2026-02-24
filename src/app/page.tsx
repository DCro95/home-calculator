'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const FEATURES = [
  {
    icon: '💰',
    title: 'Income & Tax Engine',
    desc: 'Federal + state taxes for all 50 states',
    detail: 'Enter salaries, bonuses, rental income, side businesses, and investment income for both you and a co-borrower. Select your state and filing status (MFJ, Single, Head of Household) and the engine calculates your exact 2025 federal tax bracket, state income tax (flat, progressive, or none), and FICA (Social Security + Medicare). You get your true monthly take-home pay — the real number lenders care about.',
  },
  {
    icon: '🏦',
    title: 'Mortgage Analysis',
    desc: 'Fixed, ARM, any term — 10 to 30 years',
    detail: 'Model any loan scenario: 30-year fixed, 15-year fixed, 7/1 ARM, or any term from 10–30 years. Input the home price, down payment %, interest rate, and closing cost %. The app builds your complete monthly PITI — Principal, Interest, Property Tax (with local millage override), Homeowner\'s Insurance, and PMI if you\'re under 20% down. Every number updates instantly.',
  },
  {
    icon: '🏡',
    title: 'Sell & Move Up',
    desc: 'Apply your equity toward your next home',
    detail: 'Already own a home? Enter your current value, remaining mortgage, and estimated selling costs. The calculator finds your net equity after agent fees and closing costs, then lets you apply that equity as a down payment on your next purchase. See an instant side-by-side comparison of your current PITI vs. your new monthly payment — and exactly how much cash you\'ll need at closing.',
  },
  {
    icon: '📅',
    title: 'Amortization Table',
    desc: 'Month-by-month with extra payment impact',
    detail: 'View your full amortization schedule — every monthly payment broken down into principal vs. interest, with a running loan balance. Add an extra payment toward principal and watch two schedules appear side by side: the standard payoff and the accelerated payoff. See exactly how many years you\'re cutting off the loan and how much total interest you\'re saving — updated in real time as you type.',
  },
  {
    icon: '📈',
    title: 'Invest vs Pay Down',
    desc: 'Stock market comparison over loan life',
    detail: 'One of the most common financial dilemmas: should you put extra cash toward your mortgage, or invest it in the market? Enter an extra monthly amount and your expected annual return (the S&P 500 historically averages ~10%). The app compares guaranteed mortgage interest savings against projected portfolio growth year-by-year and declares a winner at your loan term end.',
  },
  {
    icon: '🎯',
    title: 'Max Borrowing Power',
    desc: 'What can you afford — gross AND net',
    detail: 'Instantly see three maximum home prices calculated three different ways: conservative 28% front-end DTI (PITI ≤ 28% of gross — the lender comfort zone), aggressive 45% back-end DTI (PITI + all debts ≤ 45% gross — conventional ceiling), and the real-world 30%-of-net-income rule. Your target home price is plotted against all three with a clear color-coded status bar.',
  },
  {
    icon: '📊',
    title: 'Full Budget + 50/30/20',
    desc: '27 expense categories, DTI ratios, rule analysis',
    detail: 'Enter all obligated debts (car payments, student loans, credit cards) and 27 discretionary expense categories (groceries, utilities, subscriptions, gym, gas, entertainment, and more). Home maintenance is auto-estimated at 1% of purchase price annually. A dedicated 50/30/20 tab then maps your actual numbers onto this framework — showing Needs, Wants, and Savings as a percentage of take-home with visual progress bars.',
  },
  {
    icon: '📄',
    title: 'Full PDF Reports',
    desc: 'Download professional reports for your lender',
    detail: 'Generate a comprehensive HTML report that includes every section of your analysis: income & tax breakdown, purchase details, monthly PITI, max borrowing power, cash flow summary, all four affordability ratios, sell & equity analysis, 50/30/20 budget breakdown, and pay-down vs. invest comparison. Open in any browser and Print → Save as PDF. Professional enough to bring to a lender meeting.',
  },
  {
    icon: '💾',
    title: 'Save Scenarios',
    desc: 'Compare multiple homes side-by-side',
    detail: 'Create a free account and save unlimited home scenarios to your personal dashboard. Each saved scenario stores the full state of every tab — income, mortgage, budget, extra payments — so you can switch between properties instantly without re-entering data. Name them, load them, delete them. Perfect when you\'re comparing two or three homes at the same time.',
  },
]

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

    const N = 900
    const R = Math.min(canvas.offsetWidth, canvas.offsetHeight) * 0.36

    // Golden ratio sphere distribution
    const pts: { x: number; y: number; z: number; phi: number; theta: number }[] = []
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = golden * i
      pts.push({ x: r * Math.cos(theta), y, z: r * Math.sin(theta), phi: 0, theta: 0 })
    }

    const draw = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)

      const cx = W / 2
      const cy = H / 2
      const rotX = t * 0.18
      const rotY = t * 0.12

      const cosX = Math.cos(rotX), sinX = Math.sin(rotX)
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY)

      const projected = pts.map((p) => {
        // Rotate Y
        const x1 = p.x * cosY - p.z * sinY
        const z1 = p.x * sinY + p.z * cosY
        // Rotate X
        const y2 = p.y * cosX - z1 * sinX
        const z2 = p.y * sinX + z1 * cosX

        const scale = R / (R + z2 * 0.3 + 1)
        const sx = cx + x1 * R * scale
        const sy = cy + y2 * R * scale
        const depth = (z2 + 1) / 2 // 0..1

        return { sx, sy, depth, z: z2 }
      })

      projected.sort((a, b) => a.z - b.z)

      for (const p of projected) {
        const opacity = 0.15 + p.depth * 0.7
        const size = 0.8 + p.depth * 1.2

        // Color: teal-cyan on left, purple-blue on right
        const nx = (p.sx - cx) / R
        const r = Math.round(80 + nx * 80)
        const g = Math.round(180 + p.depth * 40)
        const b = Math.round(220 - nx * 40)

        ctx.beginPath()
        ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${opacity})`
        ctx.fill()
      }

      t += 0.003
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
    />
  )
}

function FeatureCard({ f }: { f: typeof FEATURES[0] }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        padding: '20px 18px',
        borderRadius: '10px',
        background: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: hovered ? '1px solid rgba(100,210,200,0.3)' : '1px solid rgba(255,255,255,0.06)',
        cursor: 'default',
        transition: 'all 0.25s ease',
        overflow: 'hidden',
      }}
    >
      {/* Glow on hover */}
      {hovered && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 10,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(100,210,200,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      )}

      <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f4f4', marginBottom: 4, letterSpacing: '-0.01em' }}>{f.title}</div>

      {/* Default desc */}
      <div style={{
        fontSize: 11, color: '#6b7f7f', lineHeight: 1.5,
        transition: 'opacity 0.2s',
        opacity: hovered ? 0 : 1,
        position: hovered ? 'absolute' : 'relative',
      }}>
        {f.desc}
      </div>

      {/* Hover detail */}
      {hovered && (
        <div style={{
          fontSize: 11, color: '#9bbfbf', lineHeight: 1.65,
          animation: 'fadeUp 0.2s ease forwards',
        }}>
          {f.detail}
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1e',
      fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
      color: '#d0d8d8',
      overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 0.8; transform: scale(1.04); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 1px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(100,200,200,0.2); }
        ::selection { background: #1e3a3a; color: #e0f4f4; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 36px', height: 50,
        borderBottom: '1px dashed rgba(255,255,255,0.08)',
        background: scrolled ? 'rgba(10,15,30,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'background 0.3s',
      }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>
          🏠 HomeCalc
        </div>

        {/* Center links */}
        <div style={{ display: 'flex', gap: 32, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          {['Features', 'How It Works', 'Pricing', 'Contact'].map(l => (
            <span key={l} style={{ fontSize: 13, color: 'rgba(208,216,216,0.55)', cursor: 'pointer', transition: 'color 0.2s', letterSpacing: '-0.01em' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#d0d8d8')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(208,216,216,0.55)')}>
              {l}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/login" style={{
            padding: '7px 16px', borderRadius: 6, fontSize: 12, fontWeight: 600,
            color: 'rgba(208,216,216,0.7)', textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(208,216,216,0.7)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)' }}>
            Log In
          </Link>
          <Link href="/signup" style={{
            padding: '7px 16px', borderRadius: 6, fontSize: 12, fontWeight: 700,
            color: '#0a0f1e', background: '#e0f4f0', textDecoration: 'none',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#fff')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#e0f4f0')}>
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative', height: '100svh', display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Particle sphere */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <ParticleSphere />
        </div>

        {/* Radial vignette over sphere */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, transparent 30%, #0a0f1e 80%)',
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: 720 }}>
          <div style={{
            display: 'inline-block', padding: '5px 14px', borderRadius: 20,
            border: '1px solid rgba(100,210,200,0.25)',
            background: 'rgba(100,210,200,0.06)',
            fontSize: 11, fontWeight: 600, color: 'rgba(150,220,210,0.8)',
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 28,
          }}>
            Free for all 50 states + DC
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 7vw, 72px)',
            fontWeight: 900,
            lineHeight: 1.08,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            marginBottom: 20,
          }}>
            Know exactly what
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #6dd5c8 0%, #4bc8e8 50%, #7b9ff5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              you can afford
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(14px, 1.8vw, 17px)',
            color: 'rgba(208,216,216,0.55)',
            lineHeight: 1.65,
            maxWidth: 520,
            margin: '0 auto 36px',
            fontWeight: 400,
          }}>
            The most comprehensive home affordability calculator available.
            Taxes, mortgage, budget analysis, and investment comparison — all in one place.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', borderRadius: 8,
              background: '#e0f4f0', color: '#0a0f1e',
              fontSize: 14, fontWeight: 800, textDecoration: 'none',
              letterSpacing: '-0.02em',
              transition: 'all 0.2s',
              boxShadow: '0 0 30px rgba(100,210,200,0.2)',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#fff'; el.style.boxShadow = '0 0 50px rgba(100,210,200,0.4)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#e0f4f0'; el.style.boxShadow = '0 0 30px rgba(100,210,200,0.2)' }}>
              Start Your Analysis →
            </Link>
            <Link href="/login" style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '13px 28px', borderRadius: 8,
              background: 'transparent', color: 'rgba(208,216,216,0.6)',
              fontSize: 14, fontWeight: 500, textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#fff'; el.style.borderColor = 'rgba(255,255,255,0.25)'; el.style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'rgba(208,216,216,0.6)'; el.style.borderColor = 'rgba(255,255,255,0.1)'; el.style.background = 'transparent' }}>
              I Have an Account
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          zIndex: 10,
        }}>
          <span style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(208,216,216,0.3)', textTransform: 'uppercase' }}>
            Scroll Down
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 1, height: 8, background: 'rgba(100,210,200,0.4)',
                borderRadius: 1,
                animation: `blink 1.4s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{
        borderTop: '1px dashed rgba(255,255,255,0.07)',
        padding: '80px 36px 100px',
        maxWidth: 1100, margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{
            fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'rgba(100,210,200,0.6)', fontWeight: 600, marginBottom: 14,
          }}>
            Everything in one place
          </p>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900,
            color: '#fff', letterSpacing: '-0.035em', lineHeight: 1.1,
          }}>
            Built for every stage of
            <br />
            <span style={{ color: 'rgba(208,216,216,0.4)' }}>the home buying journey</span>
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(208,216,216,0.35)', marginTop: 14, letterSpacing: '-0.01em' }}>
            Hover any card to learn more
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 12,
        }}>
          {FEATURES.map(f => <FeatureCard key={f.title} f={f} />)}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{
        borderTop: '1px dashed rgba(255,255,255,0.07)',
        padding: '80px 36px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400, height: 200,
          background: 'radial-gradient(ellipse, rgba(100,210,200,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'pulse-slow 4s ease-in-out infinite',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 900,
            color: '#fff', letterSpacing: '-0.035em', marginBottom: 14,
          }}>
            Ready to run the numbers?
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(208,216,216,0.4)', marginBottom: 32 }}>
            Free forever. No credit card required. Set up in 30 seconds.
          </p>
          <Link href="/signup" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 8,
            background: '#e0f4f0', color: '#0a0f1e',
            fontSize: 14, fontWeight: 800, textDecoration: 'none',
            letterSpacing: '-0.02em',
            boxShadow: '0 0 40px rgba(100,210,200,0.25)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#fff'; el.style.boxShadow = '0 0 60px rgba(100,210,200,0.45)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#e0f4f0'; el.style.boxShadow = '0 0 40px rgba(100,210,200,0.25)' }}>
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px dashed rgba(255,255,255,0.07)',
        padding: '20px 36px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 8,
      }}>
        <span style={{ fontSize: 11, fontWeight: 900, color: 'rgba(208,216,216,0.3)', letterSpacing: '-0.02em' }}>🏠 HomeCalc</span>
        <span style={{ fontSize: 10, color: 'rgba(208,216,216,0.2)' }}>
          Not financial advice. Consult a licensed mortgage professional.
        </span>
        <span style={{ fontSize: 10, color: 'rgba(208,216,216,0.2)' }}>© 2026</span>
      </footer>
    </div>
  )
}
