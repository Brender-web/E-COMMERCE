export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  rating: number;
  featured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'Refunded';
// Added Payment Methods
export type PaymentMethod = 'M-Pesa' | 'Credit Card' | 'PayPal' | 'Cash on Delivery';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  address: string;
  paymentMethod: PaymentMethod; // New field
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}