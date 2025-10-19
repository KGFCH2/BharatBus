import { motion } from 'framer-motion';
import { Calendar, Shield, Database, Users, Eye, Lock, Globe, Phone, Mail, AlertTriangle } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function PrivacyPolicy() {
    const sections = [
        {
            title: 'Information We Collect',
            icon: Database,
            content: [
                'Personal Information: Name, email address, phone number, date of birth, and government ID details',
                'Booking Information: Travel preferences, passenger details, payment information, and transaction history',
                'Technical Information: IP address, browser type, device information, and usage analytics',
                'Location Data: GPS coordinates when using our mobile app (with your consent)',
                'Communication Records: Support tickets, feedback, and correspondence with our team',
                'Cookies and Tracking: Website preferences, session data, and behavioral analytics'
            ]
        },
        {
            title: 'How We Use Your Information',
            icon: Users,
            content: [
                'Processing bookings and facilitating travel arrangements with bus operators',
                'Providing customer support and resolving travel-related issues',
                'Sending booking confirmations, travel updates, and important notifications',
                'Improving our services through analytics and user experience research',
                'Preventing fraud and ensuring platform security',
                'Marketing communications (with your consent) about offers and new services',
                'Compliance with legal obligations and regulatory requirements'
            ]
        },
        {
            title: 'Information Sharing & Disclosure',
            icon: Eye,
            content: [
                'Bus Operators: Passenger details necessary for travel verification and service delivery',
                'Payment Processors: Transaction information required for secure payment processing',
                'Service Providers: Technical partners who help us operate and improve our platform',
                'Legal Compliance: When required by law enforcement or regulatory authorities',
                'Business Transfers: In case of merger, acquisition, or sale of company assets',
                'Emergency Situations: To protect safety and security of passengers or prevent illegal activities',
                'We never sell personal information to third parties for marketing purposes'
            ]
        },
        {
            title: 'Data Security & Protection',
            icon: Shield,
            content: [
                'Industry-standard 256-bit SSL encryption for all data transmission',
                'Secure data centers with physical and electronic access controls',
                'Regular security audits and vulnerability assessments',
                'Staff training on data protection and privacy best practices',
                'Multi-factor authentication for administrative access',
                'Automated backup systems and disaster recovery procedures',
                'PCI DSS compliance for payment card data handling'
            ]
        },
        {
            title: 'Your Privacy Rights',
            icon: Lock,
            content: [
                'Access: Request a copy of personal information we have about you',
                'Correction: Update or correct inaccurate personal information',
                'Deletion: Request deletion of your personal data (subject to legal requirements)',
                'Portability: Receive your data in a structured, machine-readable format',
                'Restriction: Limit how we process your personal information',
                'Objection: Opt-out of certain processing activities, including marketing',
                'Withdrawal: Withdraw consent for data processing where applicable'
            ]
        },
        {
            title: 'Cookies & Tracking Technologies',
            icon: Globe,
            content: [
                'Essential Cookies: Required for basic website functionality and security',
                'Performance Cookies: Help us understand how visitors interact with our website',
                'Functional Cookies: Remember your preferences and personalize your experience',
                'Marketing Cookies: Used to deliver relevant advertisements and measure campaign effectiveness',
                'You can manage cookie preferences through your browser settings',
                'Disabling certain cookies may limit website functionality and user experience'
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
                        Privacy Policy
                    </h1>
                    <p className="text-xl text-white/70 mb-4">
                        Your privacy is important to us. Learn how we collect, use, and protect your information.
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
                        <h2 className="text-2xl font-bold text-white mb-4">Our Commitment to Privacy</h2>
                        <p className="text-white/70 leading-relaxed mb-4">
                            At BharatBus, we are committed to protecting your privacy and ensuring the security of your
                            personal information. This Privacy Policy explains how we collect, use, share, and safeguard
                            your information when you use our services.
                        </p>
                        <p className="text-white/70 leading-relaxed">
                            By using BharatBus, you consent to the practices described in this policy. We encourage you
                            to read this policy carefully and contact us if you have any questions or concerns.
                        </p>
                    </GlassCard>
                </motion.div>

                {/* Privacy Sections */}
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
                                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                                        <section.icon className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">{section.title}</h2>
                                </div>
                                <div className="space-y-3">
                                    {section.content.map((item, itemIndex) => (
                                        <div key={itemIndex} className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                            <p className="text-white/70 leading-relaxed">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

                {/* Data Retention */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8"
                >
                    <GlassCard>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-purple-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Data Retention Policy</h2>
                        </div>
                        <div className="space-y-3 text-white/70">
                            <p><strong>Account Information:</strong> Retained while your account is active and for 3 years after closure</p>
                            <p><strong>Booking Records:</strong> Maintained for 7 years for legal compliance and tax purposes</p>
                            <p><strong>Payment Data:</strong> Stored according to payment processor requirements (typically 12-24 months)</p>
                            <p><strong>Support Communications:</strong> Kept for 2 years to provide consistent customer service</p>
                            <p><strong>Analytics Data:</strong> Aggregated and anonymized data may be retained indefinitely for research</p>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Children's Privacy */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="mt-8"
                >
                    <GlassCard className="bg-red-500/10 border-red-500/30">
                        <h2 className="text-xl font-bold text-red-400 mb-4">Children's Privacy</h2>
                        <p className="text-white/70 leading-relaxed mb-4">
                            BharatBus is not intended for children under 13 years of age. We do not knowingly collect
                            personal information from children under 13. If you are a parent or guardian and believe
                            your child has provided us with personal information, please contact us immediately.
                        </p>
                        <p className="text-white/70 leading-relaxed">
                            For users between 13-18 years old, parental consent is required for account creation and
                            data processing activities.
                        </p>
                    </GlassCard>
                </motion.div>

                {/* International Transfers */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="mt-8"
                >
                    <GlassCard>
                        <h2 className="text-xl font-bold text-white mb-4">International Data Transfers</h2>
                        <p className="text-white/70 leading-relaxed mb-4">
                            Your information may be transferred to and processed in countries other than your country of
                            residence. We ensure appropriate safeguards are in place to protect your information during
                            international transfers, including:
                        </p>
                        <div className="space-y-2 text-white/70">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Adequacy decisions by relevant data protection authorities</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Standard contractual clauses approved by regulatory bodies</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Certification schemes and codes of conduct</p>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Contact Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="mt-8"
                >
                    <GlassCard>
                        <h2 className="text-xl font-bold text-white mb-4">Privacy Questions & Data Protection Officer</h2>
                        <p className="text-white/70 mb-6">
                            If you have questions about this Privacy Policy or want to exercise your privacy rights,
                            please contact our Data Protection Officer:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-400" />
                                <div>
                                    <p className="text-white font-semibold">Email</p>
                                    <p className="text-white/70">privacy@bharatbus.in</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-blue-400" />
                                <div>
                                    <p className="text-white font-semibold">Phone</p>
                                    <p className="text-white/70">+91 1800-XXX-PRIVACY</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                            <p className="text-blue-400 text-sm">
                                <strong>Response Time:</strong> We will respond to privacy requests within 30 days.
                                For urgent matters, please call our privacy hotline.
                            </p>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Policy Updates */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="mt-8"
                >
                    <GlassCard className="bg-orange-500/10 border-orange-500/30">
                        <h2 className="text-xl font-bold text-orange-400 mb-4">Policy Updates</h2>
                        <p className="text-white/70 leading-relaxed">
                            We may update this Privacy Policy from time to time to reflect changes in our practices,
                            technology, legal requirements, or other factors. We will notify you of significant changes
                            via email or prominent website notice at least 30 days before they take effect. Your
                            continued use of our services after policy updates constitutes acceptance of the revised terms.
                        </p>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
}