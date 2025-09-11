"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  Brain,
  Wand2,
  Mail,
  Twitter,
  Facebook,
  Linkedin,
  MessageSquare
} from 'lucide-react';

export default function SuccessPage() {
  const router = useRouter();
  const [submissionId, setSubmissionId] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(43200); // 12 hours in seconds

  // Get submission ID from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('submissionId');
    if (id) {
      setSubmissionId(id);
    }
  }, []);

  // Photo countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);



  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const shareMessage = "Just upgraded my dating profile with AI! Getting professional photos in 12 hours ⚡️ #DatingProfileAI";
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareMessage)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareMessage + ' ' + shareUrl)}`
  };

  const nextSteps = [
    {
      icon: Brain,
      title: "AI analyzes your photos",
      description: "Our advanced AI studies your features and style preferences"
    },
    {
      icon: Wand2,
      title: "Creates optimized versions",
      description: "Generates multiple professional variations tailored for dating"
    },
    {
      icon: Mail,
      title: "Delivers to your email",
      description: "High-resolution photos sent directly to your inbox"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0">
          <CardContent className="p-8 md:p-12 text-center">
            {/* Animated Checkmark */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              className="flex justify-center mb-8"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 bg-[#d4ae36] rounded-full flex items-center justify-center">
                <Check className="w-12 h-12 md:w-16 md:h-16 text-white" strokeWidth={3} />
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-4"
            >
              Your Transformation Has Begun!
            </motion.h1>

            {/* Order Number */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-8"
            >
              <Badge variant="secondary" className="text-lg px-4 py-2 bg-[#d4ae36]/10 text-[#d4ae36] border-[#d4ae36]/20">
                Submission ID: {submissionId}
              </Badge>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mb-12 p-6 bg-[#d4ae36]/5 rounded-xl border border-[#d4ae36]/20"
            >
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                Photos ready in:
              </h2>
              <div className="text-4xl md:text-6xl font-mono font-bold text-[#d4ae36]">
                {formatTime(timeLeft)}
              </div>
            </motion.div>

            {/* What Happens Next */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                What happens next
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {nextSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 + index * 0.2 }}
                    className="p-6 bg-gray-50 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-[#d4ae36] rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Share Incentive */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9 }}
              className="mb-8 p-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-white"
            >
              <h3 className="text-xl font-bold mb-2">Share and get 5 bonus photos</h3>
              <p className="text-[#d4ae36]/80 mb-4">
                Tell your friends about your AI photo upgrade!
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={() => window.open(shareLinks.twitter, '_blank')}
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={() => window.open(shareLinks.facebook, '_blank')}
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={() => window.open(shareLinks.linkedin, '_blank')}
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={() => window.open(shareLinks.whatsapp, '_blank')}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </motion.div>

            {/* Go to Homepage Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.1 }}
            >
              <Button
                onClick={() => router.push('/')}
                className="bg-[#d4ae36] hover:bg-[#c19d2f] text-black px-8 py-3 text-lg"
              >
                Go to Homepage
              </Button>
            </motion.div>
          </CardContent>
        </Card>


      </div>
    </div>
  );
}