import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { PackageProvider } from "@/contexts/PackageContext";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});


export const metadata: Metadata = {
  title: "Matchlens AI - Transform Your Profile in 24 Hours | Get 10x More Attention",
  description: "Transform your profile in 24 hours. Get 10x more attention with AI-powered photo enhancement and bio optimization. Perfect for LinkedIn, Instagram, dating apps, and all social platforms.",
  keywords: "profile optimization, AI photo enhancement, social media success, get more attention, profile makeover, bio optimization, LinkedIn optimization, Instagram success, professional photos",
  authors: [{ name: "Matchlens AI" }],
  creator: "Matchlens AI",
  publisher: "Matchlens AI",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://matchlens.ai",
    siteName: "Matchlens AI",
    title: "Matchlens AI - Transform Your Profile in 24 Hours | Get 10x More Attention",
    description: "Transform your profile in 24 hours. Get 10x more attention with AI-powered photo enhancement and bio optimization. Perfect for LinkedIn, Instagram, dating apps, and all social platforms.",
    images: [
      {
        url: "/logos/matchboost-logo.svg",
        width: 1200,
        height: 630,
        alt: "Matchlens AI - Profile Optimization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matchlens AI - Transform Your Profile in 24 Hours | Get 10x More Attention",
    description: "Transform your profile in 24 hours. Get 10x more attention with AI-powered photo enhancement and bio optimization. Perfect for LinkedIn, Instagram, dating apps, and all social platforms.",
    images: ["/logos/matchboost-logo.svg"],
    creator: "@matchlensai",
  },
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
      },
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
        sizes: '32x32',
      },
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
        sizes: '16x16',
      }
    ],
    apple: [
      {
        url: '/favicon.svg',
        sizes: '180x180',
        type: 'image/svg+xml',
      }
    ],
    shortcut: '/favicon.svg',
  },
  manifest: '/manifest.json',
  other: {
    'msapplication-TileColor': '#d4ae36',
    'theme-color': '#d4ae36',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1276626097276316');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1276626097276316&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}

        {/* Fix hydration issues with browser extensions */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Remove browser extension attributes that cause hydration mismatches
              if (typeof window !== 'undefined') {
                document.addEventListener('DOMContentLoaded', function() {
                  const body = document.body;
                  if (body) {
                    // Remove common browser extension attributes
                    body.removeAttribute('cz-shortcut-listen');
                    body.removeAttribute('data-new-gr-c-s-check-loaded');
                    body.removeAttribute('data-gr-ext-installed');
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body
        className="antialiased font-sans"
        suppressHydrationWarning={true}
      >
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <PackageProvider>
          {children}
        </PackageProvider>
      </body>
    </html>
  );
}
