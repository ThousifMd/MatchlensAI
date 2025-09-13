"use client";

import React, { useState } from 'react';

interface DatingAppCardProps {
    appName: string;
    beforeImage: string;
    afterImage: string;
    upgradedImage: string;
    name: string;
    age: number;
    distance: string;
    beforeBio: string;
    afterBio: string;
    appStyle: 'tinder' | 'bumble' | 'hinge';
}

const DatingAppCard: React.FC<DatingAppCardProps> = ({
    appName,
    beforeImage,
    afterImage,
    upgradedImage,
    name,
    age,
    distance,
    beforeBio,
    afterBio,
    appStyle
}) => {
    const [activeTab, setActiveTab] = useState<'before' | 'after'>('after');

    const getCurrentImage = () => {
        switch (activeTab) {
            case 'before': return beforeImage;
            case 'after': return afterImage;
            default: return afterImage;
        }
    };

    const getCurrentBio = () => {
        switch (activeTab) {
            case 'before': return beforeBio;
            case 'after': return afterBio;
            default: return afterBio;
        }
    };

    return (
        <div className="flex flex-col items-center">

            {/* Mobile Phone Frame */}
            <div className="relative w-80 h-[600px] bg-black rounded-[2.5rem] p-1 shadow-2xl border border-gray-300/20">
                {/* Phone Screen */}
                <div className="bg-white rounded-[2rem] h-full overflow-hidden relative">
                    {/* Top Toggle Bar */}
                    <div className="absolute top-4 left-4 right-4 z-20">
                        <div className="bg-white rounded-full p-1 shadow-lg flex">
                            <button
                                onClick={() => setActiveTab('before')}
                                className={`flex-1 py-2 px-3 text-xs font-medium rounded-full transition-all ${activeTab === 'before'
                                    ? 'bg-gray-600 text-white'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                Before
                            </button>
                            <button
                                onClick={() => setActiveTab('after')}
                                className={`flex-1 py-2 px-3 text-xs font-medium rounded-full transition-all ${activeTab === 'after'
                                    ? 'bg-gray-600 text-white'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                After
                            </button>
                        </div>
                    </div>

                    {/* Profile Image Area - Full Bleed */}
                    <div className="relative h-full">
                        <img
                            src={getCurrentImage()}
                            alt={`${appName} profile`}
                            className="w-full h-full object-cover"
                        />

                        {/* Glassmorphic Info Card - True Semi Circle */}
                        <div className="absolute bottom-0 left-0 right-0">
                            <div className="bg-black/60 backdrop-blur-md rounded-t-[3rem] p-4 pb-6 shadow-lg">
                                {/* Profile Info */}
                                <div className="mb-4">
                                    <h4 className="text-white font-semibold text-base">
                                        {name}, {age}
                                    </h4>
                                    <p className="text-white/80 text-xs mb-1">{distance}</p>
                                    <p className="text-white/90 text-xs leading-relaxed line-clamp-2">
                                        {getCurrentBio()}
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const DatingAppContext: React.FC = () => {
    return (
        <section className="py-20">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                        The Profile Revolution
                    </h2>
                    <p className="text-xl text-white max-w-2xl mx-auto">
                        <span className="text-gray-400">Look average</span> → <span className="text-red-400">get ignored</span>. <span className="text-[#d4ae36]">Look polished & high-status</span> → <span className="text-green-400">get noticed</span>. <span className="text-white/80">Same person, different results.</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <DatingAppCard
                        appName="Tinder-style"
                        beforeImage="/images/1_before.jpeg"
                        afterImage="/images/1_after.jpeg"
                        upgradedImage="/images/1_after.jpeg"
                        name="Alex"
                        age={29}
                        distance="3 mi"
                        beforeBio="Adventure seeker & coffee enthusiast. Love hiking, photography, and trying new restaurants. Let's explore the city together!"
                        afterBio="Traveled to 47 countries. Climbed Kilimanjaro last month. Still can't cook pasta without burning it 😅 Looking for my adventure partner"
                        appStyle="tinder"
                    />

                    <DatingAppCard
                        appName="Bumble-style"
                        beforeImage="/images/2_before.jpg"
                        afterImage="/images/2_after.jpeg"
                        upgradedImage="/images/2_after.jpeg"
                        name="Roman"
                        age={31}
                        distance="12 mi"
                        beforeBio="Software engineer who enjoys hiking and playing guitar. Family and friends mean everything to me."
                        afterBio="Scaled an app to 1M users by day, hiking California peaks by weekend. If I'm not coding, I'm playing John Mayer on guitar for my niece. Swipe if you want real adventures."
                        appStyle="bumble"
                    />

                    <DatingAppCard
                        appName="Hinge-style"
                        beforeImage="/images/3_before.jpeg"
                        afterImage="/images/3_after.jpeg"
                        upgradedImage="/images/3_after.jpeg"
                        name="Noah"
                        age={27}
                        distance="1 mi"
                        beforeBio="Creative soul who loves music, art galleries, and weekend brunches. Always up for a spontaneous road trip or cozy night in."
                        afterBio="Published author & TEDx speaker. Still get nervous on first dates 😊 Looking for someone who loves deep conversations"
                        appStyle="hinge"
                    />
                </div>
            </div>
        </section>
    );
};