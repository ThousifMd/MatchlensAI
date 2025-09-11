"use client"

import * as React from "react"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { trackCTAClick } from "@/lib/metaPixel"

type NavbarProps = {
  ctaHref: string
  className?: string
}

const HEADER_BASE =
  "fixed inset-x-0 top-0 z-50 bg-transparent transition-colors duration-300"
const HEADER_SCROLLED =
  "fixed inset-x-0 top-0 z-50 bg-transparent transition-colors duration-300"

const navItems: Array<{ label: string, href: string }> = []

export default function Navbar({ ctaHref, className }: NavbarProps) {
  const [scrolled, setScrolled] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => {
      if (typeof window !== "undefined") {
        setScrolled(window.scrollY > 8)
      }
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  React.useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <header className={scrolled ? HEADER_SCROLLED : HEADER_BASE}>
      <div className="container">
        <div className="flex h-16 md:h-16 items-center justify-center md:justify-between gap-3">
          <Brand isLoaded={isLoaded} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <button
            className="hidden md:inline-flex items-center px-5 py-2 bg-transparent backdrop-blur-sm border border-[#FFD700]/40 rounded-lg font-medium hover:border-[#FFD700]/60 hover:bg-transparent transition-all duration-300"
            onClick={() => {
              trackCTAClick("Join the Top 5%", "Navbar Desktop");
              document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent">
              Join the Top 5%
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

function Brand({ isLoaded }: { isLoaded: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Matchlens home"
      className="group inline-flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]"
    >
      <div className={`flex items-center gap-4 transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-0.5 ${isLoaded
        ? 'opacity-100 translate-y-0 scale-100'
        : 'opacity-0 translate-y-[-20px] scale-95'
        }`}>
        {/* Heart/Lens Icon with Sharp 3D effects */}
        <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center relative ${isLoaded ? 'animate-logo-icon-entrance' : ''}`}>
          {/* Sharp 3D Shadow Layer */}
          <svg
            viewBox="0 0 24 24"
            className="absolute w-10 h-10 md:w-12 md:h-12 fill-none stroke-[2.5]"
            style={{
              stroke: '#000000',
              transform: 'translate(1px, 1px)',
              opacity: 0.4
            }}
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 8l-4 4-4-4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Main Sharp 3D Icon */}
          <svg
            viewBox="0 0 24 24"
            className="relative w-10 h-10 md:w-12 md:h-12 fill-none stroke-[2.5] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:-translate-y-0.5"
            style={{
              stroke: 'url(#sharpLogoGradient)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              transform: 'perspective(200px) rotateX(10deg) rotateY(-3deg)'
            }}
          >
            <defs>
              <linearGradient id="sharpLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4ae36" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#FD5E76" />
              </linearGradient>
            </defs>
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 8l-4 4-4-4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Sharp Highlight */}
          <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Main Text */}
        <span className={`font-heading text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-[#d4ae36] via-white to-[#FD5E76] bg-clip-text text-transparent transition-all duration-300 drop-shadow-lg ${isLoaded ? 'animate-logo-text-entrance' : ''}`}
          style={{
            textShadow: '0 0 25px rgba(212, 174, 54, 0.4), 0 0 50px rgba(253, 94, 118, 0.3)'
          }}>
          Matchlens AI
        </span>
      </div>
    </Link>
  )
}
