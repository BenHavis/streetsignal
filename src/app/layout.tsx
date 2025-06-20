import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'StreetSignal',
  description: 'Report and view local community issues on a shared map.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <Link href="/" className="app-header">
            StreetSignal
          </Link>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
