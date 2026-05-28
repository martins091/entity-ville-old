"use client";

import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  Shield, 
  Tag,
  Plus,
  Minus,
  X,
  Sparkles
} from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

const colors = {
  primary: "#C10008",
  secondary: "#027FFF",
  gradient: "linear-gradient(135deg, #C10008 0%, #027FFF 100%)",
  gradientReverse: "linear-gradient(135deg, #027FFF 0%, #C10008 100%)",
};

export default function CartPage() {
  const { items, updateQty, removeItem, totalItems, totalPrice } = useCart();

  const incrementQty = (id: string, currentQty: number) => {
    updateQty(id, currentQty + 1);
  };

  const decrementQty = (id: string, currentQty: number) => {
    if (currentQty > 1) {
      updateQty(id, currentQty - 1);
    }
  };

  // Calculate savings (assuming 20% off original)
  const originalTotal = totalPrice * 1.2;
  const savings = originalTotal - totalPrice;

  return (
    <main className="bg-white min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16">
        {/* Background Effects */}
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
                  <ShoppingCart size={14} style={{ color: colors.primary }} />
                  <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: colors.secondary }}>
                    Shopping Cart
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black">
                  Your{" "}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-[#C10008] to-[#027FFF] bg-clip-text text-transparent">
                      Cart
                    </span>
                    <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 8" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="cartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={colors.primary} />
                          <stop offset="100%" stopColor={colors.secondary} />
                        </linearGradient>
                      </defs>
                      <path d="M10 4 L190 4" stroke="url(#cartGradient)" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" fill="none"/>
                    </svg>
                  </span>
                </h1>
                <p className="text-gray-500 mt-2">
                  {totalItems === 0 
                    ? "Your cart is waiting for you" 
                    : `You have ${totalItems} item${totalItems > 1 ? 's' : ''} in your cart`}
                </p>
              </div>

              {totalItems > 0 && (
                <div className="text-right">
                  <div className="text-sm text-gray-500">Total Amount</div>
                  <div className="text-3xl font-black" style={{ color: colors.primary }}>
                    ₦{totalPrice.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex p-6 rounded-full bg-gradient-to-r from-red-50 to-blue-50 mb-6">
              <ShoppingBag size={64} style={{ color: colors.primary }} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. 
              Browse our premium electrical components and find what you need.
            </p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              style={{ background: colors.gradient }}
            >
              Browse Products
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Cart Items ({totalItems})</h2>
                <button 
                  onClick={() => items.forEach(item => updateQty(item.id, 0))}
                  className="text-xs text-gray-400 hover:text-red-500 transition"
                >
                  Clear All
                </button>
              </div>

              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.id || item.slug}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent to-transparent group-hover:to-gray-50/50 transition-all duration-300 pointer-events-none" />
                    
                    <div className="flex gap-4 p-4">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 shadow-md">
                        {item.image ? (
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            fill 
                            className="object-cover transition duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag size={24} className="text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-transparent transition-all duration-300 line-clamp-1"
                              style={{
                                backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'inherit'
                              }}>
                              {item.name}
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">Premium Quality</p>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition group/remove"
                          >
                            <Trash2 size={16} className="text-gray-400 group-hover/remove:text-red-500 transition" />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => decrementQty(item.id, item.quantity)}
                              className="p-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-10 text-center font-semibold text-gray-700">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => incrementQty(item.id, item.quantity)}
                              className="p-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-lg font-bold" style={{ color: colors.primary }}>
                              ₦{(item.price * item.quantity).toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-400 line-through">
                              ₦{(item.price * 1.2 * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100 rounded-b-2xl overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500"
                        style={{ 
                          width: `${(item.quantity / 10) * 100}%`,
                          background: colors.gradient 
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Continue Shopping Link */}
              <Link 
                href="/products"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:gap-3 mt-4"
                style={{ color: colors.secondary }}
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:sticky lg:top-24 h-fit"
            >
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 p-6 shadow-xl">
                <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                  <Sparkles size={18} style={{ color: colors.primary }} />
                  Order Summary
                </h3>

                <div className="space-y-3 pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal ({totalItems} items)</span>
                    <span className="font-semibold text-gray-900">₦{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Original Price</span>
                    <span className="text-gray-400 line-through">₦{originalTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">You Save</span>
                    <span className="font-semibold text-green-600">-₦{savings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-semibold text-green-600">
                      {totalPrice > 500000 ? "Free" : "Calculated at checkout"}
                    </span>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-lg font-black">
                    <span>Total</span>
                    <span style={{ color: colors.primary }}>₦{totalPrice.toLocaleString()}</span>
                  </div>
                  
                  {totalPrice < 500000 && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 mt-3">
                      <Truck size={16} style={{ color: colors.secondary }} />
                      <p className="text-xs text-gray-600 flex-1">
                        Add <span className="font-bold" style={{ color: colors.primary }}>₦{(500000 - totalPrice).toLocaleString()}</span> more for free shipping
                      </p>
                    </div>
                  )}

                  {totalPrice >= 500000 && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 mt-3">
                      <Truck size={16} className="text-green-600" />
                      <p className="text-xs text-green-700 font-semibold">Congratulations! You qualify for free shipping</p>
                    </div>
                  )}
                </div>

                {/* Checkout Button */}
                <Link 
                  href="/checkout" 
                  className="relative w-full flex items-center justify-center gap-2 mt-6 px-6 py-3 rounded-xl text-white font-bold transition-all duration-300 hover:scale-105 shadow-lg overflow-hidden group"
                  style={{ background: colors.gradient }}
                >
                  <span className="relative z-10">Proceed to Checkout</span>
                  <CreditCard size={18} className="relative z-10 group-hover:translate-x-1 transition" />
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition" />
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Shield size={12} style={{ color: colors.secondary }} />
                      <span>Secure Checkout</span>
                    </div>
                    <div className="w-px h-3 bg-gray-300" />
                    <div className="flex items-center gap-1">
                      <Truck size={12} style={{ color: colors.primary }} />
                      <span>Fast Delivery</span>
                    </div>
                    <div className="w-px h-3 bg-gray-300" />
                    <div className="flex items-center gap-1">
                      <Tag size={12} style={{ color: colors.secondary }} />
                      <span>Best Prices</span>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 text-center mb-2">Secure payment methods</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xs font-mono text-gray-500">VISA</span>
                    <span className="text-xs font-mono text-gray-500">Mastercard</span>
                    <span className="text-xs font-mono text-gray-500">Bank Transfer</span>
                  </div>
                </div>
              </div>

              {/* Promo Code Section */}
              <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2">
                  <Tag size={16} style={{ color: colors.secondary }} />
                  <input 
                    type="text" 
                    placeholder="Promo code"
                    className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                    style={{ focusRingColor: colors.primary }}
                  />
                  <button 
                    className="px-4 py-2 text-sm font-semibold rounded-lg transition"
                    style={{ color: colors.primary, backgroundColor: `${colors.primary}10` }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}