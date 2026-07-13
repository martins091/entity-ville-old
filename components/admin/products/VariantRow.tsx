"use client";

import { X } from 'lucide-react';

interface Variant {
  id?: string;
  part_number: string;
  size: string;
  weight: string;
  price: number;
  stock_quantity: number;
}

interface VariantRowProps {
  variant: Variant;
  index: number;
  onUpdate: (field: keyof Variant, value: string | number) => void;
  onRemove: () => void;
  isRemovable: boolean;
}

export function VariantRow({ variant, index, onUpdate, onRemove, isRemovable }: VariantRowProps) {
  return (
    <div className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all">
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400">Variant #{index + 1}</span>
            {variant.part_number && (
              <span className="text-xs font-mono text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                {variant.part_number}
              </span>
            )}
          </div>
          {isRemovable && (
            <button type="button" onClick={onRemove} className="text-gray-400 hover:text-red-600 transition">
              <X size={14} />
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <input
            value={variant.part_number}
            onChange={(e) => onUpdate('part_number', e.target.value)}
            placeholder="Part number"
            className="h-9 rounded-lg border border-gray-200 px-2 text-sm focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-none transition"
          />
          <input
            value={variant.size}
            onChange={(e) => onUpdate('size', e.target.value)}
            placeholder="Size"
            className="h-9 rounded-lg border border-gray-200 px-2 text-sm focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-none transition"
          />
          <input
            value={variant.weight}
            onChange={(e) => onUpdate('weight', e.target.value)}
            placeholder="Weight"
            className="h-9 rounded-lg border border-gray-200 px-2 text-sm focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-none transition"
          />
          <input
            type="number"
            value={variant.price || ''}
            onChange={(e) => onUpdate('price', parseInt(e.target.value) || 0)}
            placeholder="Price (₦)"
            className="h-9 rounded-lg border border-gray-200 px-2 text-sm focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-none transition"
          />
        </div>
      </div>
    </div>
  );
}