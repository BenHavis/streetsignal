// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StreetSignal',
  description: 'Report and view local community issues on a shared map.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1 className="app-header">StreetSignal</h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
