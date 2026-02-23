'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

// ═══════════════════════════════════════════════════════════════
// YOUR EXISTING CALCULATOR CODE GOES HERE
// ═══════════════════════════════════════════════════════════════
//
// Import your calculator component:
// import Calculator from '@/components/Calculator'
//
// The Calculator component should accept these props:
//   onSave: (data: object) => void    — called when user clicks "Save"
//   initialData?: object              — pre-fill from saved scenario
//
// For now, here's the wrapper that adds save/load functionality:

export default function CalculatorPage() {
  const [saving, setSaving] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [showSave, setShowSave] = useState(false)
  const [toast, setToast] = useState('')
  const supabase = createClient()

  const handleSave = useCallback(async (calculatorData: object) => {
    setSaving(true)
    try {
      const res = await fetch('/api/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: saveName || `Scenario ${new Date().toLocaleDateString()}`,
          data: calculatorData,
        }),
      })

      if (res.ok) {
        setToast('Saved!')
        setShowSave(false)
        setSaveName('')
        setTimeout(() => setToast(''), 3000)
      } else {
        const err = await res.json()
        setToast(`Error: ${err.error}`)
      }
    } catch {
      setToast('Network error')
    }
    setSaving(false)
  }, [saveName])

  return (
    <div className="relative">
      {/* Save Button (floats in corner) */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
        {toast && (
          <div className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold shadow-lg animate-bounce">
            {toast}
          </div>
        )}

        {showSave && (
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-4 w-72">
            <div className="text-sm font-bold text-slate-800 mb-2">Save Scenario</div>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="e.g., 123 Main St - $350k"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm mb-3 focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // Collect all calculator state and save
                  // You'll wire this to your Calculator component's state
                  handleSave({ /* calculator state object */ })
                }}
                disabled={saving}
                className="flex-1 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-400 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setShowSave(false)}
                className="px-3 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowSave(!showSave)}
          className="w-14 h-14 rounded-full bg-blue-600 text-white text-xl shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition flex items-center justify-center"
          title="Save Scenario"
        >
          💾
        </button>
      </div>

      {/* ══════════════════════════════════════════ */}
      {/* YOUR CALCULATOR COMPONENT GOES HERE       */}
      {/* ══════════════════════════════════════════ */}
      {/*
        Replace the placeholder below with:
        <Calculator onSave={handleSave} />

        To convert your existing JSX calculator:
        1. Copy your entire calculator component to src/components/Calculator.tsx
        2. Add TypeScript types (or rename to .jsx)
        3. Accept onSave and initialData props
        4. Add a "Save" button that calls onSave(allInputState)
      */}

      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-white/80 rounded-2xl border border-slate-200 p-12">
          <div className="text-6xl mb-4">🧮</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Calculator Goes Here</h2>
          <p className="text-slate-500 mb-6">
            Replace this placeholder with your Calculator component.
            <br />
            See <code className="bg-slate-100 px-2 py-1 rounded text-sm">src/components/Calculator.tsx</code>
          </p>
          <div className="bg-slate-50 rounded-xl p-6 text-left text-sm text-slate-600 font-mono">
            <p>{'// In this file, replace the placeholder with:'}</p>
            <p className="text-blue-600">{'import Calculator from "@/components/Calculator"'}</p>
            <p className="mt-2">{'// Then in the return:'}</p>
            <p className="text-emerald-600">{'<Calculator onSave={handleSave} />'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
