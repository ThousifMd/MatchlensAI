"use client";

import React from 'react';
import { Check } from 'lucide-react';

const benefits = [
    {
        title: "3x More Matches",
        description: "From 2 → 50+ in 7 days."
    },
    {
        title: "Magnetic Profile",
        description: "Bio, prompts, photos aligned to your anchor."
    },
    {
        title: "High-Status Look",
        description: "Professional, confident imagery."
    },
    {
        title: "Confidence Boost",
        description: "Finally stand out on Tinder, Bumble, Hinge."
    }
];

export const BenefitsSection: React.FC = () => {
    return (
        <section className="py-16 px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-[#EDC967] to-[#F4D03F] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Check className="w-4 h-4 text-black" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-lg mb-1">
                                {benefit.title}
                            </h3>
                            <p className="text-gray-300 text-sm">
                                {benefit.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
