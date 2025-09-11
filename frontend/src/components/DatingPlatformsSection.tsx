"use client";

export default function DatingPlatformsSection() {
    const platforms = [
        { name: "Tinder" },
        { name: "Bumble" },
        { name: "Hinge" },
        { name: "OkCupid" },
        { name: "Coffee Meets Bagel" },
        { name: "Happn" },
        { name: "Match" },
        { name: "eHarmony" },
    ];

    return (
        <div className="py-16 bg-black/50 backdrop-blur-sm border-y border-white/10">
            <div className="container">
                <h3 className="text-center text-2xl font-bold text-white mb-8 tracking-wider">
                    SUCCESSFULLY TESTED AND APPROVED ON
                </h3>

                <div className="relative overflow-hidden">
                    {/* Scrolling container */}
                    <div className="flex animate-scroll space-x-12 items-center">
                        {/* First set of platforms */}
                        {platforms.map((platform, index) => (
                            <div
                                key={`first-${index}`}
                                className="flex-shrink-0 flex items-center text-white/60 hover:text-white/80 transition-colors duration-300"
                            >
                                <span className="text-xl font-semibold whitespace-nowrap">
                                    {platform.name}
                                </span>
                            </div>
                        ))}

                        {/* Second set for seamless scrolling */}
                        {platforms.map((platform, index) => (
                            <div
                                key={`second-${index}`}
                                className="flex-shrink-0 flex items-center text-white/60 hover:text-white/80 transition-colors duration-300"
                            >
                                <span className="text-xl font-semibold whitespace-nowrap">
                                    {platform.name}
                                </span>
                            </div>
                        ))}

                        {/* Third set for extra smoothness */}
                        {platforms.map((platform, index) => (
                            <div
                                key={`third-${index}`}
                                className="flex-shrink-0 flex items-center text-white/60 hover:text-white/80 transition-colors duration-300"
                            >
                                <span className="text-xl font-semibold whitespace-nowrap">
                                    {platform.name}
                                </span>
                            </div>
                        ))}

                        {/* Fourth set for perfect seamless loop */}
                        {platforms.map((platform, index) => (
                            <div
                                key={`fourth-${index}`}
                                className="flex-shrink-0 flex items-center text-white/60 hover:text-white/80 transition-colors duration-300"
                            >
                                <span className="text-xl font-semibold whitespace-nowrap">
                                    {platform.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
