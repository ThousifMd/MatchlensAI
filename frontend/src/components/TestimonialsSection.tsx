"use client";

import React, { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
    id: number;
    name: string;
    age: number;
    location: string;
    rating: number;
    text: string;
    beforeMatches: string;
    afterMatches: string;
    avatar: string;
    profileImage: string;
    date: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Ethan Rodriguez",
        age: 28,
        location: "San Francisco",
        rating: 5,
        text: "I have used AI photo generators earlier but the problem with AI photo generators was they look like AI generated images but Matchlens AI team generated created my images that actually look ultra realistic and the bio optimization also added a lot of game in getting my profile swiped right.",
        beforeMatches: "2-3/week",
        afterMatches: "15+/week",
        avatar: "👨‍💼",
        profileImage: "/images/s1.jpg",
        date: "7/15/2025"
    },
    {
        id: 2,
        name: "Arjun Patel",
        age: 31,
        location: "New York",
        rating: 5,
        text: "Amazing results! My match rate tripled in just one week.",
        beforeMatches: "1-2/week",
        afterMatches: "12+/week",
        avatar: "👨‍🎨",
        profileImage: "/images/s2.jpg",
        date: "7/18/2025"
    },
    {
        id: 3,
        name: "Marcus Thompson",
        age: 26,
        location: "Austin",
        rating: 5,
        text: "The difference between Matchlens AI and other services is night and day. They actually understand what makes a profile attractive. The bio optimization feature is a game changer - it's like having a dating coach. I went from getting maybe 1-2 matches per week to getting 8+ quality matches. The photos look so natural that my friends thought I hired a professional photographer. The bio suggestions were spot on and helped me showcase my personality better. I'm actually enjoying dating again thanks to Matchlens AI.",
        beforeMatches: "0-1/week",
        afterMatches: "8+/week",
        avatar: "👨‍💻",
        profileImage: "/images/s3.jpg",
        date: "7/22/2025"
    },
    {
        id: 4,
        name: "Kwame Osei",
        age: 29,
        location: "Miami",
        rating: 5,
        text: "I tried other AI photo services before but they all looked fake. Matchlens AI created photos that actually look like me but better. The bio suggestions were spot on and my dating life has completely transformed.",
        beforeMatches: "3-4/week",
        afterMatches: "20+/week",
        avatar: "👨‍🏫",
        profileImage: "/images/s4.jpg",
        date: "7/25/2025"
    },
    {
        id: 5,
        name: "Alexander Park",
        age: 24,
        location: "Seattle",
        rating: 5,
        text: "Finally found a service that gets it right. The photos look completely natural and the bio optimization is incredible. I went from getting no matches to being overwhelmed with quality matches. The AI really understood my vibe and created photos that actually look like me but 10x better. I'm getting quality matches now, not just quantity. The investment was totally worth it.",
        beforeMatches: "1-2/week",
        afterMatches: "10+/week",
        avatar: "👨‍🔬",
        profileImage: "/images/s5.jpg",
        date: "7/28/2025"
    },
    {
        id: 6,
        name: "Lars Andersson",
        age: 32,
        location: "Denver",
        rating: 5,
        text: "The AI photos from Matchlens look so realistic that my friends thought they were professional photos. The bio optimization feature helped me express my personality better. Highly recommend!",
        beforeMatches: "0-1/week",
        afterMatches: "6+/week",
        avatar: "👨‍🚀",
        profileImage: "/images/s6.jpg",
        date: "8/2/2025"
    },
    {
        id: 7,
        name: "Nathan Williams",
        age: 30,
        location: "Chicago",
        rating: 5,
        text: "I was terrible at taking photos and my dating profile was a disaster. Matchlens AI saved me - the photos look amazing and the bio suggestions are perfect. My confidence is through the roof now. The transformation is unreal. My dating profile went from average to absolutely stunning. I'm getting way more meaningful matches now.",
        beforeMatches: "1-2/week",
        afterMatches: "12+/week",
        avatar: "👨‍🎭",
        profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
        date: "8/5/2025"
    },
    {
        id: 8,
        name: "Rajesh Kumar",
        age: 27,
        location: "Boston",
        rating: 5,
        text: "The quality of photos from Matchlens AI is incredible. They look so natural and professional. The bio optimization feature helped me showcase my personality better. I'm getting way more meaningful matches now.",
        beforeMatches: "0-1/week",
        afterMatches: "8+/week",
        avatar: "👨‍🎪",
        profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
        date: "8/8/2025"
    },
    {
        id: 9,
        name: "Lucas Brown",
        age: 29,
        location: "Los Angeles",
        rating: 5,
        text: "I've tried multiple AI photo services but Matchlens AI is in a league of its own. The photos look completely realistic and the bio optimization is spot on. My dating life has never been better. The difference is night and day. I'm connecting with people who really get me now. The photos are professional quality and the bio optimization is spot on. Dating apps actually work now!",
        beforeMatches: "3-4/week",
        afterMatches: "20+/week",
        avatar: "👨‍🚒",
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        date: "8/12/2025"
    },
    {
        id: 10,
        name: "Hassan Al-Rashid",
        age: 25,
        location: "Portland",
        rating: 5,
        text: "The photos from Matchlens AI look so natural that I can't believe they're AI-generated. The bio optimization feature helped me express myself better. I'm getting quality matches now, not just quantity.",
        beforeMatches: "1-2/week",
        afterMatches: "10+/week",
        avatar: "👨‍✈️",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        date: "8/15/2025"
    },
    {
        id: 11,
        name: "Ryan Miller",
        age: 33,
        location: "Phoenix",
        rating: 5,
        text: "As someone who was terrible at taking photos, Matchlens AI was a lifesaver. The photos look incredible and the bio optimization is amazing. I'm actually enjoying dating again. The results speak for themselves. My match rate increased by 300% in just the first week. The AI somehow managed to capture my personality in these photos. I'm getting way more meaningful matches now.",
        beforeMatches: "0-1/week",
        afterMatches: "6+/week",
        avatar: "👨‍🎓",
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        date: "8/18/2025"
    },
    {
        id: 12,
        name: "Vikram Singh",
        age: 28,
        location: "Dallas",
        rating: 5,
        text: "The difference Matchlens AI made to my profile is incredible. The photos look so professional and natural. The bio optimization feature helped me showcase my personality perfectly.",
        beforeMatches: "2-3/week",
        afterMatches: "15+/week",
        avatar: "👨‍🏭",
        profileImage: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
        date: "8/22/2025"
    },
    {
        id: 13,
        name: "Daniel Wilson",
        age: 26,
        location: "Atlanta",
        rating: 5,
        text: "I was skeptical about AI-generated photos but Matchlens AI proved me wrong. The photos look completely natural and the bio optimization is incredible. My match rate increased by 300%. The AI really understood my vibe and created photos that actually look like me but 10x better. I'm getting quality matches now, not just quantity. The investment was totally worth it. If you're on the fence, just go for it.",
        beforeMatches: "1-2/week",
        afterMatches: "12+/week",
        avatar: "👨‍🎤",
        profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
        date: "8/25/2025"
    },
    {
        id: 14,
        name: "Jean-Pierre Dubois",
        age: 31,
        location: "Detroit",
        rating: 5,
        text: "The photos from Matchlens AI look so realistic that my friends thought they were professional photos. The bio optimization feature helped me express my personality better. Highly recommend!",
        beforeMatches: "0-1/week",
        afterMatches: "8+/week",
        avatar: "👨‍🎯",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        date: "8/28/2025"
    },
    {
        id: 15,
        name: "Jackson Lee",
        age: 24,
        location: "Minneapolis",
        rating: 5,
        text: "Finally found a service that gets it right. The photos look completely natural and the bio optimization is incredible. I went from getting no matches to being overwhelmed with quality matches.",
        beforeMatches: "2-3/week",
        afterMatches: "18+/week",
        avatar: "👨‍🎨",
        profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
        date: "7/1/2025"
    },
    {
        id: 16,
        name: "Adebayo Ogunlesi",
        age: 29,
        location: "Tampa",
        rating: 5,
        text: "The quality of photos from Matchlens AI is incredible. They look so natural and professional. The bio optimization feature helped me showcase my personality better. I'm getting way more meaningful matches now. The transformation is unreal. My dating profile went from average to absolutely stunning. I'm getting way more meaningful matches now. The AI somehow managed to capture my personality in these photos.",
        beforeMatches: "1-2/week",
        afterMatches: "15+/week",
        avatar: "👨‍💻",
        profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
        date: "7/4/2025"
    },
    {
        id: 17,
        name: "Caleb Moore",
        age: 27,
        location: "Orlando",
        rating: 5,
        text: "I've tried multiple AI photo services but Matchlens AI is in a league of its own. The photos look completely realistic and the bio optimization is spot on. My dating life has never been better.",
        beforeMatches: "0-1/week",
        afterMatches: "10+/week",
        avatar: "👨‍🔬",
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        date: "7/7/2025"
    },
    {
        id: 18,
        name: "Giovanni Rossi",
        age: 32,
        location: "Las Vegas",
        rating: 5,
        text: "The photos from Matchlens AI look so natural that I can't believe they're AI-generated. The bio optimization feature helped me express myself better. I'm getting quality matches now, not just quantity.",
        beforeMatches: "2-3/week",
        afterMatches: "20+/week",
        avatar: "👨‍🚀",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        date: "7/10/2025"
    },
    {
        id: 19,
        name: "Noah White",
        age: 25,
        location: "Nashville",
        rating: 5,
        text: "As someone who was terrible at taking photos, Matchlens AI was a lifesaver. The photos look incredible and the bio optimization is amazing. I'm actually enjoying dating again. The results speak for themselves. My match rate increased by 300% in just the first week. The AI somehow managed to capture my personality in these photos. I'm getting way more meaningful matches now. The transformation is unreal. My dating profile went from average to absolutely stunning.",
        beforeMatches: "1-2/week",
        afterMatches: "12+/week",
        avatar: "👨‍🎭",
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        date: "7/13/2025"
    },
    {
        id: 20,
        name: "Tariq Hassan",
        age: 30,
        location: "Cleveland",
        rating: 5,
        text: "The difference Matchlens AI made to my profile is incredible. The photos look so professional and natural. The bio optimization feature helped me showcase my personality perfectly.",
        beforeMatches: "0-1/week",
        afterMatches: "8+/week",
        avatar: "👨‍🎪",
        profileImage: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
        date: "8/16/2025"
    },
    {
        id: 21,
        name: "Gabriel Clark",
        age: 28,
        location: "Kansas City",
        rating: 5,
        text: "I was skeptical about AI-generated photos but Matchlens AI proved me wrong. The photos look completely natural and the bio optimization is incredible. My match rate increased by 300%.",
        beforeMatches: "2-3/week",
        afterMatches: "15+/week",
        avatar: "👨‍🚒",
        profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
        date: "8/19/2025"
    },
    {
        id: 22,
        name: "Chen Wei",
        age: 26,
        location: "Indianapolis",
        rating: 5,
        text: "The photos from Matchlens AI look so realistic that my friends thought they were professional photos. The bio optimization feature helped me express my personality better. Highly recommend! The difference is night and day. I'm connecting with people who really get me now. The photos are professional quality and the bio optimization is spot on. Dating apps actually work now! The AI really understood my vibe and created photos that actually look like me but 10x better.",
        beforeMatches: "1-2/week",
        afterMatches: "10+/week",
        avatar: "👨‍✈️",
        profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
        date: "8/22/2025"
    }
];

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 ease-out group flex-shrink-0 w-80">
            {/* Profile Image and User Info */}
            <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                    <img
                        src={testimonial.profileImage}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                            console.log('Image failed to load:', testimonial.profileImage);
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face';
                        }}
                    />
                </div>
                <div className="flex-1">
                    <div className="text-gray-900 font-semibold text-sm">
                        {testimonial.name}
                    </div>
                    <div className="text-gray-500 text-xs">
                        {testimonial.date}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                </div>
            </div>

            {/* Testimonial Text */}
            <p className="text-gray-700 text-sm leading-relaxed">
                "{testimonial.text}"
            </p>
        </div>
    );
};

export const TestimonialsSection: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Create four sets of testimonials for perfect seamless infinite scroll
    const quadrupledTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

    if (!isMounted) {
        return (
            <section className="py-20 px-4 max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 relative">
                        <span className="relative z-10">
                            Real Stories from{" "}
                            <span className="relative inline-block">
                                <span className="bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent font-extrabold">
                                    Real People
                                </span>
                            </span>
                        </span>
                        {/* Background decorative elements */}
                        <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#FFD700]/20 rounded-full blur-sm"></div>
                        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-[#FFA500]/30 rounded-full blur-sm"></div>
                    </h2>
                </div>
                {/* Loading state */}
                <div className="flex gap-6">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="bg-white rounded-2xl p-4 shadow-lg flex-shrink-0 w-80 animate-pulse">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 bg-gray-200 rounded"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 px-4 max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 relative">
                    <span className="relative z-10">
                        Real Stories from{" "}
                        <span className="relative inline-block">
                            <span className="bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent font-extrabold">
                                Real People
                            </span>
                        </span>
                    </span>
                    {/* Background decorative elements */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#FFD700]/20 rounded-full blur-sm"></div>
                    <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-[#FFA500]/30 rounded-full blur-sm"></div>
                </h2>
            </div>

            {/* Auto-scrolling Testimonials */}
            <div className="relative overflow-hidden">
                <div className="flex gap-6 animate-scroll-slow">
                    {quadrupledTestimonials.map((testimonial, index) => (
                        <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
                    ))}
                </div>

                {/* Gradient fade on edges */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent pointer-events-none z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none z-10"></div>
            </div>

        </section>
    );
};