import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChainProvider } from '@/context/ChainContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Game Anvil - NFT Marketplace for Video Games',
  description: 'The ultimate NFT marketplace for video game assets, skins, and collectibles.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
              <ChainProvider>
              <Navbar />
          {children}
          <Footer/>
              </ChainProvider>
    
        </ThemeProvider>
      </body>
    </html>
  );
}