import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Between - Daily Puzzle Game',
  description: 'Guess the concept that lies between two anchors',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

