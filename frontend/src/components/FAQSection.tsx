"use client";

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { trackViewContent } from '@/lib/metaPixel';

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "How long until I see results?",
        answer: "Photos delivered in 24 hours. Most users report increased matches within 48 hours of updating their profile. Average increase: 3-5x matches in first week."
    },
    {
        question: "What if I don't have good photos?",
        answer: "That's exactly why you need this. Upload any 10-20 selfies - even bad ones. We transform them into profile-worthy shots."
    },
    {
        question: "Will people know my photos are enhanced?",
        answer: "No. We keep enhancements natural and realistic. No one can tell they're optimized - they just know you look good."
    },
    {
        question: "What exactly do I get?",
        answer: "25-100 enhanced photos (depending on package), optimized bio tailored to your goals, profile strategy guide, and first message templates."
    },
    {
        question: "Is my data safe?",
        answer: "Your photos are encrypted, processed, and deleted after delivery. We never share or sell your data. Ever."
    },
    {
        question: "Who actually does the optimization?",
        answer: "AI handles initial enhancements. Human experts review and perfect everything before delivery."
    },
    {
        question: "Does this work for LinkedIn / Instagram / Tinder / Bumble?",
        answer: "Yes. We optimize for all major dating apps. Each has slightly different strategies we account for."
    },
    {
        question: "I'm not photogenic. Will this work?",
        answer: "Being 'not photogenic' usually means bad angles and lighting. We fix both. Everyone looks good with the right optimization."
    },
    {
        question: "Why can't I just use a headshot generator and ChatGPT for my bio?",
        answer: "You absolutely can - if you want to look exactly like every other guy using AI tools. Here's the difference: Generic AI creates that obvious 'AI look' that women spot instantly. Matchlens provides real photo enhancement that looks natural, plus bio optimization based on what actually works in your specific city/age/app. HeadshotPro gives everyone the same corporate headshot style. ChatGPT writes the same generic 'loves adventures and tacos' bio. We analyze what's working NOW on dating apps and customize specifically for you. Plus, everything's done in 24 hours instead of you spending days trying different tools. Short version: DIY = 5 hours and obvious AI results. Us = 24 hours and results that actually convert to dates."
    }
];

export const FAQSection: React.FC = () => {
    const [openItems, setOpenItems] = useState<number[]>([]);

    const toggleItem = (index: number) => {
        const isOpening = !openItems.includes(index);

        setOpenItems(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );

        // Track FAQ interaction
        if (isOpening) {
            trackViewContent(faqData[index].question, 'FAQ Expand');
        }
    };

    return (
        <section className="py-16 px-4 max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <HelpCircle className="w-8 h-8 text-[#EDC967]" />
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">
                        FAQ
                    </h2>
                </div>
            </div>

            {/* FAQ Items */}
            <div className="space-y-1">
                {faqData.map((item, index) => (
                    <div key={index} className="border-b border-[#EDC967]/20 last:border-b-0">
                        <button
                            onClick={() => toggleItem(index)}
                            className="w-full text-left flex items-center justify-between py-6 group focus:outline-none"
                        >
                            <div className="flex items-center gap-6 w-full">
                                {/* Question number */}
                                <div className="w-6 h-6 bg-gradient-to-br from-[#EDC967] to-[#F4D03F] rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-black font-bold text-xs">{index + 1}</span>
                                </div>

                                {/* Question text */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-white group-hover:text-[#EDC967] transition-colors duration-300">
                                        {item.question}
                                    </h3>
                                </div>

                                {/* Chevron */}
                                <ChevronDown
                                    className={`w-5 h-5 text-[#EDC967] transition-all duration-300 ${openItems.includes(index) ? 'rotate-180' : ''
                                        }`}
                                />
                            </div>
                        </button>

                        {/* Answer content */}
                        {openItems.includes(index) && (
                            <div className="pb-6 animate-in slide-in-from-top-2 duration-500">
                                <div className="ml-10">
                                    <p className="text-white leading-relaxed">
                                        {item.answer}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-12">
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10 shadow-2xl hover:bg-white/8 hover:border-white/20 transition-all duration-300 ease-out">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <MessageCircle className="w-6 h-6 text-[#d4ae36]" />
                        <h3 className="text-xl font-semibold text-white">
                            Still have questions?
                        </h3>
                    </div>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                        Our support team is here to help you get the most out of your photos.
                    </p>
                    <button className="px-5 py-2 bg-gradient-to-r from-[#d4ae36] to-[#c19d2f] hover:from-[#c19d2f] hover:to-[#b8941f] text-black rounded-full font-medium transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#d4ae36]/30 border border-[#d4ae36]/20 backdrop-blur-sm">
                        Contact Support
                    </button>
                </div>
            </div>
        </section>
    );
};