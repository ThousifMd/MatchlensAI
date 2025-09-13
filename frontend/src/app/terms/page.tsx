import React from 'react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Glass morphism background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0E0E0F] to-black"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#d4ae36]/5 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#d4ae36]/3 via-transparent to-transparent"></div>

            <div className="relative z-10 container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                            Terms of Service
                        </h1>
                        <p className="text-lg text-white/80">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12">
                        <div className="prose prose-invert max-w-none">
                            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                            <p className="text-white/90 mb-6">
                                By accessing and using Matchlens AI services, you accept and agree to be bound by the terms and provision of this agreement.
                            </p>

                            <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
                            <p className="text-white/90 mb-6">
                                Matchlens AI provides AI-powered photo enhancement and profile optimization services for dating apps and social media platforms.
                            </p>

                            <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
                            <p className="text-white/90 mb-6">
                                Users are responsible for providing accurate information and ensuring they have the right to use any photos they submit for enhancement.
                            </p>

                            <h2 className="text-2xl font-bold text-white mb-4">4. Privacy and Data Protection</h2>
                            <p className="text-white/90 mb-6">
                                We take your privacy seriously. All photos are processed securely and deleted after service delivery. Please see our Privacy Policy for detailed information.
                            </p>

                            <h2 className="text-2xl font-bold text-white mb-4">5. Service Availability</h2>
                            <p className="text-white/90 mb-6">
                                We strive to provide reliable service but cannot guarantee uninterrupted access. Service may be temporarily unavailable for maintenance.
                            </p>

                            <h2 className="text-2xl font-bold text-white mb-4">6. Refund Policy & Money-Back Guarantee</h2>
                            <p className="text-white/90 mb-6">
                                We offer a <span className="text-[#FFD700] font-bold">100% money-back guarantee</span> on all our services. If you're not satisfied with the results, you must contact us within <span className="text-[#FFD700] font-bold">7 days</span> of service delivery to request a refund. Refunds will be processed within 5-7 business days after approval. The guarantee covers the quality of our photo enhancement and profile optimization services.
                            </p>

                            <h2 className="text-2xl font-bold text-white mb-4">7. Limitation of Liability</h2>
                            <p className="text-white/90 mb-6">
                                Matchlens AI's liability is limited to the amount paid for our services. We are not responsible for dating outcomes or third-party platform changes.
                            </p>

                            <h2 className="text-2xl font-bold text-white mb-4">8. Changes to Terms</h2>
                            <p className="text-white/90 mb-6">
                                We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of any changes.
                            </p>

                            <h2 className="text-2xl font-bold text-white mb-4">9. Contact Information</h2>
                            <p className="text-white/90">
                                If you have questions about these Terms of Service, please contact us at support@matchlens.ai
                            </p>
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="text-center mt-8">
                        <a
                            href="/"
                            className="inline-flex items-center px-6 py-3 bg-[#d4ae36] text-black font-semibold rounded-lg hover:bg-[#FFD700] transition-colors duration-200"
                        >
                            ← Back to Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
