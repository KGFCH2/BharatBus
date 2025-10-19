import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle, Clock, CreditCard, MapPin, Users, Shield, Phone } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function FAQs() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

    const categories = [
        { id: 'all', name: 'All Categories', icon: HelpCircle, color: 'text-orange-400' },
        { id: 'booking', name: 'Booking', icon: Clock, color: 'text-blue-400' },
        { id: 'payment', name: 'Payment', icon: CreditCard, color: 'text-green-400' },
        { id: 'travel', name: 'Travel', icon: MapPin, color: 'text-purple-400' },
        { id: 'account', name: 'Account', icon: Users, color: 'text-cyan-400' },
        { id: 'safety', name: 'Safety', icon: Shield, color: 'text-red-400' }
    ];

    const faqs = [
        {
            category: 'booking',
            question: 'How do I book a bus ticket on BharatBus?',
            answer: 'To book a ticket: 1) Go to the "Book Ticket" page, 2) Enter your departure and destination cities, 3) Select your travel date and number of passengers, 4) Fill in passenger details and contact information, 5) Click "Book Now" to confirm your reservation. You\'ll receive a confirmation with a QR code ticket.'
        },
        {
            category: 'booking',
            question: 'Can I cancel or modify my booking?',
            answer: 'Yes, you can cancel or modify your booking up to 2 hours before departure. Cancellations made 24+ hours in advance receive 90% refund, 2-24 hours receive 75% refund. Modifications are subject to seat availability and may incur additional charges.'
        },
        {
            category: 'booking',
            question: 'How early should I book my ticket?',
            answer: 'We recommend booking at least 1-2 days in advance for popular routes. For festival seasons and holidays, book 1-2 weeks early. Last-minute bookings are possible but subject to availability.'
        },
        {
            category: 'payment',
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit/debit cards (Visa, MasterCard, RuPay), UPI payments (Google Pay, PhonePe, Paytm), net banking from 50+ banks, and digital wallets. All transactions are secured with 256-bit SSL encryption.'
        },
        {
            category: 'payment',
            question: 'Is my payment information secure?',
            answer: 'Absolutely! We use industry-standard encryption and never store your complete card details. All payments are processed through certified payment gateways that comply with PCI DSS standards.'
        },
        {
            category: 'payment',
            question: 'How long does it take to receive a refund?',
            answer: 'Refunds are typically processed within 5-7 business days for credit/debit cards and 1-3 business days for UPI/wallet payments. The exact time may vary depending on your bank or payment provider.'
        },
        {
            category: 'travel',
            question: 'Where can I find my boarding point?',
            answer: 'Your boarding point details are included in your ticket confirmation. You can also use our "Live Tracking" feature to see real-time bus location and estimated arrival time at your boarding point.'
        },
        {
            category: 'travel',
            question: 'What luggage can I bring on the bus?',
            answer: 'Each passenger can bring 1 piece of cabin luggage (up to 10kg) and 1 checked bag (up to 20kg). Prohibited items include flammable substances, weapons, and illegal materials. Musical instruments and sports equipment may require special arrangement.'
        },
        {
            category: 'travel',
            question: 'What if my bus is delayed or cancelled?',
            answer: 'In case of delays, you\'ll receive SMS/email notifications with updated timings. For cancellations due to weather or technical issues, we offer full refund or free rescheduling to the next available service.'
        },
        {
            category: 'account',
            question: 'Do I need to create an account to book tickets?',
            answer: 'While you can browse routes without an account, creating one allows you to save booking history, manage reservations, and receive personalized offers. Account creation is free and takes less than 2 minutes.'
        },
        {
            category: 'account',
            question: 'How do I reset my password?',
            answer: 'Click "Forgot Password" on the login page, enter your registered email, and follow the reset link sent to your inbox. If you don\'t receive the email within 10 minutes, check your spam folder or contact support.'
        },
        {
            category: 'account',
            question: 'Can I change my profile information?',
            answer: 'Yes, you can update your name, phone number, and email address in the "My Profile" section. Email changes require verification, and some changes may take 24 hours to reflect across all services.'
        },
        {
            category: 'safety',
            question: 'What safety measures are in place?',
            answer: 'All our buses undergo regular safety inspections, drivers are verified and trained, GPS tracking is enabled on all vehicles, and we maintain 24/7 monitoring. Emergency contact information is provided with every booking.'
        },
        {
            category: 'safety',
            question: 'What COVID-19 precautions do you follow?',
            answer: 'We follow government guidelines including regular sanitization, driver health checks, reduced capacity when required, and provide hand sanitizers. Passengers are encouraged to wear masks and maintain social distancing.'
        },
        {
            category: 'safety',
            question: 'Who do I contact in case of emergency?',
            answer: 'For travel emergencies, call our 24/7 helpline at +91 1800-HELP-NOW. For medical emergencies, contact local authorities (108/102) and inform our support team. Emergency contact details are included in your ticket.'
        }
    ];

    const filteredFAQs = faqs.filter(faq => {
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
        const matchesSearch = searchQuery === '' ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 brand-gradient bg-clip-text text-transparent">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl text-white/70 mb-8">Find quick answers to common questions about BharatBus</p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative mb-8">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search FAQs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
                        />
                    </div>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${activeCategory === category.id
                                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                                    }`}
                            >
                                <category.icon className={`w-4 h-4 ${activeCategory === category.id ? 'text-orange-400' : category.color}`} />
                                {category.name}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* FAQ List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    {filteredFAQs.length === 0 ? (
                        <GlassCard className="text-center py-12">
                            <HelpCircle className="w-12 h-12 text-white/40 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white/60 mb-2">No FAQs found</h3>
                            <p className="text-white/40">Try adjusting your search or category filter.</p>
                        </GlassCard>
                    ) : (
                        filteredFAQs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                            >
                                <GlassCard className="no-glow">
                                    <button
                                        onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                                        className="w-full flex items-center justify-between text-left group border-none outline-none focus:outline-none focus:ring-0"
                                    >
                                        <h3 className="text-lg font-semibold text-white pr-4 group-hover:text-orange-400 transition-colors">{faq.question}</h3>
                                        {expandedFAQ === index ? (
                                            <ChevronUp className="w-5 h-5 text-orange-400 flex-shrink-0" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-white/60 flex-shrink-0" />
                                        )}
                                    </button>

                                    {expandedFAQ === index && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-4 pt-4 border-t border-white/10"
                                        >
                                            <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </GlassCard>
                            </motion.div>
                        ))
                    )}
                </motion.div>

                {/* Contact Support */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 text-center"
                >
                    <GlassCard>
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Phone className="w-6 h-6 text-orange-400" />
                            <h3 className="text-xl font-semibold text-white">Still have questions?</h3>
                        </div>
                        <p className="text-white/70 mb-6">
                            Our support team is here to help you with any additional questions or concerns.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <button
                                className="px-6 py-3 rounded-xl bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-all font-semibold"
                                onClick={() => window.alert('Contact Support feature coming soon!')}
                            >
                                Contact Support
                            </button>
                            <button
                                className="px-6 py-3 rounded-xl bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-all font-semibold"
                                onClick={() => window.alert('Suggest a Topic feature coming soon!')}
                            >
                                Suggest a Topic
                            </button>
                            <button
                                className="px-6 py-3 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all font-semibold"
                                onClick={() => window.alert('Submit Feedback feature coming soon!')}
                            >
                                Submit Feedback
                            </button>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
}