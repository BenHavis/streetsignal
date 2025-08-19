import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Report Infrastructure Issues | StreetSignal',
  description: 'Report potholes, broken streetlights, safety hazards, and other infrastructure problems in your community. Help local authorities fix issues faster.',
  keywords: 'report infrastructure, community issues, potholes, streetlights, civic engagement, local government',
  openGraph: {
    title: 'Report Infrastructure Issues',
    description: 'Help improve your community by reporting infrastructure problems',
    type: 'website',
  },
}

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}