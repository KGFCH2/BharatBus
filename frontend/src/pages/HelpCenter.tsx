import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, Phone, Mail, MessageCircle, Clock, MapPin, CreditCard, Bus, Users, Shield } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function HelpCenter() {
    const [searchQuery, setSearchQuery] = useState('');

    const helpCategories = [
        {
            title: 'Booking & Reservations',
            icon: Bus,
            color: 'text-orange-400',
            topics: [
                'How to book a bus ticket online',
                'Cancellation and refund policy',
                'Seat selection guidelines',
                'Group booking discounts',
                'Booking modification process'
            ]
        },
        {
            title: 'Payment & Billing',
            icon: CreditCard,
            color: 'text-green-400',
            topics: [
                'Accepted payment methods',
                'Payment security measures',
                'Transaction failure resolution',
                'Invoice and receipt generation',
                'Refund processing timeline'
            ]
        },
        {
            title: 'Travel Information',
            icon: MapPin,
            color: 'text-blue-400',
            topics: [
                'Route information and schedules',
                'Boarding point locations',
                'Luggage policies and restrictions',
                'Travel time estimations',
                'Weather-related delays'
            ]
        },
        {
            title: 'Account & Profile',
            icon: Users,
            color: 'text-purple-400',
            topics: [
                'Creating and managing account',
                'Password reset procedures',
                'Profile information updates',
                'Notification preferences',
                'Account security settings'
            ]
        },
        {
            title: 'Safety & Security',
            icon: Shield,
            color: 'text-red-400',
            topics: [
                'Travel safety guidelines',
                'Emergency contact procedures',
                'Data privacy and protection',
                'Fraud prevention measures',
                'COVID-19 safety protocols'
            ]
        },
        {
            title: 'Technical Support',
            icon: MessageCircle,
            color: 'text-cyan-400',
            topics: [
                'App installation and updates',
                'Website navigation help',
                'Browser compatibility issues',
                'Mobile app troubleshooting',
                'System maintenance updates'
            ]
        }
    ];

    const contactOptions = [
        {
            title: '24/7 Helpline',
            icon: Phone,
            description: 'Call our support team anytime',
            contact: '+91 1800-XXX-XXXX',
            color: 'text-green-400'
        },
        {
            title: 'Email Support',
            icon: Mail,
            description: 'Get detailed assistance via email',
            contact: 'support@bharatbus.in',
            color: 'text-blue-400'
        },
        {
            title: 'Live Chat',
            icon: MessageCircle,
            description: 'Chat with our support agents',
            contact: 'Available 6 AM - 11 PM',
            color: 'text-purple-400'
        }
    ];

    const filteredCategories = helpCategories.filter(category =>
        category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 brand-gradient bg-clip-text text-transparent">
                        Help Center
                    </h1>
                    <p className="text-xl text-white/70 mb-8">Find answers to your questions and get the help you need</p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search for help topics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
                        />
                    </div>
                </motion.div>

                {/* Contact Options */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Need Immediate Help?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {contactOptions.map((option, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.1 }}
                            >
                                <GlassCard className="text-center hover:bg-white/10 transition-all group cursor-pointer">
                                    <option.icon className={`w-12 h-12 mx-auto mb-4 ${option.color} group-hover:scale-110 transition-transform`} />
                                    <h3 className="text-lg font-semibold text-white mb-2">{option.title}</h3>
                                    <p className="text-white/60 text-sm mb-3">{option.description}</p>
                                    <p className={`font-semibold ${option.color}`}>{option.contact}</p>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Help Categories */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-2xl font-bold text-white mb-6">Browse Help Topics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCategories.map((category, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                            >
                                <GlassCard className="h-full no-glow bg-white/5 transition-all group">
                                    <div className="flex items-center gap-3 mb-4">
                                        <category.icon className={`w-8 h-8 ${category.color} group-hover:scale-110 transition-transform`} />
                                        <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {category.topics.map((topic, topicIndex) => (
                                            <li key={topicIndex}>
                                                <button className="text-left text-white/70 hover:text-orange-400 transition-colors text-sm w-full py-1 no-glow bg-transparent">
                                                    • {topic}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Emergency Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12"
                >
                    <GlassCard className="bg-red-500/10 border-red-500/30">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                                    <Phone className="w-6 h-6 text-red-400" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-red-400 mb-2">Emergency Assistance</h3>
                                <p className="text-white/70 mb-3">
                                    If you're facing a travel emergency or urgent safety concern, please contact our emergency helpline immediately.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-red-400" />
                                        <span className="text-red-400 font-semibold">Emergency: +91 1800-HELP-NOW</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-red-400" />
                                        <span className="text-white/70">Available 24/7</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Feedback Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <GlassCard>
                        <h3 className="text-xl font-semibold text-white mb-4">Didn't find what you were looking for?</h3>
                        <p className="text-white/70 mb-6">
                            Help us improve our support by suggesting new topics or providing feedback on your experience.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
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