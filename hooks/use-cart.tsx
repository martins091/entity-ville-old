"use client";

import * as React from 'react';

type CartItem = {
  id: string | number;
  name: string;
  price?: number;
  quantity: number;
  image?: string;
  slug?: string;
  size?: string;
  weight?: string;
  partNumber?: string;
  material?: string;
  requiresQuote?: boolean;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeItem: (id: string | number) => void;
  updateQty: (id: string | number, qty: number) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = React.createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'ev_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      console.error('Failed to read cart from storage', e);
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to write cart to storage', e);
    }
  }, [items]);

  const addItem = (item: Omit<CartItem, 'quantity'>, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += qty;
        return copy;
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const removeItem = (id: string | number) => {
    setItems((prev) => prev.filter((p) => p.id !== id && p.slug !== id));
  };

  const updateQty = (id: string | number, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) {
        return prev.filter((p) => p.id !== id && p.slug !== id);
      }

      return prev.map((p) => (p.id === id || p.slug === id ? { ...p, quantity: qty } : p));
    });
  };

  const clear = () => setItems([]);

  const totalItems = items.reduce((s, it) => s + it.quantity, 0);
  const totalPrice = items.reduce((s, it) => s + (it.price || 0) * it.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clear, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}

export default useCart;
