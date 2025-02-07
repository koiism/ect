import type { Metadata } from 'next'

import { cn } from 'src/utilities/cn'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import Script from 'next/script'
import Noise from '@/components/animations/Noise/Noise'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://unpkg.com/react-scan/dist/auto.global.js"
          strategy="beforeInteractive"
        />
        <Script
          src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
          async
        />
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className="min-h-screen flex flex-col bg-revert isolate relative">
        <Providers>
          <Noise className="pointer-events-none" patternAlpha={10} />
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          <LivePreviewListener />
          <Header />
          <main className="flex-1 bg-background min-h-screen">{children}</main>
          <div className="bg-background rounded-b-3xl h-6 hidden md:block"></div>
          <Footer className="hidden md:block" />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    template: '%s | Explore China Tour',
    default: 'Explore China Tour - Your Ultimate Guide to China Travel'
  },
  description: 'Discover the best China travel experiences with Explore China Tour. Find tours, attractions, local guides and travel tips for your next adventure in China.',
  keywords: ['China travel', 'China tours', 'China attractions', 'China travel guide', 'China tourism'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: getServerSideURL(),
    languages: {
      'en-US': '/en',
      'zh-CN': '/zh',
    },
  },
  openGraph: mergeOpenGraph({
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['zh_CN'],
    siteName: 'Explore China Tour',
    description: 'Discover the best China travel experiences with Explore China Tour. Find tours, attractions, local guides and travel tips for your next adventure in China.',
  }),
  twitter: {
    card: 'summary_large_image',
    site: '@explorechinaTour',
    creator: '@explorechinaTour',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
}
