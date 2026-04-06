import Sidebar from '@/components/layout/Sidebar'
import { Bell, Search } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#0A0C10' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Top Bar */}
        <header style={{
          height: '3.5rem',
          backgroundColor: 'rgba(17,19,24,0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.25rem',
          flexShrink: 0,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: '#181B22', borderRadius: '0.5rem',
            padding: '0.375rem 0.75rem', width: '16rem',
          }}>
            <Search size={14} style={{ color: '#6b7280', flexShrink: 0 }} />
            <input
              placeholder="بحث..."
              style={{
                background: 'transparent', fontSize: '0.875rem',
                color: '#F1FAEE', outline: 'none', width: '100%',
                fontFamily: 'Cairo, sans-serif',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button style={{
              position: 'relative', width: '2rem', height: '2rem',
              borderRadius: '0.5rem', backgroundColor: '#181B22',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#6b7280', border: 'none', cursor: 'pointer',
            }}>
              <Bell size={16} />
              <span style={{
                position: 'absolute', top: '0.375rem', right: '0.375rem',
                width: '0.375rem', height: '0.375rem', borderRadius: '9999px',
                backgroundColor: '#E63946',
              }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '2rem', height: '2rem', borderRadius: '9999px',
                backgroundColor: 'rgba(230,57,70,0.2)',
                border: '1px solid rgba(230,57,70,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#E63946', fontSize: '0.75rem', fontWeight: 700,
              }}>A</div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 500, color: '#F1FAEE', fontFamily: 'Cairo, sans-serif' }}>المدير</p>
                <p style={{ fontSize: '0.625rem', color: '#6b7280' }}>admin</p>
              </div>
            </div>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
