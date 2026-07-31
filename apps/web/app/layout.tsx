import './globals.css'
import type { Metadata } from 'next'
import TopNav from '../components/TopNav'

export const metadata: Metadata = {
  title: 'BugMind AI',
  description: 'Understand Every Line. Explain Every Decision. Fix Every Bug.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <TopNav />
        {children}
      </body>
    </html>
  )
}
