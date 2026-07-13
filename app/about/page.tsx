'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Package, Shield, Truck, Users, Target, Zap, Building, Factory, Wifi, Home, Headphones, Sun, Cable, Clock } from 'lucide-react';

export default function About() {
  return (
    <main className="bg-white text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full h-80 bg-gradient-to-r from-primary via-blue-600 to-primary overflow-hidden flex items-center">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/villibg.png"
            alt="Warehouse"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">About Our Company</h1>
          <p className="text-lg text-white/90 font-semibold max-w-2xl">
            Your trusted partner for premium electrical infrastructure components across Africa.
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-4xl font-black text-foreground mb-6">
                Who We <span className="text-accent">Are</span>
              </h2>
              <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                We are a premier supplier of high-quality electrical infrastructure components, serving industrial, commercial, and residential clients across Africa. Our extensive product range includes cable management systems, circuit protection devices, earthing solutions, busbars, lightning arrestors, wiring devices, and inspection chambers.
              </p>
              <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                With over 15 years of experience, we have built strong relationships with leading global manufacturers including ABB, Schneider Electric, Siemens, Chint, and Indelec. This allows us to offer genuine, certified products at competitive prices with reliable delivery.
              </p>
              <Link href="/" className="inline-flex items-center text-primary font-bold text-base">
                Explore Our Products
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </div>
            <div className="relative h-80 rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/images/receptions.png"
                alt="Warehouse and inventory"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="bg-white border-2 border-primary/20 rounded-2xl p-8 hover:shadow-2xl transition">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 bg-primary/15 rounded-xl">
                  <Target className="text-primary" size={28} />
                </div>
                <h3 className="text-2xl font-black text-foreground">Our Vision</h3>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed">
                To become the most trusted and preferred supplier of electrical infrastructure components in Africa, known for quality products, reliable service, and technical expertise.
              </p>
              <div className="mt-5 h-1 w-16 bg-accent rounded-full"></div>
            </div>

            {/* Mission */}
            <div className="bg-white border-2 border-accent/20 rounded-2xl p-8 hover:shadow-2xl transition">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 bg-accent/15 rounded-xl">
                  <Zap className="text-accent" size={28} />
                </div>
                <h3 className="text-2xl font-black text-foreground">Our Mission</h3>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed">
                To provide premium electrical components backed by exceptional customer service, technical support, and timely delivery - empowering our clients to complete their projects efficiently and safely.
              </p>
              <div className="mt-5 h-1 w-16 bg-accent rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-foreground mb-4">Our Core <span className="text-accent">Values</span></h2>
            <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Quality Products', desc: 'Only genuine, certified components from trusted global manufacturers' },
              { icon: Truck, title: 'Reliable Delivery', desc: 'Consistent supply with on-time delivery and stock availability' },
              { icon: Users, title: 'Expert Support', desc: 'Technical guidance to help you select the right products' },
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="bg-gradient-to-br from-blue-50 to-white border-2 border-primary/20 rounded-xl p-6 hover:border-primary hover:shadow-xl transition">
                  <div className="p-3 bg-primary/20 rounded-lg w-fit mb-4">
                    <Icon className="text-primary" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products We Supply - Updated with all 9 products */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-foreground mb-4">Products We <span className="text-accent">Supply</span></h2>
            <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Cable Trays & Ladders', desc: 'Pre-galvanized and HDG finishes' },
              { name: 'Cable Lugs', desc: 'Copper and aluminum types' },
              { name: 'Circuit Breakers', desc: 'MCB, MCCB, ACB from ABB, Schneider, Siemens' },
              { name: 'Earthing Systems', desc: 'Copper bond rods, copper rods, earthing mats' },
              { name: 'Conduit Pipes & Fittings', desc: 'PVC, metal, and flexible options' },
              { name: 'Tinned Copper Busbars', desc: 'For efficient power distribution' },
              { name: 'Lightning Arrestors', desc: 'Indelec surge and lightning protection' },
              { name: 'Wiring Devices', desc: 'Switches, sockets, and LED lighting' },
              { name: 'Inspection Chambers', desc: 'Underground cable access points' },
            ].map((product, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-primary/20 hover:border-accent hover:shadow-md transition">
                <div className="p-2 bg-accent/20 rounded-lg flex-shrink-0">
                  <Package className="text-accent" size={18} />
                </div>
                <div>
                  <span className="font-bold text-foreground text-sm">{product.name}</span>
                  <p className="text-xs text-muted-foreground">{product.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-foreground mb-4">Industries We <span className="text-accent">Serve</span></h2>
            <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Building, name: 'Commercial Buildings', desc: 'Office complexes, shopping malls, hotels' },
              { icon: Factory, name: 'Industrial Facilities', desc: 'Manufacturing plants, warehouses' },
              { icon: Wifi, name: 'Telecommunications', desc: 'Cell towers, data centers' },
              { icon: Home, name: 'Residential', desc: 'Housing estates, apartment buildings' },
              { icon: Sun, name: 'Renewable Energy', desc: 'Solar farms, wind installations' },
              { icon: Zap, name: 'Power Distribution', desc: 'Substations, utility companies' },
            ].map((industry, idx) => {
              const Icon = industry.icon;
              return (
                <div key={idx} className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-primary/20 hover:border-accent hover:shadow-md transition">
                  <div className="p-2 bg-accent/20 rounded-lg flex-shrink-0">
                    <Icon className="text-accent" size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-foreground text-sm">{industry.name}</span>
                    <p className="text-xs text-muted-foreground">{industry.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-foreground mb-4">Why Choose <span className="text-accent">Us</span></h2>
            <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-4 gap-5">
            {[
              { icon: Truck, title: 'Fast Delivery', desc: 'Reliable shipping across Africa' },
              { icon: Shield, title: 'Genuine Products', desc: '100% certified components' },
              { icon: Target, title: 'Competitive Pricing', desc: 'Best value for your budget' },
              { icon: Headphones, title: 'Expert Support', desc: 'Technical assistance available' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="text-center p-5 bg-white rounded-xl border border-primary/20 hover:shadow-lg transition">
                  <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-3">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

   

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary via-blue-600 to-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/20 rounded-full -ml-40 -mb-40" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-3">Need Premium Electrical Components?</h2>
          <p className="text-base text-white/90 mb-5 font-semibold">
            Contact us for quotes and technical support on your next project.
          </p>
          <Link href="/contact" className="inline-block px-8 py-3 bg-accent text-white rounded-lg hover:bg-red-600 transition font-bold text-base shadow-lg hover:shadow-xl">
            Request a Quote
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}