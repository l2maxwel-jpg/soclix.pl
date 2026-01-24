import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Clock, Monitor, BarChart3, Facebook, Instagram, Youtube, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { features, steps } from '../data/mockData';

const TikTokIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const iconComponents = {
  Zap: Zap,
  Clock: Clock,
  Monitor: Monitor,
  BarChart3: BarChart3,
};

const HomePage = () => {
  const [streamUrl, setStreamUrl] = useState('');

  const handleFind = () => {
    if (streamUrl) {
      // Navigate to streams page or process URL
      window.location.href = `/streams?url=${encodeURIComponent(streamUrl)}`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/20 dark:to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Turn Live Stream Comments
              <br />
              <span className="text-emerald-500">into Sales Instantly</span>
            </h1>
            
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              AI-powered platform for live stream sellers. Import your live video URL, 
              let AI extract customer orders from comments, and manage everything in one place.
            </p>

            {/* URL Input */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1 w-full">
                <Input
                  type="url"
                  placeholder="https://www.facebook.com/1234567890/videos/1234567890"
                  value={streamUrl}
                  onChange={(e) => setStreamUrl(e.target.value)}
                  className="w-full h-14 pl-4 pr-4 text-base rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <Button
                onClick={handleFind}
                className="h-14 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-105"
              >
                Find
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-500 dark:text-gray-400">
              <span className="text-sm">Save hours of manual work every single day</span>
              <div className="flex items-center gap-3">
                <Facebook className="w-5 h-5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />
                <Instagram className="w-5 h-5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />
                <TikTokIcon className="w-5 h-5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />
                <Youtube className="w-5 h-5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Why Choose Soclix?
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Everything you need to manage live stream sales efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const IconComponent = iconComponents[feature.icon];
              return (
                <div
                  key={feature.id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800"
                >
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                    <IconComponent className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Three simple steps to automate your live stream sales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={step.id} className="relative text-center">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-emerald-200 to-emerald-100 dark:from-emerald-800 dark:to-emerald-900" />
                )}
                
                <div className="text-7xl font-bold text-emerald-100 dark:text-emerald-900/50 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 to-teal-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to streamline your sales?
          </h2>
          <p className="text-emerald-100 mb-8 text-lg">
            Join thousands of live stream sellers who save hours every day
          </p>
          <Link to="/streams">
            <Button
              size="lg"
              className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
