"use client";

import React from 'react';
import { Upload, Search, Zap, Clock } from 'lucide-react';

const processSteps = [
    {
        icon: <Upload className="w-5 h-5" />,
        number: "01",
        title: "Upload Your Photos",
        description: "Share 10-20 selfies and your current bio. Everything stays completely private and secure."
    },
    {
        icon: <Search className="w-5 h-5" />,
        number: "02",
        title: "We Find Your Edge",
        description: "Our experts identify your unique strengths—fitness, lifestyle, personality, or success signals."
    },
    {
        icon: <Zap className="w-5 h-5" />,
        number: "03",
        title: "AI + Expert Optimization",
        description: "We create ultra realistic AI photos of you and enhance your profile that 3x your matches."
    },
    {
        icon: <Clock className="w-5 h-5" />,
        number: "04",
        title: "24-Hour Delivery",
        description: "Receive 20-100 swipe-worthy photos and a polished profile ready for any dating app."
    }
];

export const SimpleProcessSection: React.FC = () => {
    return (
        <section className="py-24">
            <div className="container">
                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-block bg-[#d4ae36] text-black px-6 py-2 rounded-full font-bold text-sm mb-6">
                        HOW IT WORKS
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        From Selfie to Success
                    </h2>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        We turn your basic selfies into profiles that actually get matches (yes, it's possible)
                    </p>
                </div>

                {/* Process Steps - Simple 4 Containers */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
                    {processSteps.map((step, index) => (
                        <div key={index} className="relative">
                            {/* Step Card */}
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl hover:bg-white/8 hover:border-[#d4ae36]/40 hover:shadow-[#d4ae36]/20 transition-all duration-300 hover:scale-105 h-full flex flex-col">
                                {/* Icon Circle */}
                                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-[#d4ae36]/40 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg shadow-[#d4ae36]/20">
                                    <div className="text-[#d4ae36]">
                                        {step.icon}
                                    </div>
                                </div>

                                {/* Step Number */}
                                <div className="text-2xl font-black text-[#d4ae36] mb-4 text-center">
                                    {step.number}
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-white mb-4 text-center">
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className="text-white/80 text-center leading-relaxed flex-grow">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};