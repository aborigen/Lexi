import type {Metadata} from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lexi.AI - Word Connect Puzzle',
  description: 'An engaging circular word-linking game with AI-powered hints and Yandex SDK integration.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <Script 
          src="https://yandex.ru/games/sdk/v2" 
          strategy="beforeInteractive"
        />
      </head>
      <body className="font-body antialiased selection:bg-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
