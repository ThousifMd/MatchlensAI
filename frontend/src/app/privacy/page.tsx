import React from 'react';

export default function PrivacyPage() {
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
                            Privacy Policy
                        </h1>
                        <p className="text-lg text-white/80">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12">
                        <div className="prose prose-invert max-w-none">
                            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                            <p className="text-white/90 mb-6">
                                We collect photos you upload for enhancement, basic profile information, and payment details. We do not collect unnecessary personal information.
                            </p>

                            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                            <p className="text-white/90 mb-6">
                                Your photos are used solely for the enhancement service you requested. We use your contact information to communicate about your order and deliver results.
                            </p>

                            <h2 className="text-2xl font-bold text-white mb-4">3. Photo Processing and Storage</h2>
                            <p className="text-white/90 mb-6">
                                Photos are processed using secure AI systems and are automatically deleted from our servers within 48 hours of service completion. We never share your photos with third parties.
                            </p>

                            <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
                            <p className="text-white/90 mb-6">
                                We implement industry-standard security measures including encryption, secure servers, and access controls to protect your data.
                            </p>

                            <h2 className="text-2xl font-bold text-white mb-4">5. Third-Party Services</h2>
                            <p className="text-white/90 mb-6">
                                We use trusted third-party services for payment processing and analytics. These services have their own privacy policies and we do not share your personal photos with them.
                            </p>

                            <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
                            <p className="text-white/90 mb-6">
                                You have the right to request deletion of your data, access your information, and opt out of marketing communications at any time.
                            </p>

                            <h2 className="text-2xl font-bold text-white mb-4">7. Cookies and Tracking</h2>
                            <p className="text-white/90 mb-6">
                                We use minimal cookies for website functionality and analytics. You can disable cookies in your browser settings.
                            </p>

                            <h2 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h2>
                            <p className="text-white/90 mb-6">
                                Our services are not intended for users under 18. We do not knowingly collect information from minors.
                            </p>

                            <h2 className="text-2xl font-bold text-white mb-4">9. Refund Policy & Money-Back Guarantee</h2>
                            <p className="text-white/90 mb-6">
                                We offer a <span className="text-[#FFD700] font-bold">100% money-back guarantee</span> on all our services. If you're not satisfied with the results, you must contact us within <span className="text-[#FFD700] font-bold">7 days</span> of service delivery to request a refund. Refunds will be processed within 5-7 business days after approval. The guarantee covers the quality of our photo enhancement and profile optimization services.
                            </p>

                            <h2 className="text-2xl font-bold text-white mb-4">10. International Users</h2>
                            <p className="text-white/90 mb-6">
                                If you are accessing our services from outside the United States, please be aware that your information may be transferred to and processed in the United States.
                            </p>

                            <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
                            <p className="text-white/90">
                                For privacy-related questions or requests, contact us at privacy@matchlens.ai
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
