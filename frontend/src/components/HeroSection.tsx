"use client";

import * as React from "react";
import { trackCTAClick } from "@/lib/metaPixel";

interface HeroSectionProps {
  ctaHref: string;
  className?: string;
}

export default function HeroSection({ ctaHref, className }: HeroSectionProps) {
  const handleCTA = () => {
    trackCTAClick("Make Me A Match Magnet", "Hero Section");
    document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className={[
        "container",
        "py-10 md:py-16",
        className || "",
      ].join(" ")}
      aria-label="Matchlens hero section"
    >
      {/* Hero Content */}
      <div className="text-center md:text-left mb-8 md:mb-12">
        <h1 className="font-heading font-extrabold tracking-tight text-[28px] leading-[1.1] md:text-[36px] lg:text-[56px] md:leading-[1.05] text-white mb-4 md:mb-6">
          Did you know <span className="text-[#FFD700] text-[32px] md:text-[42px] lg:text-[68px]">85%</span> of profiles get zer<span className="text-[#FFD700]">0</span> attention.<br />
          Only <span className="text-[#FFD700] text-[32px] md:text-[42px] lg:text-[68px]">5%</span> get all the attention.
        </h1>

        <p className="text-lg md:text-xl text-white max-w-3xl mb-8 md:mb-8 leading-relaxed mx-auto md:mx-0 px-4 md:px-0">
          <span className="md:hidden block space-y-4">
            <span className="block text-[#d4ae36] font-bold">Your photos are holding you back – <span className="font-semibold">not you</span>.</span>
            <span className="block">We create <span className="font-semibold">ultra-realistic photos</span> that make you <span className="font-semibold">impossible to ignore</span>. Get <span className="font-semibold">3X more connections</span> in <span className="font-semibold">24 hours</span>.</span>
          </span>
          <span className="hidden md:inline">Your photos are holding you back – not you. We create ultra-realistic photos that make you impossible to ignore. Get 3X more connections in 24 hours.</span>
        </p>

        {/* CTA Button */}
        <div className="mb-4 flex justify-center md:justify-start">
          <button
            type="button"
            onClick={handleCTA}
            className="relative h-auto min-h-[52px] md:min-h-[48px] px-6 md:px-8 py-4 md:py-3 rounded-lg font-semibold text-base md:text-lg bg-white/5 backdrop-blur-md border border-white/20 hover:bg-white/10 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#FFD700]/20 overflow-hidden group touch-manipulation w-full md:w-auto"
            aria-label="Upgrade my photos"
          >
            {/* Glass morphism background with flowing colors */}
            <div className="absolute inset-0 rounded-lg overflow-hidden">
              {/* Gold wave from left */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="w-full h-full bg-gradient-to-r from-[#FFD700]/60 via-[#FFD700]/40 to-transparent opacity-90"
                  style={{
                    animation: 'flowingWaveLeft 3s ease-in-out infinite'
                  }}>
                </div>
              </div>

              {/* Pink wave from right */}
              <div className="absolute top-0 right-0 w-full h-full">
                <div className="w-full h-full bg-gradient-to-l from-[#FF69B4]/60 via-[#FF69B4]/40 to-transparent opacity-90"
                  style={{
                    animation: 'flowingWaveRight 3s ease-in-out infinite'
                  }}>
                </div>
              </div>

            </div>

            <span className="relative z-20 text-white font-bold drop-shadow-lg">Upgrade my photos</span>
          </button>
        </div>

        {/* First Impression Text */}
        <div className="mb-4 md:mb-6 text-center md:text-left">
          <p className="text-base md:text-lg text-white/80 italic mb-2">
            "You never get a second chance to make a first impression"
          </p>
          <p className="hidden md:block text-sm md:text-base text-[#d4ae36] font-semibold">
            We make sure your first impression counts.
          </p>
        </div>

        {/* Supporting Text */}
        <div className="flex items-center justify-center md:justify-start gap-2 text-xs md:text-sm text-white mb-4">
          <span>⚡ 2,847+ transformed</span>
          <span>•</span>
          <span>🔒 Military-grade privacy</span>
          <span>•</span>
          <span>⏰ 24hr delivery</span>
        </div>

        {/* Customer Rating */}
        <div className="flex items-center justify-center md:justify-start gap-2 text-sm md:text-base text-white">
          <div className="flex items-center gap-1">
            <span className="text-[#FFD700] text-lg">★★★★★</span>
          </div>
          <span className="font-semibold">2,847 Happy Customers</span>
        </div>
      </div>
    </section>
  );
}