"use client";

import React from 'react';
import { TrendingUp, Clock, Target, AlertTriangle } from 'lucide-react';

export const StatsSection: React.FC = () => {

    const insights = [
        {
            icon: <TrendingUp className="w-6 h-6" />,
            stat: "85%",
            highlight: "of profiles fail to grab attention — only 5% stand out"
        },
        {
            icon: <Clock className="w-6 h-6" />,
            stat: "3s",
            highlight: "average time someone spends deciding if they engage with your profile"
        },
        {
            icon: <Target className="w-6 h-6" />,
            stat: "10×",
            highlight: "more responses with optimised photos"
        },
        {
            icon: <AlertTriangle className="w-6 h-6" />,
            stat: "78%",
            highlight: "lose interest based on the first photo alone"
        }
    ];

    return (
        <section className="py-12 md:py-24">
            <div className="container">
                {/* Main Container with Glass Morphism */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-2xl">

                    {/* Header */}
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-2xl md:text-3xl lg:text-5xl font-heading font-bold text-white mb-3 md:mb-4">
                            The Science of Standing Out
                        </h2>
                        <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                            Real data reveals the harsh reality of modern dating apps
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12 max-w-4xl mx-auto">
                        {insights.map((insight, index) => (
                            <div key={index} className="group">
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 text-center hover:bg-white/8 hover:border-[#d4ae36]/30 transition-all duration-300 hover:scale-105 h-full flex flex-col">
                                    {/* Icon */}
                                    <div className="w-10 h-10 bg-[#d4ae36] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <div className="text-black">
                                            {insight.icon}
                                        </div>
                                    </div>

                                    {/* Stat Number */}
                                    <div className="text-3xl md:text-4xl font-black text-[#d4ae36] mb-3">
                                        {insight.stat}
                                    </div>

                                    {/* Highlight */}
                                    <h3 className="text-sm md:text-base font-semibold text-white leading-tight">
                                        {insight.highlight}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Reality Section */}
                    <div className="text-center">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-5 max-w-3xl mx-auto">
                            <h3 className="text-2xl md:text-3xl font-bold text-[#d4ae36] mb-4">
                                Here's the Reality
                            </h3>
                            <h4 className="text-xl md:text-2xl font-bold text-white mb-4">
                                Your photos decide your first impression everywhere online
                            </h4>
                            <p className="text-base md:text-lg text-white/90">
                                In a world where most profiles get ignored, professional-quality photos aren't just nice to have - they're your competitive advantage.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
