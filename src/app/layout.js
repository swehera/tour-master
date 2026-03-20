import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: { default: 'TourMaster — Explore The World', template: '%s | TourMaster' },
  description: 'Discover breathtaking destinations with TourMaster. Book tours, adventures, and cultural experiences worldwide.',
  keywords: ['travel', 'tours', 'adventure', 'booking', 'vacation'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster position="top-right" toastOptions={{
            className: 'dark:bg-gray-800 dark:text-white',
            duration: 4000,
            style: { borderRadius: '10px', fontSize: '14px' },
          }} />
        </ThemeProvider>
      </body>
    </html>
  );
}
