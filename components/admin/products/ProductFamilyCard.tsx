"use client";

import { useState } from 'react';
import { Package, Tag, Trash2 } from 'lucide-react';

interface ProductFamilyCardProps {
  family: {
    id: string;
    name: string;
    image_url: string | null;
    description: string;
    material: string;
    is_featured: boolean;
    category?: { name: string };
    variants?: Array<{ price: number }>;
    updated_at: string;
  };
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  colors: { primary: string; secondary: string; gradient: string };
}

export function ProductFamilyCard({ family, isSelected, onSelect, onDelete, colors }: ProductFamilyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const variantCount = family.variants?.length || 0;
  const minPrice = family.variants?.length 
    ? Math.min(...family.variants.map(v => v.price).filter(p => p > 0)) 
    : 0;

  return (
    <div
      className={`group relative transition-all duration-300 cursor-pointer ${
        isSelected ? 'ring-2 ring-offset-2' : ''
      }`}
      style={isSelected ? { ringColor: colors.primary } : {}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      <div 
        className={`absolute -inset-0.5 rounded-xl blur-md transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} 
        style={{ background: colors.gradient, opacity: 0.15 }} 
      />
      
      <div className="relative flex gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
        <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {family.image_url ? (
            <img src={family.image_url} alt={family.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <Package size={28} className="text-gray-300" />
            </div>
          )}
          {family.is_featured && (
            <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg">
              FEATURED
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-gray-900 line-clamp-1">{family.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">{family.category?.name || 'Uncategorized'}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-xs text-gray-500">{family.material}</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
              {variantCount} variants
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{family.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Tag size={10} />{minPrice > 0 ? `₦${minPrice.toLocaleString()}+` : 'No price'}</span>
            <span>Updated {new Date(family.updated_at).toLocaleDateString()}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}