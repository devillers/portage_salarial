import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

import AuthSessionProvider from '../components/providers/SessionProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Chalet Manager - Premium Chalet Management Services',
    template: '%s | Chalet Manager'
  },
  description:
    'Professional chalet management services including rental management, concierge services, maintenance, and guest relations. Maximize your chalet investment with our expert team.',
  keywords: [
    'chalet management',
    'rental management',
    'concierge services',
    'property management',
    'vacation rentals'
  ],
  authors: [{ name: 'Chalet Manager' }],
  creator: 'Chalet Manager',
  publisher: 'Chalet Manager',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    title: 'Chalet Manager - Premium Chalet Management Services',
    description: 'Professional chalet management services for luxury mountain properties.',
    siteName: 'Chalet Manager'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chalet Manager - Premium Chalet Management Services',
    description: 'Professional chalet management services for luxury mountain properties.',
    creator: '@chaletmanager'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'your-google-verification-code'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} antialiased bg-neutral-50 text-neutral-900`}>
        <AuthSessionProvider>{children}</AuthSessionProvider>

        <Script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
