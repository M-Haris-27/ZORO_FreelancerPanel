import React, { useState } from 'react';
import { Briefcase, Users, CheckCircle, DollarSign, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LearnMorePopup = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-slide-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition"
                >
                    <X className="w-8 h-8" />
                </button>

                <div className="p-8">
                    <h2 className="text-3xl font-bold text-[#0B1724] mb-6 text-center">
                        Discover Zoro: Your Complete Project Management Solution
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <Briefcase className="w-12 h-12 text-blue-500 mb-4" />
                            <h3 className="font-bold text-xl mb-2">For Clients</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Find and hire top freelance talent</li>
                                <li>• Track project progress in real-time</li>
                                <li>• Secure payment management</li>
                                <li>• Detailed freelancer performance reports</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <Users className="w-12 h-12 text-green-500 mb-4" />
                            <h3 className="font-bold text-xl mb-2">For Freelancers</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Access to diverse job opportunities</li>
                                <li>• Simplified project and client management</li>
                                <li>• Transparent billing and invoicing</li>
                                <li>• Portfolio and skill showcase</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 bg-[#cae962] bg-opacity-10 p-6 rounded-lg">
                        <h3 className="text-2xl font-bold text-[#0B1724] mb-4">Key Platform Features</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <CheckCircle className="inline-block mr-2 text-purple-500" />
                                Project Tracking
                            </div>
                            <div>
                                <DollarSign className="inline-block mr-2 text-red-500" />
                                Financial Management
                            </div>
                            <div>
                                <Users className="inline-block mr-2 text-green-500" />
                                Client-Freelancer Communication
                            </div>
                            <div>
                                <Briefcase className="inline-block mr-2 text-blue-500" />
                                Job Marketplace
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HomePage = () => {
    const [showLearnMore, setShowLearnMore] = useState(false);
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/dashboard');
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex items-center justify-center mb-12">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <img
                                src="/zoro.png"
                                alt="Zoro Logo"
                                className="w-36 h-36 rounded-full shadow-lg border-4 border-[#cae962]"
                            />
                        </div>
                        <h1 className="text-5xl font-bold text-[#0B1724] mb-2">Zoro</h1>
                        <h2 className="text-2xl text-gray-600">Project Management for Clients and Freelancers</h2>
                    </div>
                </div>
                <br /><br />

                {/* Quick Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition-all duration-300">
                        <Briefcase className="mx-auto mb-4 text-blue-500 w-12 h-12" />
                        <h3 className="font-bold text-xl mb-2 text-[#0B1724]">Job Marketplace</h3>
                        <p className="text-gray-600">Connect clients with top freelance talent seamlessly</p>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition-all duration-300">
                        <Users className="mx-auto mb-4 text-green-500 w-12 h-12" />
                        <h3 className="font-bold text-xl mb-2 text-[#0B1724]">Client & Freelancer Management</h3>
                        <p className="text-gray-600">Comprehensive profiles and interaction tracking</p>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition-all duration-300">
                        <CheckCircle className="mx-auto mb-4 text-purple-500 w-12 h-12" />
                        <h3 className="font-bold text-xl mb-2 text-[#0B1724]">Project Tracking</h3>
                        <p className="text-gray-600">Real-time progress monitoring for all stakeholders</p>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition-all duration-300">
                        <DollarSign className="mx-auto mb-4 text-red-500 w-12 h-12" />
                        <h3 className="font-bold text-xl mb-2 text-[#0B1724]">Financial Management</h3>
                        <p className="text-gray-600">Transparent billing and payment solutions</p>
                    </div>
                </div>
                <br />

                {/* Call to Action Section */}
                <div className="bg-white shadow-md rounded-lg p-8 text-center">
                    <h2 className="text-3xl font-bold text-[#0B1724] mb-4">Empowering Clients and Freelancers Together</h2>
                    <p className="text-gray-600 mb-6">
                        Zoro is the all-in-one platform that simplifies project management, collaboration, and financial tracking for businesses, clients, and freelancers.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={handleGetStarted}
                            className="px-6 py-3 bg-[#cae962] text-[#0B1724] font-bold rounded-lg hover:bg-[#abc653] transition"
                        >
                            Get Started
                        </button>
                        <button
                            onClick={() => setShowLearnMore(true)}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        >
                            Learn More
                        </button>
                    </div>
                </div>

                {/* Learn More Popup */}
                {showLearnMore && <LearnMorePopup onClose={() => setShowLearnMore(false)} />}
            </div>
        </div>
    );
};

export default HomePage;