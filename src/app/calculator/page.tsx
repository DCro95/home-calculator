import dynamic from 'next/dynamic'

const Calculator = dynamic(() => import('@/components/Calculator'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ fontSize: 14, color: '#64748b' }}>Loading calculator...</div>
    </div>
  ),
})

export default function CalculatorPage() {
  return <Calculator />
}
