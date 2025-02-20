"use client"
import React, { useEffect, useState } from 'react';
import {  
  Target, 
  ArrowRight, 
  Award,
  Users,
  Zap,
  Star,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function App() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setIsVisible(scrolled > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Hero Section */}
      <header className="min-h-screen relative overflow-hidden flex items-center">
        <div className="absolute inset-0 hero-gradient opacity-10 animate-gradientFlow"></div>
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fadeIn">
              <div className="inline-block mb-4 px-6 py-2 bg-blue-50 rounded-full">
                <span className="text-blue-600 font-semibold">AI-Powered Resume Builder</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                Create Your <span className="text-gradient">Perfect Resume</span> in Minutes
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Our AI-powered platform creates ATS-optimized resumes that match job descriptions with 93% success rate. Stand out and get hired faster.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <Link href={"/dashboard"} className="group bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center">
                  Start Building Now
                  <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
               
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-fadeIn">
              <TrustIndicator icon={<Users className="w-6 h-6" />} number="2M+" text="Users" />
              <TrustIndicator icon={<Star className="w-6 h-6" />} number="4.9/5" text="Rating" />
              <TrustIndicator icon={<TrendingUp className="w-6 h-6" />} number="93%" text="Success Rate" />
              <TrustIndicator icon={<Shield className="w-6 h-6" />} number="100%" text="ATS Friendly" />
            </div>

            {/* Preview Image */}
            <div className="mt-24 relative animate-scaleIn">
              <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl hover-3d card-shadow">
                <Image 
                  src="https://images.unsplash.com/photo-1554774853-719586f82d77?auto=format&fit=crop&q=80&w=2000"
                  alt="Resume Builder Interface"
                  className="w-full object-cover"
                  width={2000}
                  height={800}
                  

                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              
              {/* Floating Cards */}
              <FloatingCard 
                className="absolute -left-8 top-1/4 animate-float"
                icon={<Target className="w-6 h-6 text-blue-600" />}
                text="100% ATS Optimized"
              />
              <FloatingCard 
                className="absolute -right-8 top-1/3 animate-float"
                icon={<Clock className="w-6 h-6 text-purple-600" />}
                text="5 Minute Setup"
                style={{ animationDelay: '1s' }}
              />
              <FloatingCard 
                className="absolute left-1/4 -bottom-8 animate-float"
                icon={<Award className="w-6 h-6 text-green-600" />}
                text="Professional Templates"
                style={{ animationDelay: '2s' }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Professionals Choose <span className="text-gradient">ResumeAI</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with proven resume writing principles.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard 
              icon={<Target className="w-8 h-8 text-blue-600" />}
              title="Smart ATS Optimization"
              description="Our AI ensures your resume passes through any ATS with flying colors"
              image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
              delay={0}
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-purple-600" />}
              title="Instant Job Matching"
              description="Real-time optimization against job descriptions for perfect matching"
              image="https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&q=80&w=800"
              delay={200}
            />
            <FeatureCard 
              icon={<Award className="w-8 h-8 text-green-600" />}
              title="Premium Templates"
              description="Professionally designed templates that stand out while remaining ATS-friendly"
              image="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800"
              
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-purple-50/50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Three Steps to Your <span className="text-gradient">Perfect Resume</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process takes you from blank page to perfect resume in minutes.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              <ProcessStep 
                number="01"
                title="Import & Fill"
                description="Import your existing resume or start fresh. Our AI helps you fill in the details."
                delay={0}
              />
              <ProcessStep 
                number="02"
                title="Optimize"
                description="Match your resume to job descriptions with our AI-powered optimization."
                delay={200}
              />
              <ProcessStep 
                number="03"
                title="Download"
                description="Get your perfectly formatted, ATS-friendly resume in any format you need."
                delay={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted by <span className="text-gradient">Professionals</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {"Join thousands of professionals who've landed their dream jobs using ResumeAI."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <TestimonialCard 
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
              name="Sarah Chen"
              role="Senior Product Manager at Google"
              text="ResumeAI helped me land interviews at FAANG companies. The AI optimization is incredible!"
              delay={0}
            />
            <TestimonialCard 
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
              name="David Kumar"
              role="Software Engineer at Microsoft"
              text="The ATS optimization feature is a game-changer. I got calls from every company I applied to!"
              delay={200}
            />
            <TestimonialCard 
              image="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400"
              name="Emma Thompson"
              role="Marketing Director at Netflix"
              text="From application to offer in 2 weeks. ResumeAI made my resume stand out in a crowded field."
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden ">
        <div className="absolute inset-0 hero-gradient opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-shadow text-gray-700">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl mb-12 text-black/90">
              {"Join over 2 million professionals who've trusted ResumeAI to advance their careers."}
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <Link href={"/dashboard"} className="group bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center">
                Start Building Now
                <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
             
            </div>
          </div>
        </div>
      </section>

      

      {/* Scroll to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <ArrowRight className="w-6 h-6 transform rotate-[-90deg]" />
      </button>
    </div>
  );
}

function TrustIndicator({ icon, number, text }: { icon: React.ReactNode, number: string, text: string }) {
  return (
    <div className="p-4">
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{number}</div>
      <div className="text-gray-600">{text}</div>
    </div>
  );
}

function FloatingCard({ icon, text, className, style }: { icon: React.ReactNode, text: string, className?: string, style?: React.CSSProperties }) {
  return (
    <div className={`glass-effect px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 ${className}`} style={style}>
      {icon}
      <span className="text-sm font-medium text-gray-800">{text}</span>
    </div>
  );
}

function FeatureCard({ icon, title, description, image, delay }: { icon: React.ReactNode, title: string, description: string, image: string, delay: number }) {
  return (
    <div className="group rounded-xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2" style={{ animationDelay: `${delay}ms` }}>
      <div className="h-48 overflow-hidden">
        <Image width={800} height={400} src={image} alt={title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
      </div>
      <div className="p-8">
        <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function ProcessStep({ number, title, description, delay }: { number: string, title: string, description: string, delay: number }) {
  return (
    <div className="text-center transform hover:scale-105 transition-all duration-300" style={{ animationDelay: `${delay}ms` }}>
      <div className="relative mb-6">
        <div className="text-6xl font-bold text-blue-100">{number}</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl animate-pulse">
            {parseInt(number)}
          </div>
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function TestimonialCard({ image, name, role, text, delay }: { image: string, name: string, role: string, text: string, delay: number }) {
  return (
    <div 
      className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2" 
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center mb-6">
        <Image width={16} height={16} src={image} alt={name} className="w-16 h-16 rounded-full object-cover mr-4 ring-4 ring-blue-50" />
        <div>
          <h4 className="font-bold text-lg">{name}</h4>
          <p className="text-blue-600">{role}</p>
        </div>
      </div>
      <p className="text-gray-600 italic leading-relaxed">{text}</p>
      <div className="mt-6 flex">
        <Star className="w-5 h-5 text-yellow-400 fill-current" />
        <Star className="w-5 h-5 text-yellow-400 fill-current" />
        <Star className="w-5 h-5 text-yellow-400 fill-current" />
        <Star className="w-5 h-5 text-yellow-400 fill-current" />
        <Star className="w-5 h-5 text-yellow-400 fill-current" />
      </div>
    </div>
  );
}

export default App;