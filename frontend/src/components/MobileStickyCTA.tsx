"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface MobileStickyCTAProps {
    href: string;
    customersCount: number;
}

export const MobileStickyCTA: React.FC<MobileStickyCTAProps> = ({
    href,
    customersCount
}) => {
    return (
        <>
            {/* Mobile Sticky CTA - Only visible on mobile */}
            <div className="fixed bottom-0 left-2 right-2 z-50 md:hidden">
                <div className="relative bg-black/90 backdrop-blur-lg p-6 shadow-2xl rounded-t-2xl overflow-hidden">
                    {/* Animated Border */}
                    <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-r from-[#d4ae36] via-[#FD5E76] to-[#d4ae36] p-[2px] animate-gradient-x">
                        <div className="w-full h-full bg-black/90 backdrop-blur-lg rounded-t-2xl"></div>
                    </div>

                    <a
                        href={href}
                        className="relative block w-full z-10"
                    >
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="flex items-center gap-2 font-bold text-lg mb-1 bg-gradient-to-r from-[#d4ae36] via-white to-[#FD5E76] bg-clip-text text-transparent"
                                style={{
                                    textShadow: '0 0 25px rgba(212, 174, 54, 0.4), 0 0 50px rgba(253, 94, 118, 0.3)'
                                }}>
                                <span>Transform my profile now</span>
                                <ArrowRight className="w-5 h-5 text-[#d4ae36]" />
                            </div>
                            <div className="text-white/90 text-xs">
                                Join {customersCount.toLocaleString()} men who upgraded their profiles.
                            </div>
                        </div>
                    </a>
                </div>
            </div>

            {/* Spacer to prevent content from being hidden behind sticky CTA on mobile */}
            <div className="h-20 md:hidden"></div>
        </>
    );
};
