"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Users, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Package {
    id: string;
    name: string;
    originalPrice: number;
    price: number;
    features: string[];
    popular?: boolean;
    description: string;
}

const packages: Package[] = [
    {
        id: "starter",
        name: "Starter Package",
        originalPrice: 59,
        price: 1,
        description: "Perfect for getting started with enhanced photos",
        features: [
            "20 enhanced photos",
            "3 style variations",
            "Basic bio tips",
            "24-hour delivery",
        ],
    },
    {
        id: "professional",
        name: "Professional Package",
        originalPrice: 99,
        price: 1,
        description: "Our most popular choice for serious daters",
        features: [
            "50 enhanced photos",
            "6 style variations",
            "Bio optimization",
            "Profile strategy guide",
            "12-hour delivery",
        ],
        popular: true,
    },
    {
        id: "elite",
        name: "Elite Package",
        originalPrice: 149,
        price: 1,
        description: "Complete profile transformation",
        features: [
            "100 enhanced photos",
            "10 style variations",
            "Complete profile makeover",
            "Message templates",
            "Priority 6-hour delivery",
        ],
    },
    {
        id: "vip",
        name: "VIP Package",
        originalPrice: 249,
        price: 1,
        description: "Premium service with personal consultation",
        features: [
            "Unlimited photos",
            "All styles",
            "1-on-1 consultation",
            "Weekly updates for 1 month",
            "2-hour rush delivery",
        ],
    },
];

const testimonials = [
    {
        name: "Alex M.",
        image: "/images/s7.jpg",
        quote: "Got 10x more matches in the first week! The AI enhancement made my photos look naturally perfect.",
        rating: 5,
    },
    {
        name: "Mike R.",
        image: "/images/s8.jpg",
        quote: "Amazing results! The professional package transformed my dating profile completely.",
        rating: 5,
    },
    {
        name: "David L.",
        image: "/images/s9.jpg",
        quote: "Worth every penny. The enhanced photos looked so natural, nobody could tell they were AI-optimized.",
        rating: 5,
    },
];

export default function PricingPage() {
    const router = useRouter();
    const [selectedPackage, setSelectedPackage] = useState<string>("");

    const handleSelectPackage = (packageId: string) => {
        setSelectedPackage(packageId);
    };

    const handleDeselectPackage = () => {
        setSelectedPackage("");
    };

    const handleContinueToCheckout = () => {
        // Store selected package in localStorage
        localStorage.setItem('selectedPackage', selectedPackage);
        // Redirect to onboarding questionnaire first
        router.push('/onboarding');
    };

    return (
        <div
            className="min-h-screen bg-black text-white relative overflow-hidden"
            onClick={handleDeselectPackage}
        >
            {/* Glass morphism background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0E0E0F] to-black"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#d4ae36]/5 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#d4ae36]/3 via-transparent to-transparent"></div>

            {/* Header */}
            <div
                className="relative z-10 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-xl border-2 border-[#d4ae36]/30 rounded-3xl shadow-2xl mx-6 mt-6 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center space-x-4">
                    <Button asChild variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20 transition-all duration-200">
                        <Link href="/onboarding">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Questionnaire
                        </Link>
                    </Button>
                    <h1 className="text-xl font-semibold text-white">Choose Your Package</h1>
                </div>
            </div>

            <div
                className="relative z-10 max-w-7xl mx-auto px-4 py-12"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
                        Choose Your Transformation
                    </h2>
                    <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
                        Select the package that best fits your dating goals. All packages include our AI-powered photo enhancement and profile optimization.
                    </p>

                    {/* Trust Indicators */}
                    <div className="flex items-center justify-center gap-8 text-sm text-white/70 mb-8">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#d4ae36]" />
                            <span>2,847+ customers served</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-[#d4ae36]" />
                            <span>4.9/5 rating</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#d4ae36]" />
                            <span>Money-back guarantee</span>
                        </div>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {packages.map((pkg) => {
                        const isSelected = selectedPackage === pkg.id;
                        const savings = pkg.originalPrice - pkg.price;

                        return (
                            <Card
                                key={pkg.id}
                                className={`cursor-pointer transition-all duration-300 ease-out relative ${isSelected
                                    ? "bg-white/10 backdrop-blur-md border-2 border-[#d4ae36] shadow-lg shadow-[#d4ae36]/30 scale-105"
                                    : "bg-white/5 backdrop-blur-sm border border-white/20 hover:border-[#d4ae36] hover:bg-white/8 hover:scale-[1.02]"
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent deselection when clicking on card
                                    // Just for visual feedback - don't actually select
                                    // The actual selection happens only via the button
                                }}
                            >
                                {/* Most Popular Badge - Positioned absolutely */}
                                {pkg.popular && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                                        <div className="bg-gradient-to-r from-[#d4ae36] to-[#c19d2f] text-black px-4 py-1.5 rounded-full text-sm font-bold shadow-lg border-2 border-white/20">
                                            ⭐ Most Popular
                                        </div>
                                    </div>
                                )}

                                <CardHeader className="text-center pb-6 pt-8 px-6">
                                    <CardTitle className="text-2xl font-bold text-white mb-3">
                                        {pkg.name}
                                    </CardTitle>
                                    <p className="text-white/70 text-base mb-6">
                                        {pkg.description}
                                    </p>

                                    {/* Pricing */}
                                    <div className="space-y-3">
                                        <div className="text-4xl font-black text-[#d4ae36]">
                                            ${pkg.price}
                                        </div>
                                        <div className="text-base text-white/60 line-through">
                                            ${pkg.originalPrice}
                                        </div>
                                        <div className="text-base text-[#d4ae36] font-semibold">
                                            Save ${savings}
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-0 px-6 pb-6">
                                    <ul className="space-y-4 mb-8">
                                        {pkg.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-[#d4ae36] mt-0.5 flex-shrink-0" />
                                                <span className="text-white/90 text-base">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        className={`w-full h-12 text-base font-semibold transition-all duration-200 ${isSelected
                                            ? "bg-[#d4ae36] hover:bg-[#c19d2f] text-black shadow-lg"
                                            : "bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-[#d4ae36]/50"
                                            }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push('/onboarding');
                                        }}
                                    >
                                        Make me a match magnet
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Continue Button */}
                <div className="text-center">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent deselection when clicking button
                            handleContinueToCheckout();
                        }}
                        disabled={!selectedPackage}
                        className={`text-xl font-bold px-12 py-6 rounded-2xl transition-all duration-300 ease-out border-2 backdrop-blur-sm ${selectedPackage
                            ? "bg-gradient-to-r from-[#d4ae36] to-[#c19d2f] hover:from-[#c19d2f] hover:to-[#b8941f] text-black hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#d4ae36]/30 border-[#d4ae36]/20"
                            : "bg-white/10 text-white/50 border-white/20 cursor-not-allowed"
                            }`}
                    >
                        <span className="flex items-center gap-3">
                            <span>{selectedPackage ? "Continue to Checkout" : "Select a Package First"}</span>
                            {selectedPackage && <ArrowRight className="w-6 h-6" />}
                        </span>
                    </Button>
                    <div className="mt-6 space-y-2">
                        <p className="text-white/70 text-sm">
                            🔒 Secure payment • 30-day money-back guarantee
                        </p>
                        <p className="text-[#d4ae36] text-sm font-medium">
                            Your photos will be ready within 24 hours
                        </p>
                    </div>
                </div>

                {/* Testimonials */}
                <div className="mt-20">
                    <h3 className="text-2xl font-bold text-white text-center mb-12">
                        What Our Customers Say
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="bg-white/5 backdrop-blur-sm border border-white/20">
                                <CardContent className="p-6">
                                    <div className="flex items-start space-x-3">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-1 mb-2">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 fill-[#d4ae36] text-[#d4ae36]" />
                                                ))}
                                            </div>
                                            <p className="text-white/90 text-sm mb-3">{testimonial.quote}</p>
                                            <p className="text-white font-medium text-sm">{testimonial.name}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
