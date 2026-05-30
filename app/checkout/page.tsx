"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Truck, 
  Lock, 
  ChevronRight, 
  CreditCard,
  MapPin,
  Phone,
  Mail,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useCart } from '@/hooks/use-cart';
import { createStorefrontOrder } from '@/lib/supabase/orders';

const colors = {
  primary: "#C10008",
  secondary: "#027FFF",
  gradient: "linear-gradient(135deg, #C10008 0%, #027FFF 100%)",
  gradientReverse: "linear-gradient(135deg, #027FFF 0%, #C10008 100%)",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    orderNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!items.length) {
      setMessage({ type: 'error', text: 'Please add at least one product to your cart before checkout.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const order = await createStorefrontOrder({
        customer: { 
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          orderNotes: formData.orderNotes
        },
        items,
        total: totalPrice,
      });

      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'order_confirmation',
          orderReference: order.order_reference,
          email: formData.email,
        }),
      }).catch((error) => {
        console.error('Order confirmation email request failed', error);
      });

      router.push(`/checkout/transfer?orderId=${encodeURIComponent(order.id)}`);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to place order. Please try again.' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute -top-40 -right-20 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse"
            style={{ backgroundColor: colors.primary }}
          />
          <div 
            className="absolute top-40 -left-20 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse"
            style={{ backgroundColor: colors.secondary }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(193,0,8,0.08)_0%,_rgba(2,127,255,0.05)_50%,_transparent_100%)]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-white/80 backdrop-blur-xl border border-gray-100 p-8 shadow-2xl"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-50 to-blue-50 mb-4">
                  <Lock size={14} style={{ color: colors.primary }} />
                  <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: colors.secondary }}>
                    Secure Checkout
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black">
                  Complete Your{" "}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-[#C10008] to-[#027FFF] bg-clip-text text-transparent">
                      Order
                    </span>
                    <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 8" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="checkoutGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={colors.primary} />
                          <stop offset="100%" stopColor={colors.secondary} />
                        </linearGradient>
                      </defs>
                      <path d="M10 4 L190 4" stroke="url(#checkoutGradient)" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" fill="none"/>
                    </svg>
                  </span>
                </h1>
                <p className="text-gray-500 mt-2">Fill in your details to complete your purchase</p>
              </div>

              <Link 
                href="/cart"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:gap-1"
                style={{ color: colors.secondary }}
              >
                <ArrowLeft size={16} />
                Back to Cart
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Alert Messages */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                message.type === 'error' 
                  ? 'bg-red-50 text-red-800 border border-red-200' 
                  : 'bg-green-50 text-green-800 border border-green-200'
              }`}
            >
              {message.type === 'error' ? (
                <AlertCircle size={20} className="text-red-500" />
              ) : (
                <CheckCircle size={20} className="text-green-500" />
              )}
              <span className="text-sm">{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-8">
          {/* Customer Information */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User size={20} style={{ color: colors.primary }} />
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#C10008] transition"
                      placeholder="John Doe"
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#C10008] transition"
                      placeholder="john@example.com"
                      required 
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      type="tel"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#C10008] transition"
                      placeholder="08012345678"
                      required 
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MapPin size={20} style={{ color: colors.secondary }} />
                Shipping Address
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#C10008] transition resize-none"
                    placeholder="Street address, building number, etc."
                    rows={2}
                    required 
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input 
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#C10008] transition"
                      placeholder="Lagos"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input 
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#C10008] transition"
                      placeholder="Lagos"
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ZIP/Postal Code
                  </label>
                  <input 
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#C10008] transition"
                    placeholder="100001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea 
                    name="orderNotes"
                    value={formData.orderNotes}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#C10008] transition resize-none"
                    placeholder="Special delivery instructions, additional information, etc."
                    rows={2}
                  />
                </div>
              </div>
            </motion.div>

            {/* Place Order Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              type="submit"
              disabled={loading}
              className="relative w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: colors.gradient }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <span>Place Order</span>
                  <CreditCard size={20} className="group-hover:translate-x-1 transition" />
                </>
              )}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition" />
            </motion.button>
          </div>

          {/* Order Summary Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 p-6 shadow-xl">
              <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                <FileText size={18} style={{ color: colors.primary }} />
                Order Summary
              </h3>

              <div className="space-y-3 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Items</span>
                  <span className="font-semibold text-gray-900">{items.length} item{items.length !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="py-4 space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <FileText size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold" style={{ color: colors.primary }}>
                        ₦{((item.price || 0) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 space-y-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold text-gray-900">₦{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-semibold text-green-600">
                    {totalPrice > 500000 ? "Free" : "Calculated"}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-black pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span style={{ color: colors.primary }}>₦{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Shipping Note */}
              {totalPrice < 500000 && (
                <div className="mt-4 p-3 rounded-xl bg-blue-50 flex items-center gap-2">
                  <Truck size={16} style={{ color: colors.secondary }} />
                  <p className="text-xs text-gray-600">
                    Add <span className="font-bold" style={{ color: colors.primary }}>₦{(500000 - totalPrice).toLocaleString()}</span> more for free shipping
                  </p>
                </div>
              )}

              {/* Security Badges */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Lock size={12} style={{ color: colors.secondary }} />
                    <span>Secure SSL</span>
                  </div>
                  <div className="w-px h-3 bg-gray-300" />
                  <div className="flex items-center gap-1">
                    <Shield size={12} style={{ color: colors.primary }} />
                    <span>Fraud Protection</span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-400 text-center leading-relaxed">
                After placing your order, save your order reference number. 
                You'll need it along with your email to track your order status.
              </p>
            </div>
          </motion.aside>
        </form>
      </div>

      <Footer />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${colors.primary};
          border-radius: 10px;
        }
      `}</style>
    </main>
  );
}

// Add missing import
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
