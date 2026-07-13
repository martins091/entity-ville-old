"use client";

import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, Send, Shield, Truck, Clock, Award } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const colors = {
  primary: "#C10008",
  secondary: "#027FFF",
  gradient: "linear-gradient(135deg, #C10008 0%, #027FFF 100%)",
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Premium Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: colors.gradient }} />
      
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-red-600 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} 
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1 - Company Info */}
          <div className="space-y-5">
            <Link href="/" className="block">
              <Image 
                src="/images/footerlogo.png" 
                alt="Entity Ville" 
                width={200} 
                height={60} 
                // className="h-12 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm">
              Premium supplier of electrical infrastructure components including cable trays, circuit breakers, earthing systems, busbars, and wiring devices across Africa.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a href="#" className="group w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-all duration-300 hover:scale-110">
                <Facebook size={16} className="text-gray-400 group-hover:text-white transition" />
              </a>
              <a href="#" className="group w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-all duration-300 hover:scale-110">
                <Twitter size={16} className="text-gray-400 group-hover:text-white transition" />
              </a>
              <a href="#" className="group w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-all duration-300 hover:scale-110">
                <Linkedin size={16} className="text-gray-400 group-hover:text-white transition" />
              </a>
              <a href="#" className="group w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-all duration-300 hover:scale-110">
                <Instagram size={16} className="text-gray-400 group-hover:text-white transition" />
              </a>
              <a href="#" className="group w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-all duration-300 hover:scale-110">
                <Youtube size={16} className="text-gray-400 group-hover:text-white transition" />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-5 relative inline-block">
              Company
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 rounded-full" style={{ background: colors.gradient }} />
            </h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition text-sm flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition" />About Us</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-white transition text-sm flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition" />Products</Link></li>
              <li><Link href="/industries" className="text-gray-400 hover:text-white transition text-sm flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition" />Industries</Link></li>
              <li><Link href="/case-studies" className="text-gray-400 hover:text-white transition text-sm flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition" />Case Studies</Link></li>
              <li><Link href="/news" className="text-gray-400 hover:text-white transition text-sm flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition" />News & Insights</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white transition text-sm flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition" />Careers</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition text-sm flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition" />Contact</Link></li>
            </ul>
          </div>

          {/* Column 3 - Products */}
          <div>
            <h3 className="text-lg font-bold mb-5 relative inline-block">
              Products
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 rounded-full" style={{ background: colors.gradient }} />
            </h3>
            <ul className="space-y-3">
              <li><Link href="/products/category/earthing-conductors" className="text-gray-400 hover:text-white transition text-sm block hover:translate-x-1 transition-transform duration-300">Earthing Conductors</Link></li>
              <li><Link href="/products/category/ese-active-lightning-rods" className="text-gray-400 hover:text-white transition text-sm block hover:translate-x-1 transition-transform duration-300">ESE Lightning Rods</Link></li>
              <li><Link href="/products/category/lightning-strike-counters" className="text-gray-400 hover:text-white transition text-sm block hover:translate-x-1 transition-transform duration-300">Lightning Counters</Link></li>
              <li><Link href="/products/category/galvanized-steel-poles" className="text-gray-400 hover:text-white transition text-sm block hover:translate-x-1 transition-transform duration-300">Steel Poles</Link></li>
              <li><Link href="/products/category/air-terminals" className="text-gray-400 hover:text-white transition text-sm block hover:translate-x-1 transition-transform duration-300">Air Terminals</Link></li>
              <li><Link href="/products/category/fixing-clamps" className="text-gray-400 hover:text-white transition text-sm block hover:translate-x-1 transition-transform duration-300">Fixing Clamps</Link></li>
              <li><Link href="/products/category/aircraft-warning-systems" className="text-gray-400 hover:text-white transition text-sm block hover:translate-x-1 transition-transform duration-300">Aircraft Warning</Link></li>
              <li><Link href="/products" className="text-red-400 hover:text-red-300 transition text-sm font-semibold block mt-2">View All Products →</Link></li>
            </ul>
          </div>

          {/* Column 4 - Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-5 relative inline-block">
              Get in Touch
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 rounded-full" style={{ background: colors.gradient }} />
            </h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                  <Phone size={14} className="text-red-400 group-hover:text-white" />
                </div>
                <a href="tel:+2348082538803" className="text-gray-400 hover:text-white transition text-sm">
                  +234 808 253 8803
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                  <Mail size={14} className="text-red-400 group-hover:text-white" />
                </div>
                <a href="mailto:sales@entityville.com" className="text-gray-400 hover:text-white transition text-sm break-all">
                  sales@entityville.com
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                  <MapPin size={14} className="text-red-400 group-hover:text-white" />
                </div>
                <span className="text-gray-400 text-sm leading-relaxed">
                  37, Adeniran Ogunsanya Mall, Surulere, Lagos State, Nigeria
                </span>
              </li>
            </ul>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 text-white">Subscribe to Newsletter</h4>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-red-500 transition"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-105"
                >
                  <Send size={16} className="text-white" />
                </button>
              </form>
              {subscribed && (
                <p className="text-green-400 text-xs mt-2 animate-pulse">Thanks for subscribing!</p>
              )}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-red-600 transition-all duration-300">
              <Shield size={18} className="text-red-400 group-hover:text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">IEC Certified</p>
              <p className="text-xs text-gray-500">EN 62305 & 62561</p>
            </div>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-red-600 transition-all duration-300">
              <Truck size={18} className="text-red-400 group-hover:text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">Fast Delivery</p>
              <p className="text-xs text-gray-500">Across Africa</p>
            </div>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-red-600 transition-all duration-300">
              <Award size={18} className="text-red-400 group-hover:text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">2 Year Warranty</p>
              <p className="text-xs text-gray-500">On all products</p>
            </div>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-red-600 transition-all duration-300">
              <Clock size={18} className="text-red-400 group-hover:text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">24/7 Support</p>
              <p className="text-xs text-gray-500">Technical assistance</p>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} Entity Ville Ltd. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-500 hover:text-white transition text-xs">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-500 hover:text-white transition text-xs">Terms of Service</Link>
              <Link href="/cookies" className="text-gray-500 hover:text-white transition text-xs">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}