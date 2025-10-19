import { motion } from 'framer-motion';
import { Calendar, Shield, Users, CreditCard, Bus, AlertTriangle, Mail, Phone } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function TermsOfService() {
    const sections = [
        {
            title: 'Service Overview',
            icon: Bus,
            content: [
                'BharatBus is an online platform that facilitates bus ticket booking and travel services across India.',
                'We connect passengers with verified bus operators to provide safe and reliable transportation.',
                'Our services include ticket booking, live tracking, customer support, and travel assistance.',
                'We reserve the right to modify or discontinue services with appropriate notice to users.'
            ]
        },
        {
            title: 'User Account & Registration',
            icon: Users,
            content: [
                'Users must provide accurate, current, and complete information during registration.',
                'You are responsible for maintaining the confidentiality of your account credentials.',
                'Users must be at least 18 years old or have parental consent to use our services.',
                'One person may maintain only one active account unless specifically authorized.',
                'We reserve the right to suspend or terminate accounts that violate these terms.'
            ]
        },
        {
            title: 'Booking & Payment Terms',
            icon: CreditCard,
            content: [
                'All bookings are subject to seat availability and operator confirmation.',
                'Payment must be completed at the time of booking to secure your reservation.',
                'Prices displayed include all applicable taxes and fees unless otherwise specified.',
                'We accept major credit/debit cards, UPI, net banking, and digital wallets.',
                'Promotional offers and discounts are subject to specific terms and conditions.',
                'Refunds will be processed according to our cancellation policy within 5-7 business days.'
            ]
        },
        {
            title: 'Cancellation & Refund Policy',
            icon: AlertTriangle,
            content: [
                'Cancellations made 24+ hours before departure: 90% refund',
                'Cancellations made 2-24 hours before departure: 75% refund',
                'Cancellations made less than 2 hours before departure: No refund',
                'No-show passengers are not eligible for any refund',
                'Weather or operator-related cancellations receive full refund or free rescheduling',
                'Partial cancellations in group bookings are subject to individual assessment'
            ]
        },
        {
            title: 'Travel & Safety Guidelines',
            icon: Shield,
            content: [
                'Passengers must arrive at boarding points at least 15 minutes before departure.',
                'Valid government-issued photo ID is required for verification during travel.',
                'Luggage restrictions apply as per individual operator policies.',
                'Prohibited items include weapons, flammable substances, illegal drugs, and alcohol.',
                'Passengers must comply with safety instructions provided by bus operators.',
                'BharatBus is not liable for delays due to weather, traffic, or unforeseen circumstances.'
            ]
        },
        {
            title: 'Limitation of Liability',
            icon: Shield,
            content: [
                'BharatBus acts as an intermediary between passengers and bus operators.',
                'We are not responsible for the actions, delays, or service quality of third-party operators.',
                'Our liability is limited to the ticket value in case of confirmed booking failures.',
                'We are not liable for indirect, incidental, or consequential damages.',
                'Personal belongings and luggage are the passenger\'s responsibility.',
                'Travel insurance is recommended and available through our partner providers.'
            ]
        }
    ];

    const lastUpdated = '19th October 2025';

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 brand-gradient bg-clip-text text-transparent">
                        Terms of Service
                    </h1>
                    <p className="text-xl text-white/70 mb-4">
                        Please read these terms carefully before using BharatBus services
                    </p>
                    <div className="flex items-center justify-center gap-2 text-white/50">
                        <Calendar className="w-4 h-4" />
                        <span>Last updated: {lastUpdated}</span>
                    </div>
                </motion.div>

                {/* Introduction */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <GlassCard>
                        <h2 className="text-2xl font-bold text-white mb-4">Agreement to Terms</h2>
                        <p className="text-white/70 leading-relaxed mb-4">
                            By accessing and using BharatBus services, you agree to be bound by these Terms of Service
                            and our Privacy Policy. If you do not agree to these terms, please do not use our services.
                        </p>
                        <p className="text-white/70 leading-relaxed">
                            These terms apply to all users, including passengers, operators, and any other parties
                            accessing our platform. We reserve the right to update these terms at any time, and
                            continued use constitutes acceptance of any modifications.
                        </p>
                    </GlassCard>
                </motion.div>

                {/* Terms Sections */}
                <div className="space-y-6">
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                        >
                            <GlassCard>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                                        <section.icon className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">{section.title}</h2>
                                </div>
                                <div className="space-y-3">
                                    {section.content.map((item, itemIndex) => (
                                        <div key={itemIndex} className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                                            <p className="text-white/70 leading-relaxed">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Important Terms */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8"
                >
                    <GlassCard className="bg-orange-500/10 border-orange-500/30">
                        <h2 className="text-xl font-bold text-orange-400 mb-4">Important Additional Terms</h2>
                        <div className="space-y-3 text-white/70">
                            <p><strong>Governing Law:</strong> These terms are governed by the laws of India and subject to the jurisdiction of courts in New Delhi.</p>
                            <p><strong>Severability:</strong> If any provision of these terms is found to be unenforceable, the remaining provisions will continue to be valid.</p>
                            <p><strong>Force Majeure:</strong> We are not liable for delays or failures due to circumstances beyond our reasonable control.</p>
                            <p><strong>Entire Agreement:</strong> These terms constitute the entire agreement between you and BharatBus regarding the use of our services.</p>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Contact Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="mt-8"
                >
                    <GlassCard>
                        <h2 className="text-xl font-bold text-white mb-4">Questions About These Terms?</h2>
                        <p className="text-white/70 mb-6">
                            If you have any questions about these Terms of Service, please contact our legal team:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-orange-400" />
                                <div>
                                    <p className="text-white font-semibold">Email</p>
                                    <p className="text-white/70">legal@bharatbus.in</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-orange-400" />
                                <div>
                                    <p className="text-white font-semibold">Phone</p>
                                    <p className="text-white/70">+91 1800-XXX-LEGAL</p>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Acceptance Notice */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="mt-8 text-center"
                >
                    <GlassCard className="bg-blue-500/10 border-blue-500/30">
                        <p className="text-blue-400 font-semibold">
                            ✓ By continuing to use BharatBus, you acknowledge that you have read, understood,
                            and agree to be bound by these Terms of Service.
                        </p>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
}