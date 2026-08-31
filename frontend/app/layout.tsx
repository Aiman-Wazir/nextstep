import type { Metadata } from 'next'

// Try to import CSS, but don't crash if it fails
try {
  require('./globals.css')
} catch (e) {
  console.warn('CSS file not found, continuing...')
}

export const metadata: Metadata = {
  title: 'NextStep',
  description: 'Your next career step, powered by AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}