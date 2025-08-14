import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'StreetSignal',
  description: 'Report and view local community issues on a shared map.',
  openGraph: {
    title: 'StreetSignal',
    description: 'Report and view local community issues on a shared map.',
    url: 'https://yourdomain.com',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'StreetSignal preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StreetSignal',
    description: 'Report and view local community issues on a shared map.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="navbar">
          <div className="navbar-container">
            <Link href="/" className="navbar-brand">
              StreetSignal
            </Link>
            <nav className="navbar-nav">
              <Link href="/report" className="nav-link">
                Report Issue
              </Link>
              <Link href="/explore" className="nav-link">
                Explore Map
              </Link>
              <Link href="/about" className="nav-link">
                About
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}