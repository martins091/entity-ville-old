"use client";

import Header from '@/components/header';
import Footer from '@/components/footer';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShoppingCart, 
  Zap, 
  Shield, 
  Truck, 
  Star, 
  Clock,
  Award,
  FileText,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  Minus,
  Plus,
  Heart,
  Share2,
  ExternalLink
} from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useEffect, useState } from 'react';
import { productsMap } from '@/lib/products';
import { fetchStorefrontProductBySlug } from '@/lib/supabase/catalog';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const colors = {
  primary: "#C10008",
  secondary: "#027FFF",
  gradient: "linear-gradient(135deg, #C10008 0%, #027FFF 100%)",
  gradientReverse: "linear-gradient(135deg, #027FFF 0%, #C10008 100%)",
};

export default function ProductDetailClient({ slug }) {
  const [product, setProduct] = useState(productsMap[slug]);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [isCartModalOpen, setCartModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(product?.images?.[0] || product?.image);
  const [isWishlist, setIsWishlist] = useState(false);
  const hasPrice = Number(product?.price || 0) > 0;

  useEffect(() => {
    fetchStorefrontProductBySlug(slug).then((item) => {
      if (!item) return;
      setProduct(item);
      setActiveImage(item.images?.[0] || item.image);
    });
  }, [slug]);

  const incrementQty = () => setQty(prev => prev + 1);
  const decrementQty = () => setQty(prev => Math.max(1, prev - 1));

  if (!product) {
    return (
      <main className="bg-white min-h-screen">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-red-50 to-blue-50 mb-4">
              <Zap size={48} style={{ color: colors.primary }} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-500 mb-8">Sorry, we couldn't find this product.</p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105"
              style={{ background: colors.gradient }}
            >
              Back to Products
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
        <Footer />
      </main>
    );
  }

  const handleAdd = () => {
    if (!hasPrice) return;

    addItem(
      {
        id: product.slug,
        name: product.name,
        price: product.price,
        image: activeImage,
        slug: product.slug,
      },
      qty
    );
    setCartModalOpen(true);
  };

  return (
    <main className="bg-white min-h-screen">
      <Header />

      {/* Hero Section - Premium Dual Color */}
      <section className="relative overflow-hidden py-16 lg:py-24">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500 hover:text-gray-700 transition">Home</Link>
            <ChevronLeft size={14} className="text-gray-400 rotate-180" />
            <Link href="/products" className="text-gray-500 hover:text-gray-700 transition">Products</Link>
            <ChevronLeft size={14} className="text-gray-400 rotate-180" />
            <span className="font-semibold" style={{ color: colors.primary }}>{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Image Gallery - Premium */}
            <div>
              {/* Main Image */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl mb-4 group"
              >
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span 
                    className="px-3 py-1.5 text-xs font-bold rounded-lg shadow-lg text-white"
                    style={{ background: colors.gradient }}
                  >
                    In Stock
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => setIsWishlist(!isWishlist)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition shadow-lg"
                  >
                    <Heart size={18} className={isWishlist ? "fill-red-500 text-red-500" : "text-gray-600"} />
                  </button>
                  <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition shadow-lg">
                    <Share2 size={18} className="text-gray-600" />
                  </button>
                </div>
              </motion.div>

              {/* Thumbnails */}
              {product.images && product.images.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                        activeImage === img 
                          ? "shadow-lg" 
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      style={activeImage === img ? { borderColor: colors.primary } : {}}
                    >
                      <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-50 to-blue-50 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.secondary }}>
                  {product.category}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm font-semibold text-gray-700 ml-2">4.9</span>
                </div>
                <span className="text-sm text-gray-400">| 156 reviews</span>
                <div className="flex items-center gap-1">
                  <Shield size={14} style={{ color: colors.secondary }} />
                  <span className="text-xs text-gray-500">2 Year Warranty</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Price</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black" style={{ color: colors.primary }}>
                    {hasPrice ? `₦${product.price.toLocaleString()}` : 'Request Quote'}
                  </span>
                  {hasPrice && (
                    <>
                      <span className="text-sm text-gray-400 line-through">
                        ₦{(product.price * 1.2).toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        Save 20%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6 border-l-3 pl-4" style={{ borderLeftColor: colors.primary }}>
                {product.description}
              </p>

              {/* Features Highlights */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                  <Zap size={16} style={{ color: colors.primary }} />
                  <span className="text-xs font-medium text-gray-700">High Performance</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                  <Shield size={16} style={{ color: colors.secondary }} />
                  <span className="text-xs font-medium text-gray-700">Certified Quality</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                  <Truck size={16} style={{ color: colors.primary }} />
                  <span className="text-xs font-medium text-gray-700">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                  <Clock size={16} style={{ color: colors.secondary }} />
                  <span className="text-xs font-medium text-gray-700">24/7 Support</span>
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={decrementQty}
                      className="p-2 rounded-lg border border-gray-200 hover:border-gray-300 transition"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                      className="w-16 text-center px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#C10008]"
                    />
                    <button 
                      onClick={incrementQty}
                      className="p-2 rounded-lg border border-gray-200 hover:border-gray-300 transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {hasPrice && (
                    <button
                      onClick={handleAdd}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold transition-all duration-300 hover:scale-105 shadow-lg"
                      style={{ background: colors.gradient }}
                    >
                      <ShoppingCart size={18} />
                      Add to Cart - ₦{(product.price * qty).toLocaleString()}
                    </button>
                  )}
                  <Link
                    href="/contact"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 border-2"
                    style={{ borderColor: colors.secondary, color: colors.secondary }}
                  >
                    <FileText size={18} />
                    Request Quote
                  </Link>
                </div>
              </div>

              {/* Stock & Delivery Info */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-semibold text-green-600">In Stock</span>
                  </div>
                  <span className="text-xs text-gray-400">Free shipping over ₦500k</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: '75%', background: colors.gradient }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Only 25 units left - order soon!</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {product.features && product.features.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 mb-3">
                <Award size={20} style={{ color: colors.primary }} />
                <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.secondary }}>
                  Why Choose This Product
                </span>
              </div>
              <h2 className="text-3xl font-black text-gray-900">
                Key <span className="bg-gradient-to-r from-[#C10008] to-[#027FFF] bg-clip-text text-transparent">Features</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {product.features.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition group"
                >
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
                    <CheckCircle2 size={20} style={{ color: colors.primary }} />
                  </div>
                  <span className="text-gray-700 group-hover:text-gray-900 transition">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Technical Specifications */}
      {product.specs && product.specs.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <Zap size={20} style={{ color: colors.secondary }} />
              <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.primary }}>
                Technical Details
              </span>
            </div>
            <h2 className="text-3xl font-black text-gray-900">
              Technical <span className="bg-gradient-to-r from-[#C10008] to-[#027FFF] bg-clip-text text-transparent">Specifications</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {product.specs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition group"
              >
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.secondary}10` }}>
                  <CheckCircle2 size={20} style={{ color: colors.secondary }} />
                </div>
                <span className="text-gray-700 group-hover:text-gray-900 transition font-mono text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Applications Section */}
      {product.applications && product.applications.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 mb-3">
                <Truck size={20} style={{ color: colors.primary }} />
                <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.secondary }}>
                  Common Uses
                </span>
              </div>
              <h2 className="text-3xl font-black text-gray-900">
                Popular <span className="bg-gradient-to-r from-[#C10008] to-[#027FFF] bg-clip-text text-transparent">Applications</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.applications.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-4 rounded-xl bg-white border border-gray-100 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center transition group-hover:scale-110" style={{ backgroundColor: `${colors.primary}10` }}>
                    <ExternalLink size={18} style={{ color: colors.primary }} />
                  </div>
                  <span className="text-gray-700 font-medium group-hover:text-gray-900 transition">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Products Section Placeholder */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900">
            You Might Also <span className="bg-gradient-to-r from-[#C10008] to-[#027FFF] bg-clip-text text-transparent">Like</span>
          </h2>
          <p className="text-gray-500 mt-2">Discover more premium electrical components</p>
        </div>
        
        <div className="text-center">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            style={{ color: colors.secondary, backgroundColor: `${colors.secondary}10` }}
          >
            Browse All Products
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Cart Modal */}
      <Dialog open={isCartModalOpen} onOpenChange={setCartModalOpen}>
        <DialogContent className="max-w-xl rounded-2xl">
          <DialogHeader>
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-green-600">Success</span>
            </div>
            <DialogTitle className="text-2xl font-black">Added to Cart!</DialogTitle>
            <DialogDescription className="text-gray-600">
              {qty} × {product.name} has been added to your cart.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-4">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-white shadow-md">
                <Image src={activeImage} alt={product.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">Quantity: {qty}</p>
                <p className="text-lg font-bold" style={{ color: colors.primary }}>
                  ₦{(product.price * qty).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 gap-3">
            <Link 
              href="/cart" 
              className="inline-flex w-full justify-center items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105"
              style={{ background: colors.gradient }}
            >
              View Cart
              <ArrowRight size={16} />
            </Link>
            <DialogClose className="inline-flex w-full justify-center rounded-xl border-2 px-5 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105"
              style={{ borderColor: colors.secondary, color: colors.secondary }}
            >
              Continue Shopping
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
}
