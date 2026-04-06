import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'El Amrety Center | نظام إدارة مركز العمريطي',
  description: 'منصة إدارة مراكز صيانة السيارات — El Amrety Center Management System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Inter', 'Cairo', sans-serif" }}>
        {children}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: '#181B22',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#F1FAEE',
            },
          }}
        />
      </body>
    </html>
  )
}
