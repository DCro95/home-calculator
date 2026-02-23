'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Scenario {
  id: string
  name: string
  data: {
    price?: number
    state?: string
    downPct?: number
    termYrs?: number
    [key: string]: unknown
  }
  created_at: string
  updated_at: string
}

export default function Dashboard() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchScenarios()
  }, [])

  async function fetchScenarios() {
    setLoading(true)
    try {
      const res = await fetch('/api/scenarios')
      if (res.ok) {
        const { scenarios } = await res.json()
        setScenarios(scenarios || [])
      }
    } catch (e) {
      console.error('Failed to fetch scenarios', e)
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this scenario? This cannot be undone.')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/scenarios?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setScenarios((prev) => prev.filter((s) => s.id !== id))
      }
    } catch (e) {
      console.error('Delete failed', e)
    }
    setDeleting(null)
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Saved Scenarios</h1>
          <p className="text-sm text-slate-500 mt-1">
            Compare different homes and loan options side-by-side
          </p>
        </div>
        <Link
          href="/calculator"
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-600/20"
        >
          + New Scenario
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <div className="text-slate-400">Loading your scenarios...</div>
        </div>
      ) : scenarios.length === 0 ? (
        <div className="text-center py-20 bg-white/60 rounded-2xl border border-slate-200">
          <div className="text-5xl mb-4">🏠</div>
          <h2 className="text-xl font-bold text-slate-700 mb-2">No saved scenarios yet</h2>
          <p className="text-sm text-slate-400 mb-6">
            Go to the calculator, run your numbers, and save a scenario to see it here.
          </p>
          <Link
            href="/calculator"
            className="inline-block px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition"
          >
            Start Your First Scenario
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition">
                    {scenario.name}
                  </h3>
                  <div className="flex gap-4 mt-2 text-xs text-slate-500">
                    {scenario.data?.price && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">
                        ${scenario.data.price.toLocaleString()}
                      </span>
                    )}
                    {scenario.data?.state && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold">
                        {scenario.data.state}
                      </span>
                    )}
                    {scenario.data?.downPct && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-semibold">
                        {scenario.data.downPct}% down
                      </span>
                    )}
                    {scenario.data?.termYrs && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-semibold">
                        {scenario.data.termYrs}-yr
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2">
                    Last updated: {formatDate(scenario.updated_at)}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Link
                    href={`/calculator?load=${scenario.id}`}
                    className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition"
                  >
                    Load
                  </Link>
                  <button
                    onClick={() => handleDelete(scenario.id)}
                    disabled={deleting === scenario.id}
                    className="px-3 py-2 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition disabled:opacity-50"
                  >
                    {deleting === scenario.id ? '...' : '🗑'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
