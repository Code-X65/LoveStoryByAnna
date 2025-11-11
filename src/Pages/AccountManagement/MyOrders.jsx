import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, Heart, Settings, LogOut, ChevronRight, Edit2, Trash2, Plus, Eye, X, Truck, CreditCard, Phone, Mail } from 'lucide-react';
import { auth } from '../../Firebase/Firebase';
import { getUserOrders } from '../../Firebase/orderServices';

// Order Details Modal Component
const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'in transit':
      case 'shipped':
        return 'text-blue-600 bg-blue-50';
      case 'processing':
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/[0.7] pt-70 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-600 mt-1">#{order.orderNumber || order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Date */}
          <div className="flex flex-wrap gap-4 items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Date</p>
              <p className="font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
            </div>
            <div className="flex gap-2">
              <span className={`px-4 py-2 text-sm font-medium capitalize rounded ${getStatusColor(order.status)}`}>
                {order.status || 'Pending'}
              </span>
              {order.paymentStatus && (
                <span className={`px-4 py-2 text-sm font-medium capitalize rounded ${
                  order.paymentStatus === 'paid' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'
                }`}>
                  {order.paymentStatus}
                </span>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={20} className="text-pink-300" />
              Order Items ({order.items?.length || 0})
            </h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-pink-300 transition-colors">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=100&h=100&fit=crop'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded border border-gray-200"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      {item.size && <p>Size: {item.size}</p>}
                      <p>Quantity: {item.quantity}</p>
                      <p className="font-semibold text-gray-900">₦{(item.price || 0).toLocaleString()} each</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ₦{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-pink-300" />
              Shipping Address
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2">
                {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{order.shippingAddress?.address}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                <p>{order.shippingAddress?.country || 'Nigeria'}</p>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-300">
                  <Phone size={14} />
                  <span>{order.shippingAddress?.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} />
                  <span>{order.shippingAddress?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Shipping Info */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-pink-300" />
                Payment Method
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-medium text-gray-900 capitalize">
                  {order.paymentMethod === 'card' ? 'Credit/Debit Card' :
                   order.paymentMethod === 'bank' ? 'Bank Transfer' :
                   order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'N/A'}
                </p>
                {order.paymentReference && (
                  <p className="text-xs text-gray-600 mt-2">
                    Ref: {order.paymentReference}
                  </p>
                )}
              </div>
            </div>

            {/* Shipping Method */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Truck size={20} className="text-pink-300" />
                Shipping Method
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-medium text-gray-900 capitalize">
                  {order.shippingMethod === 'express' ? 'Express Delivery (2-3 days)' :
                   order.shippingMethod === 'standard' ? 'Standard Delivery (5-7 days)' : 'N/A'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  ₦{(order.shippingCost || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span className="font-medium">₦{(order.subtotal || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className="font-medium">₦{(order.shippingCost || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (7.5%)</span>
                <span className="font-medium">₦{(order.tax || 0).toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-300 pt-3 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>₦{(order.total || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-pink-300 text-white font-semibold hover:bg-pink-400 transition-colors"
          >
            Print Order
          </button>
        </div>
      </div>
    </div>
  );
};

// Orders Component
const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('Please login to view your orders');
          setLoading(false);
          return;
        }

        const userOrders = await getUserOrders(user.uid);
        setOrders(userOrders);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'in transit':
      case 'shipped':
        return 'text-blue-600 bg-blue-50';
      case 'processing':
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    // Handle Firestore Timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="bg-white border max-w-7xl mx-auto border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">My Orders</h2>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-300 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border max-w-7xl mx-auto border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">My Orders</h2>
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-pink-300 text-white hover:bg-pink-400 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border  max-w-7xl mx-auto border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">My Orders</h2>
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
          <a 
            href="/shop" 
            className="inline-block px-6 py-2 bg-pink-300 text-white hover:bg-pink-400 transition-colors"
          >
            Start Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border max-w-7xl mx-auto mt-10 border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">My Orders</h2>
        
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 p-4 hover:border-pink-300 transition-colors">
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={order.items && order.items[0]?.image || 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=100&h=100&fit=crop'}
                  alt="Order"
                  className="w-20 h-20 object-cover border border-gray-200"
                />
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        #{order.orderNumber || order.id}
                      </p>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`px-3 py-1 text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status || 'Pending'}
                      </span>
                      {order.paymentStatus && (
                        <span className={`px-3 py-1 text-xs font-medium capitalize ${
                          order.paymentStatus === 'paid' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'
                        }`}>
                          Payment: {order.paymentStatus}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
                    <div className="text-sm text-gray-600">
                      <p>{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}</p>
                      <p className="font-semibold text-gray-900 mt-1">
                        Total: ₦{(order.total || 0).toLocaleString()}
                      </p>
                      {order.shippingMethod && (
                        <p className="text-xs text-gray-500 mt-1 capitalize">
                          Shipping: {order.shippingMethod}
                        </p>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-2 text-pink-300 hover:text-pink-400 text-sm font-medium transition-colors"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </>
  );
};

export default MyOrders;