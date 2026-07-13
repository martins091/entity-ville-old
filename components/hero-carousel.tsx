'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Shield, Zap, Clock, Package } from 'lucide-react';

const colors = {
  primary: "#C10008",
  secondary: "#027FFF",
  gradient: "linear-gradient(135deg, #C10008 0%, #027FFF 100%)",
};

const slides = [
  {
    id: 1,
    title: 'Complete Electrical',
    highlight: 'Infrastructure',
    subtitle: 'Premium Components for Every Installation',
    description: 'Cable trays, lugs, conduits, circuit breakers, earthing systems, busbars, lightning arrestors, wiring devices, and inspection chambers',
    image: '/images/enti.png',
    cta: 'View Protection Gear',
    href: '/products/category/earthing-conductors',
  },
  {
    id: 2,
    title: 'Cable Management',
    highlight: 'Excellence',
    subtitle: 'Complete Cable Tray, Ladder & Conduit Systems',
    description: 'Pre-galvanized and HDG cable trays, ladders, rigid and flexible conduits for organized cable routing and protection',
    image: '/images/enti.png',
    cta: 'View Cable Solutions',
    href: '/products/category/earthing-conductors',
  },
  {
    id: 3,
    title: 'Lightning',
    highlight: 'Protection',
    subtitle: 'ESE Active Lightning Rods & Counters',
    description: 'Early Streamer Emission lightning rods, strike counters, and complete lightning protection systems for buildings and structures.',
    image: '/images/enti.png',
    cta: 'Explore Protection',
    href: '/products/category/ese-active-lightning-rods',
  },
  {
    id: 4,
    title: 'Exothermic',
    highlight: 'Welding',
    subtitle: 'Professional Welding Moulds & Powders',
    description: 'Complete exothermic welding solutions for perfect conductor connections. Moulds, powders, and accessories for reliable earthing joints.',
    image: '/images/enti.png',
    cta: 'View Welding Kits',
    href: '/products/category/product-selection-charts',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay, slides.length]);

  const next = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  return (
    <div className="w-full h-[90vh] min-h-[600px] max-h-[800px] flex relative overflow-hidden">
      
      {/* Animated Background Gradient using brand colors */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 z-0" />
      
      {/* Decorative Pattern with brand colors */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* LEFT SIDE - TEXT AREA */}
      <div className="relative z-10 w-full lg:w-1/2 flex items-center">
        <div className="px-6 sm:px-10 lg:px-16 xl:px-20 max-w-xl">
          
          {/* Category Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
              Premium Quality
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight text-white">
            {slides[current].title}
            <br />
            <span className="relative inline-block mt-2">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {slides[current].highlight}
              </span>
              {/* Underline with brand gradient */}
              <svg className="absolute -bottom-2 left-0 w-full" height="3" viewBox="0 0 200 3" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="underlineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#C10008" />
                    <stop offset="100%" stopColor="#027FFF" />
                  </linearGradient>
                </defs>
                <path d="M0 1.5 L200 1.5" stroke="url(#underlineGrad)" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-white/80 mt-6 leading-relaxed">
            {slides[current].description}
          </p>

          {/* CTA Button with brand gradient */}
          <Link
            href={slides[current].href}
            className="group inline-flex items-center gap-2 mt-8 px-6 py-3 bg-white text-red-700 font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            {slides[current].cta}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
          </Link>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-4 mt-10 pt-6 border-t border-white/20">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-blue-400" />
              <span className="text-xs text-white/70">IEC Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-red-400" />
              <span className="text-xs text-white/70">12+ Years</span>
            </div>
            <div className="flex items-center gap-2">
              <Package size={14} className="text-white/70" />
              <span className="text-xs text-white/70">500+ Clients</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-white/70" />
              <span className="text-xs text-white/70">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - IMAGE AREA */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-l from-red-800/60 via-red-700/30 to-transparent z-10" />
        <Image
          src={slides[current].image}
          alt={slides[current].title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300"
      >
        <ChevronLeft size={20} className="text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300"
      >
        <ChevronRight size={20} className="text-white" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrent(index);
              setIsAutoPlay(false);
              setTimeout(() => setIsAutoPlay(true), 10000);
            }}
            className={`transition-all duration-300 rounded-full ${
              index === current
                ? 'w-8 h-2 bg-white'
                : 'w-2 h-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}