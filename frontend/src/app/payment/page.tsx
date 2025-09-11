"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Shield,
    CreditCard,
    Lock,
    CheckCircle,
    Star,
    Users,
    RotateCcw,
    Loader2,
    ArrowLeft,
    Check,
    Brain,
    Wand2,
    Mail,
} from "lucide-react";
import Link from "next/link";
import { trackPurchase } from "@/lib/metaPixel";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51H0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
);

interface Package {
    id: string;
    name: string;
    originalPrice: number;
    salePrice: number;
    features: string[];
    popular?: boolean;
}

const packages: Package[] = [
    {
        id: "starter",
        name: "Starter Package",
        originalPrice: 59,
        salePrice: 39,
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
        salePrice: 69,
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
        salePrice: 99,
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
        salePrice: 199,
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
        name: "Sarah M.",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
        quote: "Got 10x more matches in the first week! The AI enhancement made my photos look naturally perfect.",
        rating: 5,
    },
    {
        name: "Mike R.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
        quote: "Amazing results! The professional package transformed my dating profile completely.",
        rating: 5,
    },
    {
        name: "Jessica L.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
        quote: "Worth every penny. The enhanced photos looked so natural, nobody could tell they were AI-optimized.",
        rating: 5,
    },
];

interface PaymentFormProps {
    selectedPackage: Package;
    onPaymentSuccess: (submissionId: string) => void;
    submissionId: string;
}

function PaymentForm({ selectedPackage, onPaymentSuccess, submissionId }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [zipCode, setZipCode] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);
        setError(null);

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError("Card information is required");
            setIsLoading(false);
            return;
        }

        try {
            // Simulate payment processing for demo
            await new Promise(resolve => setTimeout(resolve, 2000));
            onPaymentSuccess(submissionId);
        } catch (err) {
            setError("Payment failed. Please try again.");
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Card Information
                    </label>
                    <div className="p-3 border border-input rounded-lg bg-background">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: "16px",
                                        color: "#374151",
                                        "::placeholder": {
                                            color: "#9CA3AF",
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-foreground mb-2">
                        ZIP Code
                    </label>
                    <Input
                        id="zipCode"
                        type="text"
                        placeholder="12345"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        required
                    />
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            <Button
                type="submit"
                disabled={!stripe || isLoading}
                className="w-full bg-[#d4ae36] hover:bg-[#c19d2f] text-black font-semibold py-3 text-lg"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <Lock className="w-4 h-4 mr-2" />
                        Pay ${selectedPackage.salePrice} Now
                    </>
                )}
            </Button>

            <div className="space-y-3">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full py-3 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                    disabled={isLoading}
                >
                    <div className="flex items-center justify-center">
                        <span className="font-bold text-blue-800 mr-2">Pay</span>
                        <span className="font-bold text-blue-600">Pal</span>
                    </div>
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full py-3 text-lg border-2 border-black text-black hover:bg-gray-50"
                    disabled={isLoading}
                >
                    <div className="flex items-center justify-center">
                        <span className="mr-2">🍎</span>
                        Pay with Apple Pay
                    </div>
                </Button>
            </div>
        </form>
    );
}

function TrustBadges() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-[#d4ae36]" />
                    <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-2">
                    <RotateCcw className="w-4 h-4 text-[#d4ae36]" />
                    <span>Money Back Guarantee</span>
                </div>
            </div>

            <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-[#d4ae36]">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">2,847 customers served</span>
                </div>
            </div>

            <div className="flex justify-center space-x-4">
                <Badge variant="secondary" className="bg-[#d4ae36]/10 text-[#d4ae36] border-[#d4ae36]/20">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Secure Payment
                </Badge>
                <Badge variant="secondary" className="bg-[#d4ae36]/10 text-[#d4ae36] border-[#d4ae36]/20">
                    <Lock className="w-3 h-3 mr-1" />
                    256-bit SSL
                </Badge>
            </div>
        </div>
    );
}

function TestimonialSidebar() {
    return (
        <div className="hidden xl:block w-80 space-y-6 sticky top-8">
            <h3 className="font-heading text-lg font-semibold text-foreground">
                What Our Customers Say
            </h3>

            <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                    <Card key={index} className="p-4">
                        <div className="flex items-start space-x-3">
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-1 mb-1">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{testimonial.quote}</p>
                                <p className="text-xs font-medium text-foreground">{testimonial.name}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function PaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    const [submissionId, setSubmissionId] = useState<string>('');
    const [showMobilePayment, setShowMobilePayment] = useState(false);

    useEffect(() => {
        const packageId = searchParams.get("package") || "professional";
        const submission = searchParams.get("submissionId");
        const pkg = packages.find(p => p.id === packageId) || packages[1];
        setSelectedPackage(pkg);
        if (submission) {
            setSubmissionId(submission);
        }
    }, [searchParams]);

    const handlePaymentSuccess = (submissionId: string) => {
        // Track successful purchase
        if (selectedPackage) {
            trackPurchase(selectedPackage.salePrice, 'USD', selectedPackage.name);
        }

        // Redirect to success page with submission ID
        router.push(`/onboarding/success?submissionId=${submissionId}`);
    };

    if (!selectedPackage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-[#d4ae36]" />
            </div>
        );
    }

    const savings = selectedPackage.originalPrice - selectedPackage.salePrice;

    return (
        <Elements stripe={stripePromise}>
            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="border-b border-border bg-background">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="flex items-center space-x-4">
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Homepage
                                </Link>
                            </Button>
                            <h1 className="text-xl font-semibold text-foreground">Complete Your Order</h1>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                        {/* Order Details - Left Column */}
                        <div className="xl:col-span-2 space-y-6">
                            {/* Success Message */}
                            <Card className="border-[#d4ae36]/20 bg-[#d4ae36]/5">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-[#d4ae36] rounded-full flex items-center justify-center">
                                            <Check className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-[#d4ae36]">Questionnaire Completed!</h3>
                                            <p className="text-sm text-[#d4ae36]/80">Your profile information has been saved. Now let's get your photos enhanced!</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* First Impression Message */}
                            <div className="bg-gradient-to-r from-[#d4ae36] to-[#FD5E76] p-6 rounded-lg text-center shadow-lg">
                                <p className="text-xl text-white italic mb-3 font-bold">
                                    "You never get a second chance to make a first impression"
                                </p>
                                <p className="text-lg text-[#d4ae36] font-semibold">
                                    We make sure your first impression counts.
                                </p>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>Order Summary</span>
                                        {selectedPackage.popular && (
                                            <Badge className="bg-[#d4ae36] text-black">Most Popular</Badge>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-lg">{selectedPackage.name}</h3>
                                            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                                                {selectedPackage.features.map((feature, index) => (
                                                    <li key={index} className="flex items-center">
                                                        <CheckCircle className="w-4 h-4 text-[#d4ae36] mr-2 flex-shrink-0" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Regular Price</span>
                                            <span className="line-through text-muted-foreground">
                                                ${selectedPackage.originalPrice}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Today's Price</span>
                                            <span className="text-[#d4ae36] font-semibold">
                                                ${selectedPackage.salePrice}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm font-medium">
                                            <span className="text-[#d4ae36]">You Save</span>
                                            <span className="text-[#d4ae36]">${savings}</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-[#d4ae36]">${selectedPackage.salePrice}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Trust Elements */}
                            <Card>
                                <CardContent className="pt-6">
                                    <TrustBadges />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Payment Form - Center Column */}
                        <div className="xl:col-span-1">
                            <Card className="sticky top-8">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        Payment Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <PaymentForm
                                        selectedPackage={selectedPackage}
                                        onPaymentSuccess={handlePaymentSuccess}
                                        submissionId={submissionId}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Testimonials - Right Sidebar */}
                        <div className="xl:col-span-1">
                            <TestimonialSidebar />
                        </div>
                    </div>
                </div>

                {/* Mobile Fixed Payment Button */}
                <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50">
                    <Button
                        onClick={() => setShowMobilePayment(true)}
                        className="w-full bg-[#d4ae36] hover:bg-[#c19d2f] text-black font-semibold py-4 text-lg"
                    >
                        <Lock className="w-4 h-4 mr-2" />
                        Pay ${selectedPackage.salePrice} Now
                    </Button>
                </div>

                {/* Mobile Payment Modal */}
                {showMobilePayment && (
                    <div className="xl:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
                        <div className="w-full bg-background rounded-t-xl p-6 max-h-[80vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Complete Payment</h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowMobilePayment(false)}
                                >
                                    ✕
                                </Button>
                            </div>
                            <PaymentForm
                                selectedPackage={selectedPackage}
                                onPaymentSuccess={handlePaymentSuccess}
                                submissionId={submissionId}
                            />
                        </div>
                    </div>
                )}

                {/* Mobile Padding for Fixed Button */}
                <div className="xl:hidden h-20" />
            </div>
        </Elements>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-[#d4ae36]" />
            </div>
        }>
            <PaymentContent />
        </Suspense>
    );
}
