"use client"

import * as React from "react"
import Link from "next/link"
import { Star, Instagram, Twitter, Facebook, Youtube, Linkedin } from "lucide-react"

export interface FooterProps {
  className?: string
  containerClassName?: string
  year?: number
  customersCount?: number
  rating?: number
  trustCopy?: string
}

export default function Footer({
  className,
  containerClassName,
  year,
  customersCount = 11847,
  rating = 4.9,
  trustCopy = "GDPR‑compliant • Secure checkout",
}: FooterProps) {
  const currentYear = year ?? new Date().getFullYear()
  const formattedCustomers = new Intl.NumberFormat("en-US").format(customersCount)

  const socialLinks = [
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/matchlens", color: "hover:text-pink-400" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/matchlens", color: "hover:text-blue-400" },
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/matchlens", color: "hover:text-blue-600" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/@matchlens", color: "hover:text-red-500" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/matchlens", color: "hover:text-blue-500" },
  ]

  return (
    <footer
      className={[
        "relative overflow-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="contentinfo"
    >
      {/* Glass morphism background */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-md border-t border-white/10"></div>

      <div className={["relative z-10 container", containerClassName].filter(Boolean).join(" ")}>
        {/* Main Footer Content */}
        <div className="py-8">
          {/* Top Row - Brand and Social */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            {/* Brand */}
            <Link
              href="/"
              aria-label="Matchlens home"
              className="group inline-flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]"
            >
              <div className="transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-0.5">
                {/* Logo and Main Text Row */}
                <div className="flex items-center gap-3 mb-1">
                  {/* Heart/Lens Icon with Sharp 3D effects */}
                  <div className="w-8 h-8 flex items-center justify-center relative">
                    {/* Sharp 3D Shadow Layer */}
                    <svg
                      viewBox="0 0 24 24"
                      className="absolute w-8 h-8 fill-none stroke-[2.5]"
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
                      className="relative w-8 h-8 fill-none stroke-[2.5] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:-translate-y-0.5"
                      style={{
                        stroke: 'url(#footerSharpLogoGradient)',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                        transform: 'perspective(200px) rotateX(10deg) rotateY(-3deg)'
                      }}
                    >
                      <defs>
                        <linearGradient id="footerSharpLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
                  <span className="font-heading text-lg font-bold tracking-tight bg-gradient-to-r from-[#d4ae36] via-white to-[#FD5E76] bg-clip-text text-transparent transition-all duration-300 drop-shadow-lg"
                    style={{
                      textShadow: '0 0 25px rgba(212, 174, 54, 0.4), 0 0 50px rgba(253, 94, 118, 0.3)'
                    }}>
                    Matchlens AI
                  </span>
                </div>

                {/* Tagline */}
                <p className="m-0 text-sm bg-gradient-to-r from-[#d4ae36] via-white to-[#FD5E76] bg-clip-text text-transparent drop-shadow-lg ml-11"
                  style={{
                    textShadow: '0 0 20px rgba(212, 174, 54, 0.3), 0 0 40px rgba(253, 94, 118, 0.2)'
                  }}>
                  The lens between ignored and irresistible
                </p>
              </div>
            </Link>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <div
                    key={social.name}
                    className={`group p-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-[#d4ae36]/30 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-[#d4ae36]/20 cursor-default`}
                    aria-label={`${social.name} icon`}
                  >
                    <IconComponent className={`w-4 h-4 text-white/70 group-hover:text-[#d4ae36] transition-colors duration-300 ${social.color}`} />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottom Row - Navigation and Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            {/* Navigation */}
            <nav
              className="flex items-center gap-6"
              aria-label="Legal and contact"
            >
              <Link
                href="/terms"
                aria-label="Read our Terms of Service"
                className="text-sm text-white/70 hover:text-white transition-colors duration-200"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                aria-label="Read our Privacy Policy"
                className="text-sm text-white/70 hover:text-white transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                href="/contact"
                aria-label="Contact us"
                className="text-sm text-white/70 hover:text-white transition-colors duration-200"
              >
                Contact
              </Link>
            </nav>

            {/* Copyright and Rating */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p className="m-0 text-sm text-white/60">
                © {currentYear} Matchlens. {trustCopy}
              </p>

              <div className="flex items-center gap-2">
                <div className="flex items-center" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-[#d4ae36]"
                      stroke="none"
                      fill="currentColor"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-white">
                  {formattedCustomers} Happy Customers
                </span>
                <span className="sr-only">Rated {rating} out of 5 stars by {formattedCustomers} customers</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  )
}