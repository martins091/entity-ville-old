import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 mb-4">
              <Image src="/images/footerlogo.png" alt="Entity Ville" width={200} height={60} className="h-12 w-auto" />
            </Link>
            <p className="text-white/75 leading-relaxed text-sm">
              Premium supplier of electrical infrastructure components including cable trays, circuit breakers, earthing systems, busbars, and wiring devices across Africa.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#" className="w-8 h-8 bg-white/20 rounded-lg hover:bg-primary transition flex items-center justify-center text-white text-sm">
                f
              </a>
              <a href="#" className="w-8 h-8 bg-white/20 rounded-lg hover:bg-primary transition flex items-center justify-center text-white text-sm">
                in
              </a>
              <a href="#" className="w-8 h-8 bg-white/20 rounded-lg hover:bg-primary transition flex items-center justify-center text-white text-sm">
                𝕏
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black text-white mb-5 text-lg">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-white/70 hover:text-primary transition font-semibold text-sm">About Us</Link></li>
              <li><Link href="/products" className="text-white/70 hover:text-primary transition font-semibold text-sm">Products</Link></li>
              <li><Link href="/industries" className="text-white/70 hover:text-primary transition font-semibold text-sm">Industries</Link></li>
              <li><Link href="/case-studies" className="text-white/70 hover:text-primary transition font-semibold text-sm">Case Studies</Link></li>
              <li><Link href="/news" className="text-white/70 hover:text-primary transition font-semibold text-sm">News & Insights</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-primary transition font-semibold text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-black text-white mb-5 text-lg">Products</h4>
            <ul className="space-y-3">
              <li><Link href="/products/cable-trays" className="text-white/70 hover:text-primary transition font-semibold text-sm">Cable Trays & Ladders</Link></li>
              <li><Link href="/products/cable-lugs" className="text-white/70 hover:text-primary transition font-semibold text-sm">Cable Lugs</Link></li>
              <li><Link href="/products/circuit-breakers" className="text-white/70 hover:text-primary transition font-semibold text-sm">Circuit Breakers</Link></li>
              <li><Link href="/products/earth-rods" className="text-white/70 hover:text-primary transition font-semibold text-sm">Earthing Systems</Link></li>
              <li><Link href="/products/conduits" className="text-white/70 hover:text-primary transition font-semibold text-sm">Conduit Pipes & Fittings</Link></li>
              <li><Link href="/products/busbars" className="text-white/70 hover:text-primary transition font-semibold text-sm">Tinned Copper Busbars</Link></li>
              <li><Link href="/products/lightning-arrestors" className="text-white/70 hover:text-primary transition font-semibold text-sm">Lightning Arrestors</Link></li>
              <li><Link href="/products/wiring-devices" className="text-white/70 hover:text-primary transition font-semibold text-sm">Wiring Devices</Link></li>
              <li><Link href="/products/inspection-chambers" className="text-white/70 hover:text-primary transition font-semibold text-sm">Inspection Chambers</Link></li>
            </ul>
          </div>

          {/* Contact Info - Updated with real information */}
          <div>
            <h4 className="font-black text-white mb-5 text-lg">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-accent flex-shrink-0 mt-0.5" />
                <a href="tel:+2348082538803" className="text-white/70 hover:text-white transition font-semibold text-sm">
                  +234 808 253 8803
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-accent flex-shrink-0 mt-0.5" />
                <a href="mailto:sales@entityville.com" className="text-white/70 hover:text-white transition font-semibold text-sm break-all">
                  sales@entityville.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-accent flex-shrink-0 mt-0.5" />
                <span className="text-white/70 font-semibold text-sm leading-relaxed">
                  37, Adeniran Ogunsanya Mall, <br />
                  Surulere, Lagos State, Nigeria
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-white/20">
            <p className="text-white/60 text-xs font-semibold">
              &copy; 2026 Entity Ville Ltd. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-white/60 hover:text-primary transition font-semibold text-xs">Privacy Policy</a>
              <a href="#" className="text-white/60 hover:text-primary transition font-semibold text-xs">Terms of Service</a>
              <a href="#" className="text-white/60 hover:text-primary transition font-semibold text-xs">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}