
import type {Metadata} from 'next';
import './globals.css';

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
      <body className="font-body antialiased selection:bg-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
