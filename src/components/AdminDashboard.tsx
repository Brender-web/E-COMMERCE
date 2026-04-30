import React, { useState, useEffect } from 'react';
import { orderStorage } from '../utils/storage';
import type { Order, OrderStatus, PaymentStatus, Product } from '../types';
import { 
  Package, 
  DollarSign, 
  CheckCircle2, 
  ExternalLink,
  Search,
  Plus,
  Trash2,
  LayoutGrid,
  ClipboardList
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Product Form State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'Apparel',
    description: '',
    image: '',
    rating: 5,
    featured: true
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    const ordersData = await orderStorage.getOrders();
    const productsData = await orderStorage.getProducts();
    setOrders(ordersData);
    setProducts(productsData);
  };

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await orderStorage.updateOrderStatus(orderId, status);
    refreshData();
  };

  const handlePaymentChange = async (orderId: string, status: PaymentStatus) => {
    await orderStorage.updatePaymentStatus(orderId, status);
    refreshData();
  };

  const filteredOrders = orders.filter(o => 
    o.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.includes(searchTerm) ||
    o.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      ...newProduct as Product,
      id: Date.now().toString(),
      price: Number(newProduct.price),
      rating: 5,
    };
    await orderStorage.saveProduct(product);
    setIsAddingProduct(false);
    setNewProduct({ name: '', price: 0, category: 'Apparel', description: '', image: '', rating: 5, featured: true });
    refreshData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await orderStorage.deleteProduct(id);
      refreshData();
    }
  };

  const stats = [
    { label: 'Total Revenue', value: `$${orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 0)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Products', value: products.length, icon: LayoutGrid, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Completed Orders', value: orders.filter(o => o.status === 'Delivered').length, icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Admin Control Center</h1>
            <p className="text-gray-500">Manage your shop inventory and customer orders.</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <div className="flex bg-white rounded-lg p-1 border border-gray-200">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <ClipboardList size={18} /> Orders
              </button>
              <button 
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <LayoutGrid size={18} /> Products
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label} 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder={activeTab === 'orders' ? "Search orders..." : "Search products..."}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {activeTab === 'products' && (
            <button 
              onClick={() => setIsAddingProduct(true)}
              className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              <Plus size={20} /> Add New Arrival
            </button>
          )}
        </div>

        {activeTab === 'orders' ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Recent Requests</h2>
              <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                Export Report <ExternalLink size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No orders found.</td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-gray-400">#{order.id.slice(0, 8)}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.userName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{order.items.length} items</td>
                        <td className="px-6 py-4 text-sm font-black">${order.total}</td>
                        <td className="px-6 py-4">
                          <select 
                            title="Payment Status"
                            value={order.paymentStatus}
                            onChange={(e) => handlePaymentChange(order.id, e.target.value as PaymentStatus)}
                            className="text-xs font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border-none cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            title="Order Status"
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className="text-xs font-bold px-2 py-1 rounded-full bg-blue-50 text-blue-700 border-none cursor-pointer"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
              <div key={product.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col group">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="absolute top-2 right-2 p-2 bg-white/90 text-red-500 rounded-lg shadow-sm hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    aria-label={`Delete ${product.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{product.category}</span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">{product.name}</h3>
                  <p className="text-sm font-black text-indigo-600 mt-1">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Product Modal */}
        {isAddingProduct && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-black mb-6">Add New Arrival</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label htmlFor="product-name" className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-1">Product Name</label>
                    <input id="product-name" required type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-200" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                  </div>
                  <div>
                    <label htmlFor="product-price" className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-1">Price ($)</label>
                    <input id="product-price" required type="number" className="w-full px-4 py-2.5 rounded-xl border border-gray-200" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label htmlFor="product-category" className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-1">Category</label>
                    <select id="product-category" className="w-full px-4 py-2.5 rounded-xl border border-gray-200" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                      <option>Apparel</option>
                      <option>Accessories</option>
                      <option>Electronics</option>
                      <option>Home Decor</option>
                      <option>Travel</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="product-image" className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-1">Image URL</label>
                    <input id="product-image" required type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-200" placeholder="https://unsplash.com/..." value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="product-description" className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-1">Description</label>
                    <textarea id="product-description" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200" rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsAddingProduct(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-500">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold">Add Arrival</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
