import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import type { Product, CartItem, Order } from './types';
import { orderStorage } from './utils/storage';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, ShieldCheck, Truck, Lock, User } from 'lucide-react';

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAdmin, setIsAdmin] = useState(false);
  const [shopProducts, setShopProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    const loadProducts = async () => {
      const data = await orderStorage.getProducts();
      setShopProducts(data);
    };
    loadProducts();
  }, [isAdmin]);

  const categories = ['All', ...new Set(shopProducts.map(p => p.category))];

  const handleCheckout = async (details: { name: string; email: string; address: string }) => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: 'user-' + Date.now(),
      userName: details.name,
      userEmail: details.email,
      address: details.address,
      items: [...cartItems],
      total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'Processing',
      paymentMethod: 'M-Pesa', // Default payment method for demo
      paymentStatus: 'Pending',
      createdAt: new Date().toISOString(),
    };

    await orderStorage.saveOrder(newOrder);
    setCartItems([]);
  };

  const filteredProducts = selectedCategory === 'All' 
    ? shopProducts 
    : shopProducts.filter(p => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Navbar 
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)} 
      />

      {/* Floating Admin Toggle */}
      <button 
        onClick={() => setIsAdmin(!isAdmin)}
        className="fixed bottom-8 left-8 z-[100] bg-gray-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        {isAdmin ? <User size={20} /> : <Lock size={20} />}
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap px-0 group-hover:px-2 font-bold text-sm">
          {isAdmin ? 'Back to Shop' : 'Admin Dashboard'}
        </span>
      </button>
      
      <main>
        {isAdmin ? (
          <AdminDashboard />
        ) : (
          <>
            <Hero />

            {/* Features Section */}
            <section className="py-12 border-y border-gray-100 bg-gray-50/50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <Truck className="text-indigo-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Free Shipping</h3>
                      <p className="text-sm text-gray-500">On all orders over $50</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <ShieldCheck className="text-indigo-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Secure Payment</h3>
                      <p className="text-sm text-gray-500">100% secure checkout</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <Zap className="text-indigo-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Fast Delivery</h3>
                      <p className="text-sm text-gray-500">2-3 business days delivery</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Categories Section */}
            <section id="categories" className="py-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-black text-gray-900 mb-12">Browse Categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { name: 'Accessories', count: 12, img: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&q=80&w=400' },
                    { name: 'Apparel', count: 24, img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=400' },
                    { name: 'Electronics', count: 8, img: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&q=80&w=400' },
                    { name: 'Home Decor', count: 15, img: 'https://images.unsplash.com/photo-1513519247388-193ad51c50be?auto=format&fit=crop&q=80&w=400' },
                  ].map((cat) => (
                    <button 
                      key={cat.name}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="relative h-64 rounded-3xl overflow-hidden group cursor-pointer"
                    >
                      <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-left">
                        <h3 className="text-white text-xl font-bold">{cat.name}</h3>
                        <p className="text-gray-300 text-sm">{cat.count} Products</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Shop Section */}
            <section id="shop" className="py-24 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="text-indigo-600" /> Featured Products
                    </h2>
                    <p className="text-gray-500 max-w-xl">
                      Explore our most popular items, handpicked for quality and style. From everyday essentials to statement pieces.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                          selectedCategory === category 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-600 hover:text-indigo-600'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={addToCart} 
                    />
                  ))}
                </motion.div>
              </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?auto=format&fit=crop&q=80&w=800" 
                      alt="Our Story" 
                      className="rounded-3xl shadow-2xl relative z-10"
                    />
                    <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-indigo-50 rounded-full -z-10" />
                  </div>
                  <div>
                    <span className="text-indigo-600 font-bold uppercase tracking-widest text-sm">Our Story</span>
                    <h2 className="text-4xl font-black text-gray-900 mt-4 mb-6 leading-tight">Crafting Excellence for Your Lifestyle</h2>
                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                      Founded in 2020, Kim's Shop began with a simple mission: to provide high-quality, beautifully designed products that elevate the everyday experience.
                    </p>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                      We believe that the things you use every day should be both functional and inspiring. That's why we partner with independent designers and craftspeople to bring you a curated selection of premium goods.
                    </p>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-4xl font-black text-indigo-600 mb-1">50k+</p>
                        <p className="text-gray-500 font-medium">Happy Customers</p>
                      </div>
                      <div>
                        <p className="text-4xl font-black text-indigo-600 mb-1">100%</p>
                        <p className="text-gray-500 font-medium">Sustainable Materials</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-24 bg-indigo-600 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
              </div>
              
              <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Join the Kim's Shop Insider</h2>
                <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
                  Subscribe to our newsletter and get 15% off your first order. Plus, be the first to know about new arrivals and exclusive offers.
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="flex-1 px-6 py-4 rounded-full bg-white text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-400/50"
                  />
                  <button className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                    Subscribe <ArrowRight size={20} />
                  </button>
                </form>
                <p className="text-indigo-200 text-xs mt-6">
                  By subscribing, you agree to our Privacy Policy and Terms of Service.
                </p>
              </div>
            </section>
          </>
        )}
      </main>

      {!isAdmin && <Footer />}

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        onUpdateQuantity={updateQuantity} 
        onRemove={removeFromCart} 
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default App;
