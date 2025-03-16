"use client"
import type React from "react"
import { useEffect, useState, useRef } from "react"
import {
  Target,
  ArrowRight,
  Award,
  Users,
  Zap,
  Star,
  TrendingUp,
  Shield,
  Clock,
  FileText,
  FileSignature,
  Sparkles,
  ChevronDown,
  CheckCircle,
  Rocket,
  Briefcase,
  MousePointer,
  Cpu,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      setIsVisible(scrolled > 100)
    }


    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white dark">
      {/* Hero Section */}
      <header ref={heroRef} className="min-h-screen relative overflow-hidden flex items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-purple-900/20 to-black"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        {/* Animated Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-float"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/20 rounded-full blur-[100px] animate-float"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <motion.div style={{ opacity, scale, y }} className="p-20 rounded-lg mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-full border border-blue-500/20"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold">
                  AI-Powered Document Generation
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
              >
                Create Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  Perfect Documents
                </span>{" "}
                in Minutes
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                Our AI-powered platform creates ATS-optimized resumes and compelling cover letters that match job
                descriptions with 93% success rate.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col md:flex-row gap-4 justify-center items-center"
              >
                <Link
                  href="/dashboard"
                  className="btn btn-next group relative overflow-hidden px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                >
                  <span className="relative z-10">Start Building Now</span>
                  <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform relative z-10" />
                </Link>

                <Link
                  href="#features"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="group bg-transparent border border-gray-500 hover:border-white text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center"
                >
                  Learn More
                  <ChevronDown className="ml-2 w-5 h-5 transform group-hover:translate-y-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            >
              <TrustIndicator icon={<Users className="w-6 h-6 text-blue-400" />} number="10K+" text="Users" />
              <TrustIndicator icon={<Star className="w-6 h-6 text-purple-400" />} number="4.9/5" text="Rating" />
              <TrustIndicator
                icon={<TrendingUp className="w-6 h-6 text-pink-400" />}
                number="93%"
                text="Success Rate"
              />
              <TrustIndicator icon={<Shield className="w-6 h-6 text-indigo-400" />} number="100%" text="ATS Friendly" />
            </motion.div>

            {/* Document Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-24 relative"
            >
              <div className="relative z-10 grid md:grid-cols-2 gap-6">
                {/* Resume Card */}
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="group relative overflow-hidden rounded-2xl shadow-2xl"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="relative h-full bg-black/60 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 z-10">
                      <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-blue-500/30 flex items-center">
                        <FileText className="w-4 h-4 text-blue-400 mr-2" />
                        <span className="text-xs font-medium text-blue-300">Resume</span>
                      </div>
                    </div>
                    <Image
                      src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=1200"
                      alt="Resume Builder"
                      className="w-full h-48 object-cover"
                      width={1200}
                      height={400}
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-300 transition-colors">
                        AI-Powered Resumes
                      </h3>
                      <p className="text-gray-300 text-sm">Stand out with perfectly tailored, ATS-optimized resumes</p>
                    </div>
                  </div>
                </motion.div>

                {/* Cover Letter Card */}
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="group relative overflow-hidden rounded-2xl shadow-2xl"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="relative h-full bg-black/60 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 z-10">
                      <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-500/30 flex items-center">
                        <FileSignature className="w-4 h-4 text-purple-400 mr-2" />
                        <span className="text-xs font-medium text-purple-300">Cover Letter</span>
                      </div>
                    </div>
                    <Image
                      src="https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?auto=format&fit=crop&q=80&w=1200"
                      alt="Cover Letter Generator"
                      className="w-full h-48 object-cover"
                      width={1200}
                      height={400}
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-300 transition-colors">
                        Compelling Cover Letters
                      </h3>
                      <p className="text-gray-300 text-sm">
                        Make a powerful first impression with personalized cover letters
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Stats Badges */}
              <div className="flex flex-wrap justify-center gap-4 mt-10">
                <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-500/20 flex items-center">
                  <Target className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="text-sm font-medium text-gray-200">100% ATS Optimized</span>
                </div>
                <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-500/20 flex items-center">
                  <Clock className="w-5 h-5 text-purple-400 mr-2" />
                  <span className="text-sm font-medium text-gray-200">5 Minute Setup</span>
                </div>
                <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-pink-500/20 flex items-center">
                  <Award className="w-5 h-5 text-pink-400 mr-2" />
                  <span className="text-sm font-medium text-gray-200">Professional Templates</span>
                </div>
                <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-500/20 flex items-center">
                  <Sparkles className="w-5 h-5 text-indigo-400 mr-2" />
                  <span className="text-sm font-medium text-gray-200">AI-Powered Content</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-purple-900/10 to-transparent"></div>
        <div className="p-20 rounded-lg mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-full border border-blue-500/20"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold">
                Advanced Features
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Why Professionals Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Our Platform
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Our AI-powered platform combines cutting-edge technology with proven document writing principles.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Target className="w-8 h-8 text-blue-400" />}
              title="Smart ATS Optimization"
              description="Our AI ensures your documents pass through any ATS with flying colors"
              delay={0}
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-purple-400" />}
              title="Instant Job Matching"
              description="Real-time optimization against job descriptions for perfect matching"
              delay={200}
            />
            <FeatureCard
              icon={<FileText className="w-8 h-8 text-pink-400" />}
              title="Perfect Resumes"
              description="Professionally designed resume templates that stand out while remaining ATS-friendly"
              delay={400}
            />
            <FeatureCard
              icon={<FileSignature className="w-8 h-8 text-indigo-400" />}
              title="Compelling Cover Letters"
              description="Generate personalized cover letters that showcase your unique value proposition"
              delay={600}
            />
          </div>
        </div>
      </section>

      {/* AI Technology Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900/20 via-purple-900/10 to-transparent"></div>

        <div className="p-20 rounded-lg mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30 animate-pulse"></div>
              <div className="relative bg-black/60 backdrop-blur-sm p-8 rounded-2xl border border-gray-800">
                <Cpu className="w-12 h-12 text-blue-400 mb-6" />
                <h2 className="text-3xl font-bold mb-6">Powered by Advanced AI Technology</h2>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Our platform leverages state-of-the-art natural language processing to analyze job descriptions and
                  create perfectly tailored documents that highlight your most relevant skills and experiences.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">Semantic analysis of job requirements</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">Keyword optimization for ATS systems</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">Natural language generation for compelling content</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">Continuous learning from successful applications</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20"></div>
                <div className="relative overflow-hidden rounded-2xl border border-gray-800">
                  <Image
                    src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800"
                    alt="AI Technology Visualization"
                    width={800}
                    height={600}
                    className="w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8">
                    <h3 className="text-2xl font-bold mb-2">Next-Gen Document Generation</h3>
                    <p className="text-gray-300">
                      Our AI analyzes thousands of successful resumes and cover letters to create the perfect documents
                      for your job application.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-purple-900/10 to-transparent"></div>

        <div className="p-20 rounded-lg mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-full border border-blue-500/20"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold">
                Simple Process
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Three Steps to Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Perfect Documents
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Our streamlined process takes you from blank page to perfect documents in minutes.
            </motion.p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              <ProcessStep
                number="01"
                title="Import & Fill"
                description="Import your existing resume or start fresh. Our AI helps you fill in the details."
                icon={<MousePointer className="w-6 h-6 text-blue-400" />}
                delay={0}
              />
              <ProcessStep
                number="02"
                title="Select Document"
                description="Choose to generate a resume, cover letter, or both tailored to your target job."
                icon={<FileText className="w-6 h-6 text-purple-400" />}
                delay={200}
              />
              <ProcessStep
                number="03"
                title="Download & Apply"
                description="Get your perfectly formatted, ATS-friendly documents in any format you need."
                icon={<Rocket className="w-6 h-6 text-pink-400" />}
                delay={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-purple-900/10 to-transparent"></div>

        <div className="p-20 rounded-lg mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-full border border-blue-500/20"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold">
                Success Stories
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Trusted by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Professionals
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              {"Join thousands of professionals who've landed their dream jobs using our platform."}
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <TestimonialCard
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
              name="Sarah Chen"
              role="Senior Product Manager at Google"
              text="The AI-powered platform helped me land interviews at FAANG companies. Both my resume and cover letter were perfectly tailored to each job!"
              delay={0}
            />
            <TestimonialCard
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
              name="David Kumar"
              role="Software Engineer at Microsoft"
              text="The ATS optimization feature is a game-changer. I got calls from every company I applied to with my new resume and cover letter!"
              delay={200}
            />
            <TestimonialCard
              image="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400"
              name="Emma Thompson"
              role="Marketing Director at Netflix"
              text="From application to offer in 2 weeks. The cover letter generator created the most compelling letter I've ever sent. It truly made me stand out."
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-purple-900/20 to-transparent"></div>

        <div className="p-20 rounded-lg mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30"></div>
              <div className="relative bg-black/60 backdrop-blur-sm p-12 rounded-2xl border border-gray-800 text-center">
                <Briefcase className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Career?</h2>
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                  {
                    "Join over 10 thousand professionals who've trusted our platform to advance their careers with standout resumes and cover letters."
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link
                    href="/dashboard"
                    className="btn btn-next group relative overflow-hidden px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <span className="relative z-10">Start Building Now</span>
                    <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform relative z-10" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 btn btn-next p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <ArrowRight className="w-6 h-6 transform rotate-[-90deg]" />
      </button>
    </div>
  )
}

function TrustIndicator({ icon, number, text }: { icon: React.ReactNode; number: string; text: string }) {
  return (
    <div className="p-4">
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-2xl font-bold mb-1">{number}</div>
      <div className="text-gray-400">{text}</div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: { icon: React.ReactNode; title: string; description: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      viewport={{ once: true }}
      className="relative bg-black/60 backdrop-blur-sm p-6 rounded-lg border border-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  )
}

function ProcessStep({
  number,
  title,
  description,
  icon,
  delay,
}: { number: string; title: string; description: string; icon: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      viewport={{ once: true }}
      className="text-center transform hover:scale-105 transition-all duration-300"
    >
      <div className="relative mb-6">
        <div className="text-6xl font-bold text-gray-800/20">{number}</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            {icon}
          </div>
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  )
}

function TestimonialCard({
  image,
  name,
  role,
  text,
  delay,
}: { image: string; name: string; role: string; text: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      viewport={{ once: true }}
      className="relative group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
      <div className="relative bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-gray-800 transition-all duration-300 group-hover:border-gray-700">
        <div className="flex items-center mb-6">
          <Image
            width={16}
            height={16}
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-16 h-16 rounded-full object-cover mr-4 ring-2 ring-blue-500/30"
          />
          <div>
            <h4 className="font-bold text-lg">{name}</h4>
            <p className="text-blue-400">{role}</p>
          </div>
        </div>
        <p className="text-gray-300 italic leading-relaxed">{text}</p>
        <div className="mt-6 flex">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
        </div>
      </div>
    </motion.div>
  )
}

