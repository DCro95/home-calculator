import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="text-xl font-black text-white tracking-tight">
          🏠 HomeCalc
        </div>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-5 py-2 rounded-lg text-sm font-semibold text-blue-200 hover:text-white transition"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 rounded-lg text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/25"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-6">
          Free for all 50 states + DC
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
          Know Exactly What
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            You Can Afford
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The most comprehensive home affordability calculator available.
          Federal & state taxes, mortgage amortization, extra payment analysis,
          stock market comparison, and a complete monthly budget — all in one place.
        </p>
        <div className="flex gap-4 justify-center mb-16">
          <Link
            href="/signup"
            className="px-8 py-3.5 rounded-xl text-base font-bold bg-emerald-500 text-white hover:bg-emerald-400 transition shadow-xl shadow-emerald-500/25"
          >
            Start Your Analysis →
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 rounded-xl text-base font-semibold bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 transition"
          >
            I Have an Account
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          {[
            { icon: '📊', title: 'Tax Calculator', desc: 'Federal + state taxes for all 50 states' },
            { icon: '🏦', title: 'Mortgage Analysis', desc: 'Fixed, ARM, any term — 10 to 30 years' },
            { icon: '📅', title: 'Amortization', desc: 'Month-by-month with extra payment impact' },
            { icon: '📈', title: 'Invest vs Pay Down', desc: 'Stock market comparison over loan life' },
            { icon: '🎯', title: 'Max Borrowing', desc: 'What can you afford (gross AND net)' },
            { icon: '💰', title: 'Full Budget', desc: '27 expense categories, debt-to-income ratios' },
            { icon: '📄', title: 'PDF Reports', desc: 'Download professional reports for your lender' },
            { icon: '💾', title: 'Save Scenarios', desc: 'Compare multiple homes side-by-side' },
          ].map((f) => (
            <div
              key={f.title}
              className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition"
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="text-sm font-bold text-white mb-1">{f.title}</div>
              <div className="text-xs text-slate-500">{f.desc}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-slate-600">
        Not financial advice. Consult a licensed mortgage professional.
      </footer>
    </div>
  )
}
