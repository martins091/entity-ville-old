'use client';

import { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      const res = await fetch('https://formspree.io/f/xeevoook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccessMessage('✅ Thank you! Your message has been sent successfully.');

        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: '',
        });
      } else {
        setSuccessMessage('❌ Failed to send message. Please try again.');
      }
    } catch (error) {
      setSuccessMessage('❌ Something went wrong. Please try again later.');
    }

    setIsSubmitting(false);
  };

  return (
    <main className="bg-white text-foreground">
      <Header />

      {/* Hero Section - Reduced height */}
      <section className="relative py-16 bg-gradient-to-br from-primary via-blue-600 to-blue-700 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/20 rounded-full -ml-40 -mb-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Get in Touch</h1>
            <p className="text-xl text-white/90 mb-6 max-w-3xl mx-auto">
              Let's discuss your electrical component needs
            </p>
            <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10 mb-16">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="p-6 bg-white border-2 border-primary/10 rounded-2xl hover:border-accent hover:shadow-xl transition">
                <div className="inline-flex p-3 bg-primary/10 rounded-xl mb-4">
                  <Phone size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-2">Phone</h3>
                <a href="tel:+2348082538803" className="text-primary font-bold text-base hover:text-accent transition">
                  +234 808 253 8803
                </a>
              </div>

              <div className="p-6 bg-white border-2 border-primary/10 rounded-2xl hover:border-accent hover:shadow-xl transition">
                <div className="inline-flex p-3 bg-accent/10 rounded-xl mb-4">
                  <Mail size={24} className="text-accent" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-2">Email</h3>
                <a href="mailto:sales@entityville.com" className="text-accent font-bold text-base hover:text-primary transition break-all">
                  sales@entityville.com
                </a>
              </div>

              <div className="p-6 bg-white border-2 border-primary/10 rounded-2xl hover:border-accent hover:shadow-xl transition">
                <div className="inline-flex p-3 bg-primary/10 rounded-xl mb-4">
                  <MapPin size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-2">Office</h3>
                <p className="text-sm text-muted-foreground font-semibold leading-relaxed">
                  37, Adeniran Ogunsanya Mall, <br />
                  Surulere, Lagos State, Nigeria
                </p>
              </div>

              <div className="p-6 bg-white border-2 border-primary/10 rounded-2xl hover:border-accent hover:shadow-xl transition">
                <div className="inline-flex p-3 bg-accent/10 rounded-xl mb-4">
                  <Clock size={24} className="text-accent" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-2">Hours</h3>
                <p className="font-semibold">Mon - Fri: 8:00 AM - 6:00 PM</p>
                <p className="font-semibold">Sat - Sun: Closed</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-2 border-primary/20 shadow-xl">
                <h3 className="text-2xl font-black text-foreground mb-6">Send us a Message</h3>

                <div className="grid md:grid-cols-2 gap-5 mb-5">
                  <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name *" required className="w-full px-4 py-2.5 border-2 border-primary/20 rounded-lg" />
                  <input name="email" value={formData.email} onChange={handleChange} placeholder="Email *" required className="w-full px-4 py-2.5 border-2 border-primary/20 rounded-lg" />
                  <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full px-4 py-2.5 border-2 border-primary/20 rounded-lg" />
                  <input name="company" value={formData.company} onChange={handleChange} placeholder="Company" className="w-full px-4 py-2.5 border-2 border-primary/20 rounded-lg" />
                </div>

                <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject *" required className="w-full px-4 py-2.5 border-2 border-primary/20 rounded-lg mb-5" />

                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message *" required rows={5} className="w-full px-4 py-2.5 border-2 border-primary/20 rounded-lg mb-6" />

                <button type="submit" disabled={isSubmitting} className="w-full px-8 py-3 bg-accent text-white rounded-lg font-bold">
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                {successMessage && (
                  <p className="text-center text-sm mt-4 font-semibold">
                    {successMessage}
                  </p>
                )}
              </form>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-primary/20 text-center">
            <p className="font-semibold mb-2">Looking for specific products?</p>
            <Link href="/" className="inline-block px-5 py-2 bg-primary text-white rounded-lg font-bold text-sm">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}