'use client';

import { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Image from 'next/image';
import Link from 'next/link';

export default function CareersPage() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    experience: '',
    designation: '',
    portfolio: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      alert('Thank you for your application! We will review it and get back to you within 5-7 business days.');
      setFormData({
        name: '',
        age: '',
        email: '',
        phone: '',
        experience: '',
        designation: '',
        portfolio: '',
      });
      setIsSubmitting(false);
    }, 1000);
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
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Join Our Team</h1>
            <p className="text-xl text-white/90 mb-6 max-w-3xl mx-auto">
              Build Your Future with Africa's Leading Electrical Component Supplier
            </p>
            <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left - Text */}
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-6">
                We Welcome Passionate <span className="text-accent">Talent</span>
              </h2>
              
              <div className="space-y-5 text-base text-muted-foreground leading-relaxed">
                <p>
                  We welcome passionate people looking for challenging and fulfilling career opportunities in the electrical components supply industry.
                </p>
                
                <p>
                  At Entity Ville, we provide an environment filled with opportunities for you to express yourself through smart work, creativity, and innovation.
                </p>

                <p>
                  Explore and challenge yourself to achieve even higher competence and a personal sense of dignity and satisfaction from your achievements.
                </p>

                <p className="font-bold text-foreground text-lg">
                  Join our brilliant team and be part of Africa's electrical component supply revolution!
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Growth Opportunities</h4>
                    <p className="text-sm text-muted-foreground">Continuous learning and professional development</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">💡</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Innovation Culture</h4>
                    <p className="text-sm text-muted-foreground">Be part of innovative supply chain solutions</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🤝</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Diverse Team</h4>
                    <p className="text-sm text-muted-foreground">Work with talented professionals from across Africa</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Image */}
            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/mentoring.jpg"
                alt="Professional mentoring and development"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>
          </div>

          {/* Current Openings Section */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-black text-foreground mb-3">Current <span className="text-accent">Openings</span></h3>
              <div className="h-1 w-16 bg-accent mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: 'Sales Engineer', type: 'Full-time', location: 'Lagos, Nigeria' },
                { title: 'Technical Sales Representative', type: 'Full-time', location: 'Lagos, Nigeria' },
                { title: 'Warehouse & Logistics Coordinator', type: 'Full-time', location: 'Lagos, Nigeria' },
                { title: 'Customer Support Specialist', type: 'Full-time', location: 'Lagos, Nigeria' },
                { title: 'Procurement Officer', type: 'Full-time', location: 'Lagos, Nigeria' },
                { title: 'Marketing Associate', type: 'Full-time', location: 'Lagos, Nigeria' },
              ].map((job, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-primary/20 hover:border-primary hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-foreground text-lg">{job.title}</h4>
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">{job.type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">📍 {job.location}</p>
                  <button className="text-primary font-bold text-sm hover:text-accent transition">
                    Apply Now →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Section */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-black text-foreground mb-3">Apply for a Position</h3>
              <p className="text-base text-muted-foreground">
                Share your details and let's explore exciting opportunities together
              </p>
              <div className="h-1 w-16 bg-accent mx-auto mt-5 rounded-full"></div>
            </div>

            <form onSubmit={handleSubmit} className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-2 border-primary/20 shadow-xl">
              <div className="grid md:grid-cols-2 gap-5 mb-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border-2 border-primary/20 rounded-lg focus:border-primary focus:outline-none transition bg-white text-sm"
                    placeholder="Your full name"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Age *</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border-2 border-primary/20 rounded-lg focus:border-primary focus:outline-none transition bg-white text-sm"
                    placeholder="Your age"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border-2 border-primary/20 rounded-lg focus:border-primary focus:outline-none transition bg-white text-sm"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border-2 border-primary/20 rounded-lg focus:border-primary focus:outline-none transition bg-white text-sm"
                    placeholder="+234 808 253 8803"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Years of Experience *</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border-2 border-primary/20 rounded-lg focus:border-primary focus:outline-none transition bg-white text-sm"
                    placeholder="e.g., 3"
                  />
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Position Applying For *</label>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border-2 border-primary/20 rounded-lg focus:border-primary focus:outline-none transition bg-white text-sm"
                  >
                    <option value="">Select a position</option>
                    <option value="Sales Engineer">Sales Engineer</option>
                    <option value="Technical Sales Representative">Technical Sales Representative</option>
                    <option value="Warehouse & Logistics Coordinator">Warehouse & Logistics Coordinator</option>
                    <option value="Customer Support Specialist">Customer Support Specialist</option>
                    <option value="Procurement Officer">Procurement Officer</option>
                    <option value="Marketing Associate">Marketing Associate</option>
                  </select>
                </div>
              </div>

              {/* Portfolio */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-foreground mb-2">Portfolio / CV Link *</label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border-2 border-primary/20 rounded-lg focus:border-primary focus:outline-none transition bg-white text-sm"
                  placeholder="https://yourportfolio.com or Google Drive/CV link"
                />
                <p className="text-xs text-muted-foreground mt-1">Link to your portfolio, LinkedIn, Google Drive, or CV document</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-3 bg-accent text-white rounded-lg hover:bg-red-600 transition font-bold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>

              <p className="text-center text-muted-foreground text-xs mt-5">
                You can also send your CV directly to{' '}
                <a href="mailto:careers@entityville.com" className="text-accent font-semibold hover:underline">
                  careers@entityville.com
                </a>
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary via-blue-600 to-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/20 rounded-full -ml-40 -mb-40" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-3">Questions About Careers?</h2>
          <p className="text-base text-white/90 mb-5 font-semibold">
            Reach out to our HR team for any inquiries about job opportunities.
          </p>
          <Link href="/contact" className="inline-block px-8 py-3 bg-accent text-white rounded-lg hover:bg-red-600 transition font-bold text-base shadow-lg hover:shadow-xl">
            Contact HR
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}