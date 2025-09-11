"use client";

import Image from 'next/image';

export default function CompaniesSection() {
    const companies = [
        {
            name: "NEW YORK POST",
            logo: (
                <span className="text-white font-bold text-lg italic tracking-wide">
                    NEW YORK POST
                </span>
            )
        },
        {
            name: "Financial Times",
            logo: (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-200 rounded flex items-center justify-center">
                        <span className="text-amber-800 font-bold text-sm">FT</span>
                    </div>
                    <span className="text-amber-200 text-xs">FINANCIAL TIMES</span>
                </div>
            )
        },
        {
            name: "Stripe",
            logo: (
                <span className="text-blue-500 font-bold text-lg">
                    stripe
                </span>
            )
        },
        {
            name: "CNET",
            logo: (
                <span className="text-white font-medium text-lg">
                    c|net
                </span>
            )
        },
        {
            name: "Andreessen Horowitz",
            logo: (
                <div className="text-gray-400 text-sm leading-tight">
                    <div>andreesen.</div>
                    <div>horowitz</div>
                </div>
            )
        },
        {
            name: "HubSpot",
            logo: (
                <span className="text-blue-600 font-bold text-lg">
                    Hub<span className="text-orange-500">Spot</span>
                </span>
            )
        },
        {
            name: "Realtor.com",
            logo: (
                <span className="text-gray-600 text-lg">
                    <span className="text-red-500">realtor</span>.com
                </span>
            )
        },
        {
            name: "Fashionista",
            logo: (
                <span className="text-gray-400 font-bold text-lg tracking-wider">
                    FASHIONISTA
                </span>
            )
        },
        {
            name: "TechCrunch",
            logo: (
                <span className="text-green-500 font-bold text-lg">
                    TechCrunch
                </span>
            )
        },
        {
            name: "Forbes",
            logo: (
                <span className="text-white font-bold text-lg">
                    FORBES
                </span>
            )
        },
        {
            name: "Bloomberg",
            logo: (
                <span className="text-orange-500 font-bold text-lg">
                    Bloomberg
                </span>
            )
        },
        {
            name: "Wired",
            logo: (
                <span className="text-white font-bold text-lg">
                    WIRED
                </span>
            )
        },
        {
            name: "The Verge",
            logo: (
                <span className="text-purple-400 font-bold text-lg">
                    The Verge
                </span>
            )
        },
        {
            name: "Fast Company",
            logo: (
                <span className="text-red-500 font-bold text-lg">
                    Fast Company
                </span>
            )
        },
        {
            name: "Inc.",
            logo: (
                <span className="text-white font-bold text-lg">
                    Inc.
                </span>
            )
        },
        {
            name: "Entrepreneur",
            logo: (
                <span className="text-yellow-500 font-bold text-lg">
                    Entrepreneur
                </span>
            )
        },
    ];

    return (
        <div className="py-16 bg-black/30 backdrop-blur-sm border-y border-white/10">
            <div className="container">
                <h3 className="text-center text-2xl font-bold text-white mb-8 tracking-wider">
                    OUR CUSTOMERS WORK HERE
                </h3>

                <div className="relative overflow-hidden">
                    {/* Scrolling container */}
                    <div className="flex animate-scroll space-x-16 items-center" style={{
                        willChange: 'transform',
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden'
                    }}>
                        {/* First set of companies */}
                        {companies.map((company, index) => (
                            <div
                                key={`first-${index}`}
                                className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity duration-300"
                                style={{ transform: 'translateZ(0)' }}
                            >
                                {company.logo}
                            </div>
                        ))}

                        {/* Second set for seamless scrolling */}
                        {companies.map((company, index) => (
                            <div
                                key={`second-${index}`}
                                className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity duration-300"
                                style={{ transform: 'translateZ(0)' }}
                            >
                                {company.logo}
                            </div>
                        ))}

                        {/* Third set for extra smoothness */}
                        {companies.map((company, index) => (
                            <div
                                key={`third-${index}`}
                                className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity duration-300"
                                style={{ transform: 'translateZ(0)' }}
                            >
                                {company.logo}
                            </div>
                        ))}

                        {/* Fourth set for perfect seamless loop */}
                        {companies.map((company, index) => (
                            <div
                                key={`fourth-${index}`}
                                className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity duration-300"
                                style={{ transform: 'translateZ(0)' }}
                            >
                                {company.logo}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
