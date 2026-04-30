import React from 'react';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 sm:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <a href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ml-2 sm:ml-0">
              KIM'S SHOP
            </a>
          </div>

          <div className="hidden sm:flex items-center space-x-8">
            <a href="#home" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Home</a>
            <a href="#shop" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Shop</a>
            <a href="#categories" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Categories</a>
            <a href="#about" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">About</a>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
              aria-label="Search"
            >
              <Search size={22} />
            </button>
            <button
              type="button"
              onClick={onCartClick}
              className="p-2 text-gray-600 hover:text-indigo-600 transition-colors relative"
              aria-label="View cart"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.2rem] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <a href="#home" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => setIsMenuOpen(false)}>Home</a>
              <a href="#shop" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => setIsMenuOpen(false)}>Shop</a>
              <a href="#categories" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => setIsMenuOpen(false)}>Categories</a>
              <a href="#about" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => setIsMenuOpen(false)}>About</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
