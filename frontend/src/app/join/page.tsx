import * as React from "react";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DatingPlatformsSection from "@/components/DatingPlatformsSection";
import { DatingAppContext } from "@/components/DatingAppContext";
import { StatsSection } from "@/components/StatsSection";
import { FAQSection } from "@/components/FAQSection";
import { FinalCTASection } from "@/components/FinalCTASection";
import { SimpleProcessSection } from "@/components/SimpleProcessSection";
import { PricingSection } from "@/components/PricingSection";
import CompaniesSection from "@/components/CompaniesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";

export default function JoinPage() {
    const ctaHref = "/onboarding";

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Glass morphism background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0E0E0F] to-black"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#d4ae36]/5 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#d4ae36]/3 via-transparent to-transparent"></div>

            <Navbar ctaHref={ctaHref} />

            <main className="relative z-10">
                {/* Hero section - above the fold */}
                <div className="pt-16">
                    <HeroSection
                        ctaHref={ctaHref}
                        className="mx-auto"
                    />
                </div>

                {/* Stats Section */}
                <StatsSection />

                {/* Dating App Context Section */}
                <DatingAppContext />

                {/* Simple Process Section */}
                <SimpleProcessSection />

                {/* Dating Platforms Section */}
                <DatingPlatformsSection />

                {/* Pricing Section */}
                <div id="pricing-section">
                    <PricingSection />
                </div>

                {/* Testimonials Section */}
                <TestimonialsSection />

                {/* Companies Section */}
                <CompaniesSection />

                {/* FAQ Section */}
                <FAQSection />

                {/* Final CTA Section */}
                <FinalCTASection />
            </main>

            <Footer
                customersCount={2847}
                rating={4.9}
                trustCopy="GDPR‑compliant • Secure checkout"
            />

            {/* Mobile Sticky CTA */}
            <MobileStickyCTA
                href="#pricing-section"
                customersCount={2847}
            />
        </div>
    );
}
