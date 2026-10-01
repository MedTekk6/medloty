import type { Metadata } from 'next'
import Script from 'next/script'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { META_PIXEL_ID } from '@/lib/meta-pixel'

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-playfair',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://medloty.com'),
  title: {
    default: 'MedLoty — Emballages alimentaires en gros au Sénégal',
    template: '%s | MedLoty',
  },
  description:
    "Emballages alimentaires en gros au Sénégal — gobelets, sacs kraft, barquettes, emballages sur mesure. Commande dès 50 pièces, prix de gros, livraison partout au Sénégal.",
  keywords: [
    'emballages alimentaires Sénégal',
    'grossiste emballage Dakar',
    'grossiste détail Sénégal',
    'MedLoty',
  ],
  authors: [{ name: 'MedLoty' }],
  creator: 'MedLoty',
  publisher: 'MedLoty',
  formatDetection: {
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    // ⚠️ logo.webp utilisé en attendant un vrai favicon.ico /
    // apple-touch-icon.png dédiés (voir note ci-dessous)
    icon: '/assets/logo.webp',
    apple: '/assets/logo.webp',
  },
  openGraph: {
    siteName: 'MedLoty',
    locale: 'fr_SN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  verification: {
    google: 'vY2BDEGSXZ56XYnZZQKk0HaMm-vZiYp1S5vf4lPN5rM',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${jakarta.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-jakarta antialiased">
        {/* Meta Pixel — code de base, suit automatiquement chaque vue de page */}
        <Script id="meta-pixel-base" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>

        <Providers>
          {children}
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  )
}