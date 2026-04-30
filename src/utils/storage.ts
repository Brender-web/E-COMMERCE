import { products as initialProducts } from '../data/products';
import type{ Order, Product } from '../types';
import { supabase } from './supabase';

const ORDERS_KEY = 'kims_shop_orders';
const PRODUCTS_KEY = 'kims_shop_products';

const isSupabaseConfigured = () => {
  return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
};

export const orderStorage = {
  // Orders
  getOrders: async (): Promise<Order[]> => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
      if (!error && data) return data as Order[];
    }
    const orders = localStorage.getItem(ORDERS_KEY);
    return orders ? JSON.parse(orders) : [];
  },

  saveOrder: async (order: Order) => {
    if (isSupabaseConfigured()) {
      await supabase.from('orders').insert(order);
    }
    const orders = await orderStorage.getOrders();
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  },

  updateOrderStatus: async (orderId: string, status: Order['status']) => {
    if (isSupabaseConfigured()) {
      await supabase.from('orders').update({ status }).eq('id', orderId);
    }
    const orders = await orderStorage.getOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  },

  updatePaymentStatus: async (orderId: string, paymentStatus: Order['paymentStatus']) => {
    if (isSupabaseConfigured()) {
      await supabase.from('orders').update({ paymentStatus }).eq('id', orderId);
    }
    const orders = await orderStorage.getOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, paymentStatus } : o);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
      if (!error && data && data.length > 0) return data as Product[];
    }
    const products = localStorage.getItem(PRODUCTS_KEY);
    if (!products) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
      return initialProducts;
    }
    return JSON.parse(products);
  },

  saveProduct: async (product: Product) => {
    if (isSupabaseConfigured()) {
      await supabase.from('products').insert(product);
    }
    const products = await orderStorage.getProducts();
    products.unshift(product);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  deleteProduct: async (productId: string) => {
    if (isSupabaseConfigured()) {
      await supabase.from('products').delete().eq('id', productId);
    }
    const products = await orderStorage.getProducts();
    const filtered = products.filter(p => p.id !== productId);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
  }
};
