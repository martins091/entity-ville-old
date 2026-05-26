"use client";

import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";

export default function ProductsSection() {
  return (
    <section
      id="products"
      className="py-24 bg-gradient-to-b from-white via-slate-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-16 max-w-3xl">
          <span className="text-primary font-semibold text-xs tracking-[0.2em] uppercase">
            Our Products
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Premium Electrical{" "}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Components
            </span>
          </h2>

          <p className="mt-4 text-lg text-gray-500 leading-relaxed">
            High-performance electrical materials designed for reliability,
            efficiency, and modern infrastructure across Africa.
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 6).map((product) => (
            <div
              key={product.id}
              className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-white/70 backdrop-blur-xl shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              {/* IMAGE */}
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover scale-100 group-hover:scale-110 transition duration-700"
                />

                {/* gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-80" />

                {/* price badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow text-sm font-semibold">
                  ₦{product.price.toLocaleString()}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-6 flex flex-col justify-between h-[230px]">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition">
                    {product.name}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                    {product.description}
                  </p>
                </div>

                {/* CTA */}
                <div className="mt-6 flex items-center justify-between">
                  <Link
                    href={`/products/${product.slug}`}
                    className="relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-gray-900 text-white overflow-hidden group-hover:bg-primary transition"
                  >
                    <span className="relative z-10">View Details</span>

                    {/* hover glow */}
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 opacity-0 group-hover:opacity-100 transition duration-300"></span>
                  </Link>

                  <span className="text-xs text-gray-400 uppercase tracking-wide">
                    In Stock
                  </span>
                </div>
              </div>

              {/* subtle glow effect */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-primary/20 transition"></div>
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <div className="mt-16 text-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-10 py-4 text-base font-semibold rounded-full bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg hover:shadow-2xl hover:scale-[1.02] transition"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    </section>
  );
}