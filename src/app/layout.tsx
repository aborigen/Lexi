import type { Metadata } from 'next';
import { Fredoka } from 'next/font/google';
import './globals.css';

const fredoka = Fredoka({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-lexi',
  display: 'swap',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Lexi.AI - Word Connect Puzzle',
  description: 'An engaging circular word-linking game with AI-powered hints.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.variable} font-body antialiased selection:bg-primary selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
