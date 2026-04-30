import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { CartItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: (details: { name: string; email: string; address: string }) => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckout }) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [details, setDetails] = useState({ name: '', email: '', address: '' });
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckout(details);
    setStep('success');
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setStep('cart');
      setDetails({ name: '', email: '', address: '' });
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <ShoppingBag size={24} className="text-indigo-600" />
                <h2 className="text-xl font-bold">
                  {step === 'cart' ? 'Your Cart' : step === 'checkout' ? 'Checkout' : 'Order Placed'}
                </h2>
                {step === 'cart' && (
                  <span className="text-sm text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </div>
              <button onClick={resetAndClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close cart">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {step === 'cart' && (
                <div className="space-y-6">
                  {items.length === 0 ? (
                    <div className="h-full py-20 flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <ShoppingBag size={40} className="text-gray-300" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Your cart is empty</h3>
                      <button onClick={onClose} className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-full font-bold">
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex gap-4 group">
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                              <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500" aria-label="Remove item">
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center border border-gray-100 rounded-lg">
                              <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1" disabled={item.quantity <= 1} aria-label="Decrease quantity">
                                <Minus size={12} />
                              </button>
                              <span className="px-2 text-xs font-bold">{item.quantity}</span>
                              <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1" aria-label="Increase quantity">
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="font-bold text-indigo-600 text-sm">${item.price * item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {step === 'checkout' && (
                <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                      placeholder="John Doe"
                      value={details.name}
                      onChange={e => setDetails({...details, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                      placeholder="john@example.com"
                      value={details.email}
                      onChange={e => setDetails({...details, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Shipping Address</label>
                    <textarea 
                      required
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                      placeholder="123 Street, City, Zip"
                      value={details.address}
                      onChange={e => setDetails({...details, address: e.target.value})}
                    />
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-xl">
                    <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                      By placing this order, you agree to our terms. This is a secure checkout.
                    </p>
                  </div>
                </form>
              )}

              {step === 'success' && (
                <div className="h-full py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Order Received!</h3>
                  <p className="text-gray-500 mb-8">
                    Thank you for your request. Our team will review your order and contact you for payment instructions shortly.
                  </p>
                  <button 
                    onClick={resetAndClose}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {items.length > 0 && step !== 'success' && (
              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>${subtotal}</span>
                  </div>
                </div>
                
                {step === 'cart' ? (
                  <button 
                    onClick={() => setStep('checkout')}
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <ArrowRight size={20} />
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setStep('cart')}
                      className="flex-1 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold"
                    >
                      Back
                    </button>
                    <button 
                      form="checkout-form"
                      type="submit"
                      className="flex-[2] py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                      Place Request
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
