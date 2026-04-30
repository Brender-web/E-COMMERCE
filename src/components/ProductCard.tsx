import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../types';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.featured && (
          <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
            Best Seller
          </span>
        )}
        <button 
          type="button"
          onClick={() => onAddToCart(product)}
          aria-label="Add product to cart"
          className="absolute bottom-4 right-4 p-3 bg-white text-indigo-600 rounded-full shadow-lg transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-indigo-600 hover:text-white"
        >
          <ShoppingCart size={20} />
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">{product.category}</p>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
          </div>
          <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
            <Star size={14} fill="currentColor" className="mr-1" />
            <span className="text-xs font-bold">{product.rating}</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-black text-gray-900">${product.price}</span>
          <button 
            type="button"
            onClick={() => onAddToCart(product)}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 sm:hidden"
          >
            Add to cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};
