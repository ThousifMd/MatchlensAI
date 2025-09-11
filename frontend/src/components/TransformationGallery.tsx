"use client";

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";

interface TransformationCardProps {
  title: string;
  beforeImage: string;
  afterImage: string;
  alt: string;
}

const TransformationCard: React.FC<TransformationCardProps> = ({ title, beforeImage, afterImage, alt }) => {
  const [showAfter, setShowAfter] = useState(true);

  return (
    <Card className="bg-black border border-[#d4ae36]/20 overflow-hidden">
      {/* Card Header with Tabs */}
      <div className="flex border-b border-[#d4ae36]/20">
        <button
          onClick={() => setShowAfter(false)}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${!showAfter
            ? 'bg-[#EDC967] text-black'
            : 'text-white hover:text-[#EDC967]'
            }`}
        >
          Before
        </button>
        <button
          onClick={() => setShowAfter(true)}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${showAfter
            ? 'bg-[#EDC967] text-black'
            : 'text-white hover:text-[#EDC967]'
            }`}
        >
          After
        </button>
      </div>

      {/* Card Title */}
      <div className="p-4 border-b border-[#d4ae36]/20">
        <h3 className="text-white font-semibold text-lg">{title}</h3>
      </div>

      {/* Image Container */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={showAfter ? afterImage : beforeImage}
          alt={`${showAfter ? 'After' : 'Before'} - ${alt}`}
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
        />

        {/* Slider Handle (only visible when showing after) */}
        {showAfter && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-[#d4ae36] flex items-center justify-center">
            <div className="w-2 h-2 bg-gradient-to-br from-[#d4ae36] to-[#c19d2f] rounded-full" />
          </div>
        )}
      </div>
    </Card>
  );
};

export const TransformationGallery: React.FC = () => {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Problem Framing Above Cards */}
      <div className="text-center mb-12">
        <p className="text-2xl font-semibold text-white">
          Look average → get ignored. Look like high-status → get matches.
        </p>
        <p className="text-lg text-white mt-2">
          Same person, different results.
        </p>
      </div>

      {/* Transformation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <TransformationCard
          title="Urban Confidence"
          beforeImage="/images/frat_before.jpeg"
          afterImage="/images/3.3.png"
          alt="Urban confidence transformation"
        />
        <TransformationCard
          title="Fitness Edge"
          beforeImage="/images/tedx_before.jpeg"
          afterImage="/images/4.2.png"
          alt="Fitness edge transformation"
        />
      </div>

      {/* Caption */}
      <div className="text-center">
        <p className="text-2xl font-semibold text-white">
          Same person, 10x more matches
        </p>
        <p className="text-lg text-white mt-2">
          Professional quality photos that get results
        </p>
      </div>
    </section>
  );
};