"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
} from "lucide-react";
import Link from "next/link";
import { usePackage } from "@/contexts/PackageContext";
import SimplePayPalCheckout from "@/components/SimplePayPalCheckout";

// Dodo Payment Configuration
const DODO_PAYMENT_URL = process.env.NEXT_PUBLIC_DODO_PAYMENT_URL || "https://api.dodo.com/payments";

interface Package {
  id: string;
  name: string;
  originalPrice: number;
  price: number;
  features: string[];
  popular?: boolean;
}

const packages: Package[] = [
  {
    id: "starter",
    name: "Starter Package",
    originalPrice: 59,
    price: 1,
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

interface PaymentFormProps {
  selectedPackage: Package;
  onPaymentSuccess: () => void;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  onboardingFormData?: any;
}

function PaymentForm({ selectedPackage, onPaymentSuccess, showNotification, onboardingFormData }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [email, setEmail] = useState("");

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Basic validation
    if (!cardNumber || !expiryDate || !cvv || !zipCode || !email) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create payment data for Dodo
      const paymentData = {
        amount: selectedPackage.price * 100, // Convert to cents
        currency: 'usd',
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        cardNumber: cardNumber.replace(/\s/g, ''),
        expiryDate,
        cvv,
        zipCode,
        email,
        metadata: {
          packageId: selectedPackage.id,
          packageName: selectedPackage.name,
          originalPrice: selectedPackage.originalPrice,
          price: selectedPackage.price
        }
      };

      // Call Dodo payment API
      const response = await fetch('/api/dodo/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (result.success) {
        // Payment successful
        onPaymentSuccess();
      } else {
        setError(result.error || "Payment failed. Please try again.");
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError("Payment failed. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <SimplePayPalCheckout
        selectedPackage={selectedPackage}
        showNotification={showNotification}
        onPaymentSuccess={onPaymentSuccess}
        onboardingFormData={onboardingFormData}
      />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}

function TrustBadges() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-6 text-sm text-white/70">
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
        <Badge variant="secondary" className="bg-[#d4ae36]/20 text-[#d4ae36] border-[#d4ae36]/30">
          <CheckCircle className="w-3 h-3 mr-1" />
          Secure Payment
        </Badge>
        <Badge variant="secondary" className="bg-[#d4ae36]/20 text-[#d4ae36] border-[#d4ae36]/30">
          <Lock className="w-3 h-3 mr-1" />
          256-bit SSL
        </Badge>
      </div>
    </div>
  );
}

function TestimonialSidebar() {
  return (
    <div className="block space-y-6 lg:sticky lg:top-8">
      <h3 className="font-heading text-lg font-semibold text-white">
        What Our Customers Say
      </h3>

      <div className="space-y-4">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="p-4 bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl hover:bg-white/8 hover:border-white/20 transition-all duration-300 ease-out">
            <div className="flex items-start space-x-3">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1 mb-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#d4ae36] text-[#d4ae36]" />
                  ))}
                </div>
                <p className="text-sm text-white/70 mb-2">{testimonial.quote}</p>
                <p className="text-xs font-medium text-white">{testimonial.name}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { selectedPackage: contextPackage, setSelectedPackage } = usePackage();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showMobilePayment, setShowMobilePayment] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [countdown, setCountdown] = useState(24 * 60 * 60); // 24 hours in seconds
  const [onboardingFormData, setOnboardingFormData] = useState<any>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000); // Auto-hide after 4 seconds
  };

  // Load onboarding form data from localStorage
  useEffect(() => {
    const storedFormData = localStorage.getItem('onboardingFormData');
    if (storedFormData) {
      try {
        const parsedData = JSON.parse(storedFormData);
        setOnboardingFormData(parsedData);
        console.log('✅ CheckoutContent - Loaded form data:', parsedData);
      } catch (error) {
        console.error('❌ CheckoutContent - Error parsing form data:', error);
      }
    } else {
      console.warn('❌ CheckoutContent - No form data found in localStorage');
    }
  }, []);

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showSuccessPopup && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showSuccessPopup, countdown]);

  // Format countdown time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Use package from context or fallback to localStorage (client-side only)
  const [selectedPackage, setSelectedPackageState] = useState<Package | null>(null);

  useEffect(() => {
    if (contextPackage) {
      setSelectedPackageState(contextPackage);
    } else {
      // Fallback to localStorage (client-side only)
      if (typeof window !== 'undefined') {
        const packageId = localStorage.getItem('selectedPackage') || "professional";
        const pkg = packages.find(p => p.id === packageId) || packages[1];
        setSelectedPackageState(pkg);
      } else {
        // Default to professional package during SSR
        setSelectedPackageState(packages[1]);
      }
    }
  }, [contextPackage]);

  const handlePaymentSuccess = async () => {
    console.log('🎉 handlePaymentSuccess called!');

    // IMMEDIATELY trigger confetti animation and popup
    setShowConfetti(true);
    setShowSuccessPopup(true);
    setCountdown(24 * 60 * 60); // Reset to 24 hours

    console.log('🎊 Confetti and popup should be showing now!');

    // Hide confetti after 3 seconds
    setTimeout(() => setShowConfetti(false), 3000);

    // Hide success popup after 3 seconds
    setTimeout(() => setShowSuccessPopup(false), 3000);

    // Redirect to concierge page after a short delay
    setTimeout(() => {
      router.push('/concierge');
    }, 2000);
  };

  if (!selectedPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-[#d4ae36]" />
      </div>
    );
  }

  const savings = selectedPackage.originalPrice - selectedPackage.price;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Glass morphism background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0E0E0F] to-black"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#d4ae36]/5 via-transparent to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#d4ae36]/3 via-transparent to-transparent"></div>

      {/* Simple Animated Line - Below Browser Address Bar */}
      {notification && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 overflow-hidden">
          <div className={`h-full animate-line-progress-fast ${notification.type === 'success'
            ? 'bg-gradient-to-r from-green-400 to-green-500'
            : 'bg-gradient-to-r from-red-400 to-red-500'
            }`}></div>
        </div>
      )}

      {/* Payment Status Text - Shows during line animation */}
      {notification && (
        <div className="fixed top-3 right-3 md:top-2 md:right-4 z-50">
          <div className={`text-sm md:text-sm font-semibold animate-fade-in-out px-3 py-1 rounded-lg backdrop-blur-sm ${notification.type === 'success'
            ? 'text-green-300 bg-green-500/10 border border-green-500/20'
            : 'text-red-300 bg-red-500/10 border border-red-500/20'
            }`}>
            {notification.type === 'success' ? 'Payment Success' : 'Payment Failed'}
          </div>
        </div>
      )}

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Success Popup with Countdown */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
              <p className="text-gray-300">Your enhanced photos will be ready soon</p>
            </div>

            {/* Countdown Timer */}
            <div className="mb-6">
              <div className="bg-black/30 rounded-xl p-6 border border-[#d4ae36]/30">
                <h3 className="text-lg font-semibold text-[#d4ae36] mb-3">Your Profile Will Be Ready In:</h3>
                <div className="text-4xl font-mono font-bold text-white mb-2">
                  {formatTime(countdown)}
                </div>
                <p className="text-sm text-gray-400">Hours : Minutes : Seconds</p>
              </div>
            </div>


            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowSuccessPopup(false);
                  router.push('/concierge');
                }}
                className="flex-1 bg-[#d4ae36] hover:bg-[#c19d2f] text-black font-semibold"
              >
                View Status
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSuccessPopup(false)}
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">

        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/onboarding?step=5')}
            className="text-white hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Onboarding
          </Button>
        </div>

        {/* First Impression Header */}
        <div className="mb-6 md:mb-8">
          <div className="relative overflow-hidden bg-black/40 backdrop-blur-sm border-2 border-[#d4ae36]/30 rounded-xl p-4 md:p-8 text-center shadow-2xl">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#d4ae36]/20 via-[#FD5E76]/20 to-[#d4ae36]/20 animate-pulse"></div>


            {/* Quote text */}
            <div className="relative z-10">
              <p className="text-lg md:text-2xl text-white italic mb-3 md:mb-4 font-bold leading-relaxed">
                You never get a second chance to make a first impression
              </p>
              <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-[#d4ae36] to-[#FD5E76] mx-auto mb-3 md:mb-4 rounded-full"></div>
              <p className="text-base md:text-lg text-[#d4ae36] font-semibold">
                We make sure your first impression counts.
              </p>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-2 right-2 w-2 h-2 md:w-3 md:h-3 bg-[#d4ae36] rounded-full opacity-60"></div>
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 md:w-2 md:h-2 bg-[#FD5E76] rounded-full opacity-60"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {/* Order Details - Left Column */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6 order-1 lg:order-1">
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl hover:bg-white/8 hover:border-white/20 transition-all duration-300 ease-out">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <span>Order Summary</span>
                  {selectedPackage.popular && (
                    <Badge className="bg-[#d4ae36] text-black">Most Popular</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-white">{selectedPackage.name}</h3>
                    <ul className="text-sm text-white/70 mt-2 space-y-1">
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
                    <span className="text-white/70">Regular Price</span>
                    <span className="line-through text-white/70">
                      ${selectedPackage.originalPrice}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Today's Price</span>
                    <span className="text-[#d4ae36] font-semibold">
                      ${selectedPackage.price}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-[#d4ae36]">You Save</span>
                    <span className="text-[#d4ae36]">${savings}</span>
                  </div>
                </div>

                <Separator className="bg-white/20" />

                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-[#d4ae36]">${selectedPackage.price}</span>
                </div>
              </CardContent>
            </Card>

            {/* Trust Elements */}
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl hover:bg-white/8 hover:border-white/20 transition-all duration-300 ease-out">
              <CardContent className="pt-6">
                <TrustBadges />
              </CardContent>
            </Card>
          </div>

          {/* Payment Form - Center Column */}
          <div className="lg:col-span-2 order-2 lg:order-2">
            <Card className="sticky top-8 bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl hover:bg-white/8 hover:border-white/20 transition-all duration-300 ease-out">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <CreditCard className="w-5 h-5 mr-2 text-[#d4ae36]" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentForm
                  selectedPackage={selectedPackage}
                  onPaymentSuccess={handlePaymentSuccess}
                  showNotification={showNotification}
                  onboardingFormData={onboardingFormData}
                />
              </CardContent>
            </Card>
          </div>

          {/* Testimonials - Right Column */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6 order-3 lg:order-3">
            <TestimonialSidebar />
          </div>
        </div>
      </div>

      {/* Mobile Fixed Payment Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-xl border-t border-white/20 p-4 z-50">
        <button
          type="button"
          onClick={() => setShowMobilePayment(true)}
          className="relative w-full h-auto min-h-[60px] px-6 py-4 rounded-xl font-semibold text-lg bg-white/10 backdrop-blur-md hover:bg-white/15 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#FFD700]/20 overflow-hidden group touch-manipulation"
          style={{
            border: '2px solid transparent',
            background: 'linear-gradient(white/10, white/10) padding-box, linear-gradient(90deg, #d4ae36, #e6c04a, #f16b7a, #FD5E76) border-box'
          }}
        >

          <span className="relative z-20 text-white font-bold drop-shadow-lg flex items-center justify-center">
            <Lock className="w-4 h-4 mr-2" />
            Pay ${selectedPackage.price} Now
          </span>
        </button>
      </div>

      {/* Mobile Payment Modal */}
      {showMobilePayment && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-50 flex items-end">
          <div className="w-full bg-black/30 backdrop-blur-xl border-t border-white/20 rounded-t-xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Complete Payment</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobilePayment(false)}
                className="text-white hover:text-white"
              >
                ✕
              </Button>
            </div>
            <PaymentForm
              selectedPackage={selectedPackage}
              onPaymentSuccess={handlePaymentSuccess}
              showNotification={showNotification}
              onboardingFormData={onboardingFormData}
            />
          </div>
        </div>
      )}

      {/* Mobile Padding for Fixed Button */}
      <div className="lg:hidden h-24" />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-[#d4ae36]" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}