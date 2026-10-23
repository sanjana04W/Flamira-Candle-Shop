'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, Category, OrderItem, OrderStatus, Coupon, Customer } from '@/types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_COUPONS,
  INITIAL_CUSTOMERS,
} from '@/data/initialData';
import { getDeliveryRate, getNextOrderNumber } from '@/lib/utils';

export interface CartToast {
  id: number;
  productTitle: string;
}

interface CartItem extends OrderItem {
  maxStock: number;
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  deliveryFee: number;
  selectedDistrict: string;
  appliedCoupon: Coupon | null;
  discountAmount: number;
  finalTotal: number;
  isCartOpen: boolean;
  toastMessage: string | null;
  cartToast: CartToast | null;

  // Actions
  setSelectedDistrict: (district: string) => void;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, selectedVariant?: string, customNote?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  createOrder: (orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => Order;
  updateOrderStatus: (orderNumber: string, status: OrderStatus, note?: string, courier?: { name: string; trackingNo: string }) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  showToast: (msg: string) => void;
  dismissCartToast: () => void;
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CART: 'flamira_cart_v1',
  PRODUCTS: 'flamira_products_v1',
  ORDERS: 'flamira_orders_v1',
  CUSTOMERS: 'flamira_customers_v1',
  DISTRICT: 'flamira_district_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Colombo');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cartToast, setCartToast] = useState<CartToast | null>(null);
  const cartToastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Load from localStorage on client-side mount
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }

      const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }

      const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }

      const storedDistrict = localStorage.getItem(STORAGE_KEYS.DISTRICT);
      if (storedDistrict) {
        setSelectedDistrict(storedDistrict);
      }
    } catch (e) {
      console.warn('Could not read from local storage:', e);
    }
    setIsHydrated(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.DISTRICT, selectedDistrict);
    } catch (e) {
      console.error(e);
    }
  }, [selectedDistrict, isHydrated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const triggerCartToast = (productTitle: string) => {
    if (cartToastTimeoutRef.current) {
      clearTimeout(cartToastTimeoutRef.current);
    }
    const id = Date.now();
    setCartToast({ id, productTitle });
    cartToastTimeoutRef.current = setTimeout(() => {
      setCartToast((curr) => (curr?.id === id ? null : curr));
    }, 4000);
  };

  const dismissCartToast = () => {
    if (cartToastTimeoutRef.current) {
      clearTimeout(cartToastTimeoutRef.current);
    }
    setCartToast(null);
  };

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedVariant?: string,
    customNote?: string
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.selectedVariant === selectedVariant
      );

      const effectivePrice = product.salePrice ?? product.price;

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(updated[existingIndex].quantity + quantity, product.stockQty);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          customNote: customNote || updated[existingIndex].customNote,
        };
        return updated;
      }

      const newItem: CartItem = {
        productId: product.id,
        title: product.title,
        sku: product.sku,
        image: product.images[0] || '/flamira-logo.png',
        price: effectivePrice,
        quantity: Math.min(quantity, Math.max(product.stockQty, 1)),
        selectedVariant,
        customNote,
        maxStock: product.stockQty,
      };

      return [...prev, newItem];
    });

    triggerCartToast(product.title);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          return { ...item, quantity: Math.min(quantity, item.maxStock || 99) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    showToast('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const deliveryRateInfo = getDeliveryRate(selectedDistrict, cartSubtotal);
  const deliveryFee = cart.length === 0 ? 0 : deliveryRateInfo.rate;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
    } else {
      discountAmount = Math.min(appliedCoupon.discountValue, cartSubtotal);
    }
  }

  const finalTotal = Math.max(0, cartSubtotal + deliveryFee - discountAmount);

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = INITIAL_COUPONS.find((c) => c.code.toUpperCase() === trimmed && c.active);

    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }

    if (cartSubtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Coupon requires minimum order value of Rs. ${found.minOrderValue.toLocaleString()}`,
      };
    }

    setAppliedCoupon(found);
    return {
      success: true,
      message: `Coupon ${found.code} applied successfully!`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  const createOrder = (orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Order => {
    const nextNum = getNextOrderNumber(orders);
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderPayload,
      id: nextNum,
      orderNumber: nextNum,
      isEmailVerified: orderPayload.isEmailVerified ?? true,
      verificationCode: orderPayload.verificationCode,
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          status: 'Pending',
          timestamp: now,
          note: `Order placed online (${orderPayload.paymentMethod})${
            orderPayload.isEmailVerified ? ' with verified customer email.' : '.'
          }`,
          updatedBy: 'System',
        },
      ],
    };

    // Decrement stock in memory
    setProducts((prev) =>
      prev.map((prod) => {
        const purchased = orderPayload.items.find((item) => item.productId === prod.id);
        if (purchased) {
          const newQty = Math.max(0, prod.stockQty - purchased.quantity);
          return { ...prod, stockQty: newQty };
        }
        return prod;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);

    // Update customer CRM list
    setCustomers((prev) => {
      const existing = prev.find(
        (c) => c.phone === orderPayload.customer.phone || c.email.toLowerCase() === orderPayload.customer.email.toLowerCase()
      );
      if (existing) {
        return prev.map((c) =>
          c.phone === orderPayload.customer.phone || c.email.toLowerCase() === orderPayload.customer.email.toLowerCase()
            ? {
                ...c,
                orderCount: c.orderCount + 1,
                totalSpent: c.totalSpent + orderPayload.total,
                lastOrderAt: now,
                isEmailVerified: orderPayload.isEmailVerified ?? c.isEmailVerified ?? true,
              }
            : c
        );
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          name: orderPayload.customer.name,
          phone: orderPayload.customer.phone,
          whatsapp: orderPayload.customer.whatsapp,
          email: orderPayload.customer.email,
          addresses: [orderPayload.deliveryAddress],
          orderCount: 1,
          totalSpent: orderPayload.total,
          lastOrderAt: now,
          isEmailVerified: orderPayload.isEmailVerified ?? true,
        };
        return [newCust, ...prev];
      }
    });

    clearCart();
    setAppliedCoupon(null);

    return newOrder;
  };

  const updateOrderStatus = (
    orderNumber: string,
    status: OrderStatus,
    note?: string,
    courier?: { name: string; trackingNo: string }
  ) => {
    const now = new Date().toISOString();

    setOrders((prev) =>
      prev.map((order) => {
        if (order.orderNumber !== orderNumber) return order;

        // Restore stock if cancelled or failed delivery
        if (
          (status === 'Cancelled' || status === 'Failed Delivery') &&
          order.orderStatus !== 'Cancelled' &&
          order.orderStatus !== 'Failed Delivery'
        ) {
          setProducts((prodList) =>
            prodList.map((p) => {
              const matched = order.items.find((i) => i.productId === p.id);
              if (matched) {
                return { ...p, stockQty: p.stockQty + matched.quantity };
              }
              return p;
            })
          );
        }

        const newHistory = [
          ...order.statusHistory,
          {
            status,
            timestamp: now,
            note: note || `Status updated to ${status}.`,
            updatedBy: 'Flamira Admin',
          },
        ];

        return {
          ...order,
          orderStatus: status,
          courier: courier || order.courier,
          statusHistory: newHistory,
          paymentStatus: status === 'Completed' ? 'Paid' : order.paymentStatus,
          updatedAt: now,
        };
      })
    );

    showToast(`Order ${orderNumber} updated to ${status}`);
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${productData.title}" created successfully`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const now = new Date().toISOString();
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: now } : p))
    );
    showToast('Product updated successfully');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed');
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    showToast('Reset data to initial defaults');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        customers,
        cart,
        cartCount,
        cartSubtotal,
        deliveryFee,
        selectedDistrict,
        appliedCoupon,
        discountAmount,
        finalTotal,
        isCartOpen,
        toastMessage,
        cartToast,
        setSelectedDistrict,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        createOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        showToast,
        dismissCartToast,
        resetToDefaults,
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-espresso-900 text-white px-5 py-3.5 rounded-full shadow-2xl border border-flamira-500/30 text-sm font-medium animate-bounce-in">
          <span className="w-2.5 h-2.5 rounded-full bg-flamira-500 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
