"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  Check, 
  Banknote,
  Building2,
  CreditCard,
  Clock,
  Shield,
  Mail,
  MessageCircle,
  ArrowLeft,
  FileText,
  Truck,
  Award,
  Package,
  X,
  PartyPopper
} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useCart } from '@/hooks/use-cart';
import { getStoredOrder, notifyTransfer, type StoredOrder } from '@/lib/supabase/orders';

const colors = {
  primary: "#C10008",
  secondary: "#027FFF",
  gradient: "linear-gradient(135deg, #C10008 0%, #027FFF 100%)",
  gradientReverse: "linear-gradient(135deg, #027FFF 0%, #C10008 100%)",
};

export default function CheckoutTransferClient() {
  const { items, totalPrice, clear } = useCart();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [effectiveOrderId, setEffectiveOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId') || localStorage.getItem('entityville.orderId');

    if (orderId) {
      setEffectiveOrderId(orderId);
      localStorage.setItem('entityville.orderId', orderId);

      const storedOrder = getStoredOrder(orderId);
      if (storedOrder) {
        setOrder(storedOrder);
      }
    }
  }, []);

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  async function handleConfirmTransfer() {
    if (!effectiveOrderId) return;
    setLoading(true);
    setMessage(null);

    try {
      if (!order) throw new Error('Order details were not found.');

      await notifyTransfer(order);
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'transfer_notified',
          orderReference: order.order_reference,
          email: order.customer.email,
        }),
      }).catch((error) => {
        console.error('Transfer notification email request failed', error);
      });
      setOrder({ ...order, status: 'transfer_notified' });
      
      // Show the big success modal instead of a small message
      setSuccessModalOpen(true);
      clear();
      
      // Close the confirmation dialog if open
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'There was a problem confirming your transfer. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  const displayItems = order?.items ?? items;
  const displayTotal = order?.total ?? totalPrice;

  async function handleResendConfirmation() {
    if (!order) return;
    setResending(true);
    setMessage(null);

    try {
      const response = await fetch('/api/resend-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderReference: order.order_reference,
          email: order.customer.email,
        }),
      });
      const data = await response.json();
      setMessage({ type: 'info', text: data.warning || data.error || 'Confirmation email sent.' });
    } catch {
      setMessage({ type: 'error', text: 'Order saved. We could not resend email immediately, but your reference is shown here.' });
    } finally {
      setResending(false);
    }
  }

  if (!effectiveOrderId) {
    return (
      <main className="bg-white min-h-screen">
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto px-4"
          >
            <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-red-50 to-blue-50 mb-6">
              <Banknote size={48} style={{ color: colors.primary }} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-3">No Order Found</h1>
            <p className="text-gray-500 mb-8">We couldn't find an order reference. Please place your order first, then complete the transfer.</p>
            <Link 
              href="/checkout" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105"
              style={{ background: colors.gradient }}
            >
              Go to Checkout
              <ArrowLeft size={18} />
            </Link>
          </motion.div>
        </div>
        <Footer />
      </main>
    );
  }

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
                  <Banknote size={14} style={{ color: colors.primary }} />
                  <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: colors.secondary }}>
                    Final Step
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black">
                  Complete Your{" "}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-[#C10008] to-[#027FFF] bg-clip-text text-transparent">
                      Transfer
                    </span>
                    <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 8" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="transferGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={colors.primary} />
                          <stop offset="100%" stopColor={colors.secondary} />
                        </linearGradient>
                      </defs>
                      <path d="M10 4 L190 4" stroke="url(#transferGradient)" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" fill="none"/>
                    </svg>
                  </span>
                </h1>
                <p className="text-gray-500 mt-2">Your order is ready. Transfer the amount below and confirm once completed.</p>
              </div>

              <Link 
                href="/checkout"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:gap-1"
                style={{ color: colors.secondary }}
              >
                <ArrowLeft size={16} />
                Back to Checkout
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
                  : message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}
            >
              {message.type === 'error' ? (
                <AlertCircle size={20} className="text-red-500" />
              ) : message.type === 'success' ? (
                <CheckCircle size={20} className="text-green-500" />
              ) : (
                <AlertCircle size={20} className="text-blue-500" />
              )}
              <span className="text-sm">{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Same as before */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Reference Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={16} style={{ color: colors.secondary }} />
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Order Reference</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-2xl font-mono font-bold text-gray-900">{order?.order_reference || effectiveOrderId}</p>
                    <button
                      onClick={() => copyToClipboard(order?.order_reference || effectiveOrderId, 'reference')}
                      className="p-2 rounded-lg hover:bg-gray-100 transition"
                    >
                      {copiedField === 'reference' ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <Copy size={16} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1 justify-end">
                    <Clock size={14} style={{ color: colors.primary }} />
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Amount</p>
                  </div>
                  <p className="text-3xl font-black" style={{ color: colors.primary }}>
                    ₦{displayTotal.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={resending}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 disabled:opacity-50"
                  style={{ color: colors.secondary, backgroundColor: `${colors.secondary}10` }}
                >
                  <Mail size={14} />
                  {resending ? 'Sending...' : 'Email me my order details'}
                </button>
              </div>
            </motion.div>

            {/* Bank Transfer Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Building2 size={20} style={{ color: colors.primary }} />
                Bank Transfer Instructions
              </h2>

              <div className="space-y-4">
                {[
                  { label: 'Bank', value: 'First Bank of Nigeria', icon: Building2 },
                  { label: 'Account Name', value: 'Entity Ville Ltd', icon: Building2 },
                  { label: 'Account Number', value: '1234567890', icon: CreditCard },
                  { label: 'Transfer Amount', value: `₦${displayTotal.toLocaleString()}`, icon: Banknote },
                ].map((item, idx) => (
                  <div key={idx} className="group relative">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.secondary}10` }}>
                          <item.icon size={16} style={{ color: colors.secondary }} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                          <p className="font-semibold text-gray-900 font-mono">{item.value}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(item.value, item.label)}
                        className="p-2 rounded-lg hover:bg-white transition"
                      >
                        {copiedField === item.label ? (
                          <Check size={16} className="text-green-500" />
                        ) : (
                          <Copy size={16} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Confirmation Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-r from-blue-50 to-white rounded-2xl border border-blue-100 p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Shield size={18} style={{ color: colors.primary }} />
                    Confirm Your Transfer
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    After making the payment, click below to notify us. We'll verify and deliver your product.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDialogOpen(true)}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  style={{ background: colors.gradient }}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      I have made the transfer
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 p-6 shadow-xl"
            >
              <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                <FileText size={18} style={{ color: colors.primary }} />
                Order Summary
              </h2>

              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                {displayItems.length ? (
                  displayItems.map((item, idx) => (
                    <div key={idx} className="flex gap-3 p-3 rounded-xl bg-white border border-gray-100">
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
                          ₦{((item.price ?? 0) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No items in cart
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-lg font-black">
                  <span>Total</span>
                  <span style={{ color: colors.primary }}>₦{displayTotal.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>

            {/* Support Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg text-center"
            >
              <div className="inline-flex p-3 rounded-xl mb-4" style={{ backgroundColor: `${colors.secondary}10` }}>
                <MessageCircle size={24} style={{ color: colors.secondary }} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-500 mb-4">
                If you have any questions during the transfer, contact our support team.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 w-full justify-center"
                style={{ background: colors.gradient }}
              >
                Contact Support
              </Link>
            </motion.div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-r from-red-50 to-blue-50 rounded-2xl p-4 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award size={16} style={{ color: colors.primary }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.secondary }}>
                  Secure Transaction
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Your payment is protected. We verify all transfers within 24 hours.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {dialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="h-1 w-full" style={{ background: colors.gradient }} />
              
              <div className="p-6">
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  className="absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <X size={20} className="text-gray-400" />
                </button>

                <div className="text-center mb-6">
                  <div className="inline-flex p-3 rounded-full mb-4" style={{ backgroundColor: `${colors.primary}10` }}>
                    <Shield size={32} style={{ color: colors.primary }} />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">Confirm Transfer</h2>
                  <p className="text-gray-600 mt-2">
                    Have you completed the bank transfer for order{' '}
                    <span className="font-semibold" style={{ color: colors.primary }}>
                      {order?.order_reference || effectiveOrderId}
                    </span>
                    ?
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck size={16} style={{ color: colors.secondary }} />
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">What happens next?</p>
                  </div>
                  <p className="text-sm text-gray-700">
                    Once confirmed, we will verify your transfer and deliver your product to your doorstep. 
                    This is the final step in your premium checkout experience.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setDialogOpen(false)}
                    className="flex-1 px-5 py-3 rounded-xl border-2 font-semibold transition-all duration-300 hover:scale-105"
                    style={{ borderColor: colors.secondary, color: colors.secondary }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmTransfer}
                    disabled={loading}
                    className="flex-1 px-5 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50"
                    style={{ background: colors.gradient }}
                  >
                    {loading ? 'Processing...' : 'Confirm Transfer'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUCCESS MODAL - Big, Beautiful, and Prominent */}
      <AnimatePresence>
        {successModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Animated gradient top bar */}
              <div className="h-2 w-full" style={{ background: colors.gradient }} />
              
              {/* Close button */}
              <button
                onClick={() => setSuccessModalOpen(false)}
                className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/90 hover:bg-gray-100 transition shadow-md"
              >
                <X size={20} className="text-gray-500" />
              </button>

              <div className="p-8 md:p-12 text-center">
                {/* Animated success icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2, damping: 15 }}
                  className="inline-flex mb-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
                    <div 
                      className="relative w-24 h-24 rounded-full flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)` }}
                    >
                      <CheckCircle size={56} className="text-green-500" />
                    </div>
                  </div>
                </motion.div>

                {/* Celebration confetti effect */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <PartyPopper size={24} style={{ color: colors.primary }} />
                    <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.secondary }}>
                      Payment Confirmed!
                    </span>
                    <PartyPopper size={24} style={{ color: colors.primary }} />
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                    Thank You for Your
                    <span className="block bg-gradient-to-r from-[#C10008] to-[#027FFF] bg-clip-text text-transparent">
                      Transfer Notice
                    </span>
                  </h2>

                  <div className="max-w-md mx-auto">
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      We have received your notice. Our team will verify your transfer and deliver your product to your doorstep.
                    </p>
                  </div>
                </motion.div>

                {/* Order reference box */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-5 mb-6 border border-gray-100"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Order Reference</p>
                  <div className="flex items-center justify-center gap-3">
                    <p className="text-2xl font-mono font-bold text-gray-900">
                      {order?.order_reference || effectiveOrderId}
                    </p>
                    <button
                      onClick={() => copyToClipboard(order?.order_reference || effectiveOrderId, 'success-reference')}
                      className="p-2 rounded-lg hover:bg-white transition shadow-sm"
                    >
                      {copiedField === 'success-reference' ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <Copy size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Next steps */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-blue-50 rounded-2xl p-5 mb-8"
                >
                  <div className="flex items-center gap-2 mb-3 justify-center">
                    <Clock size={18} style={{ color: colors.secondary }} />
                    <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.secondary }}>
                      What happens next?
                    </p>
                  </div>
                  <div className="space-y-3 text-left max-w-sm mx-auto">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold" style={{ color: colors.primary }}>1</span>
                      </div>
                      <p className="text-sm text-gray-700">Our team verifies your bank transfer (typically within 24 hours)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold" style={{ color: colors.primary }}>2</span>
                      </div>
                      <p className="text-sm text-gray-700">You'll receive a confirmation email once payment is verified</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold" style={{ color: colors.primary }}>3</span>
                      </div>
                      <p className="text-sm text-gray-700">Your order is prepared and shipped to your doorstep</p>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                    style={{ color: colors.secondary, backgroundColor: `${colors.secondary}10` }}
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    href="/track-order"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                    style={{ background: colors.gradient }}
                  >
                    Track Your Order
                    <ArrowLeft size={16} className="rotate-180" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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