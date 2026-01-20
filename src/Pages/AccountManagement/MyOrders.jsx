import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, Heart, Settings, LogOut, ChevronRight, Edit2, Trash2, Plus, Eye, X, Truck, CreditCard, Phone, Mail } from 'lucide-react';
import { useAuth } from '../../Context/AuthContextCore';
import { getUserOrders } from '../../firebase/orderServices';

// Order Details Modal Component
const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    // Handle both JS Date objects and Firestore Timestamps
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
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
        return 'text-green-600 bg-green-50 border-green-100';
      case 'in transit':
      case 'shipped':
        return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'processing':
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-100';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        <div className="bg-white border-b border-gray-100 p-6 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Order Details</h2>
            <p className="text-gray-400 font-bold text-sm tracking-wide mt-1">Order #{order.orderNumber || order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-all duration-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
          <div className="flex flex-wrap gap-4 items-center justify-between bg-gray-50/50 p-5 rounded-3xl border border-gray-100">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order Date</p>
              <p className="font-bold text-gray-800">{formatDate(order.createdAt)}</p>
            </div>
            <div className="flex gap-2">
              <span className={`px-4 py-1.5 text-xs font-black uppercase tracking-wide rounded-full border ${getStatusColor(order.status)}`}>
                {order.status || 'Pending'}
              </span>
              {order.paymentStatus && (
                <span className={`px-4 py-1.5 text-xs font-black uppercase tracking-wide rounded-full border ${order.paymentStatus === 'paid' ? 'text-green-600 bg-green-50 border-green-100' : 'text-orange-600 bg-orange-50 border-orange-100'
                  }`}>
                  {order.paymentStatus}
                </span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center">
                <Package size={16} strokeWidth={2.5} />
              </div>
              Items Ordered ({order.items?.length || 0})
            </h3>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 border border-gray-100 rounded-2xl hover:border-pink-200 hover:shadow-sm transition-all bg-white group">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=100&h=100&fit=crop'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 truncate">{item.name}</h4>
                    <div className="text-sm text-gray-500 mt-1 space-y-0.5 font-medium">
                      {item.size && <p className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gray-300"></span>Size: {item.size}</p>}
                      <p className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gray-300"></span>Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-center">
                    <p className="text-xs text-gray-400 font-bold mb-1">Unit Price</p>
                    <p className="font-bold text-gray-900">₦{(item.price || 0).toLocaleString()}</p>
                  </div>
                  <div className="text-right flex flex-col justify-center pl-4 border-l border-gray-100">
                    <p className="text-xs text-gray-400 font-bold mb-1">Total</p>
                    <p className="font-black text-pink-500 text-lg">
                      ₦{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center">
                  <MapPin size={16} strokeWidth={2.5} />
                </div>
                Delivery Details
              </h3>
              <div className="bg-purple-50/50 p-5 rounded-3xl border border-purple-100/50 h-full">
                <p className="font-bold text-gray-900 mb-2 text-lg">
                  {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                </p>
                <div className="text-sm text-gray-600 space-y-2 font-medium">
                  <p className="leading-relaxed">{order.shippingAddress?.address}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                  <p>{order.shippingAddress?.country || 'Nigeria'}</p>

                  <div className="pt-3 mt-3 border-t border-purple-100 space-y-2">
                    <div className="flex items-center gap-2 text-purple-600">
                      <Phone size={14} />
                      <span>{order.shippingAddress?.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600">
                      <Mail size={14} />
                      <span className="truncate">{order.shippingAddress?.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
                    <CreditCard size={16} strokeWidth={2.5} />
                  </div>
                  Payment
                </h3>
                <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100/50">
                  <p className="font-bold text-gray-900 capitalize flex items-center gap-2">
                    {order.paymentMethod === 'card' ? 'Credit/Debit Card' :
                      order.paymentMethod === 'bank' ? 'Bank Transfer' :
                        order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'N/A'}
                    <span className="text-xs bg-white px-2 py-0.5 rounded-md border border-blue-100 text-blue-600 font-bold uppercase">{order.paymentStatus}</span>
                  </p>
                  {order.paymentReference && (
                    <p className="text-xs text-blue-400 font-mono mt-2 bg-blue-50 inline-block px-2 py-1 rounded">
                      Ref: {order.paymentReference}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                    <Truck size={16} strokeWidth={2.5} />
                  </div>
                  Shipping
                </h3>
                <div className="bg-yellow-50/50 p-5 rounded-3xl border border-yellow-100/50 h-full">
                  <p className="font-bold text-gray-900 capitalize">
                    {order.shippingMethod === 'express' ? 'Express Delivery' :
                      order.shippingMethod === 'standard' ? 'Standard Delivery' : 'Standard Delivery'}
                  </p>
                  <p className="text-xs font-bold text-yellow-600 mt-1 uppercase tracking-wider">
                    {order.shippingMethod === 'express' ? '2-3 Business Days' : '5-7 Business Days'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20 pointer-events-none"></div>

            <h3 className="text-lg font-bold text-white mb-6 relative z-10">Payment Summary</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between text-gray-300">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold text-white">₦{(order.subtotal || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span className="font-medium">Shipping Fee</span>
                <span className="font-bold text-white">₦{(order.shippingCost || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span className="font-medium">Tax (7.5%)</span>
                <span className="font-bold text-white">₦{(order.tax || 0).toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-700 pt-4 flex justify-between items-end">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Paid</span>
                <span className="text-3xl font-black text-pink-400">₦{(order.total || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border-t border-gray-100 p-6 flex justify-end gap-3 sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-full hover:border-gray-300 hover:bg-white transition-all"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2"
          >
            <Package size={18} />
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

// Orders Component
const MyOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        setError('Please login to view your orders');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const userOrders = await getUserOrders(currentUser.uid);

        // Map database orders to expected format
        const formattedOrders = userOrders.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt,
          items: order.items?.map(item => ({
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            size: item.size
          })) || [],
          subtotal: order.subtotal,
          shippingCost: order.shippingCost,
          tax: order.tax || 0,
          total: order.total,
          shippingMethod: order.shippingMethod || 'standard',
          paymentMethod: order.paymentMethod,
          paymentReference: order.paymentReference,
          shippingAddress: order.shippingAddress
        }));

        setOrders(formattedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'in transit':
      case 'shipped': return 'text-blue-600 bg-blue-50';
      case 'processing': return 'text-yellow-600 bg-yellow-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[400px] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-pink-400 mx-auto"></div>
        <p className="text-gray-400 font-bold mt-4 animate-pulse">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full flex items-center justify-center mb-4">
          <Package size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{error}</h3>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-pink-400 text-white font-bold rounded-full hover:bg-pink-500 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Order History</h2>
          <p className="text-gray-500 text-sm mt-1">Check the status of your orders</p>
        </div>
        <div className="px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Total Orders</span>
          <span className="text-lg font-black text-gray-800">{orders.length}</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <Package size={32} className="text-gray-300" />
          </div>
          <p className="text-gray-900 font-bold text-lg">No orders found</p>
          <p className="text-gray-500 text-sm mt-1 max-w-xs">You haven't placed any orders yet. Start shopping to see them here!</p>
          <button className="mt-8 px-8 py-3 bg-pink-400 text-white font-bold rounded-full shadow-lg shadow-pink-100 hover:scale-105 transition-all">
            Go Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="group p-5 md:p-6 rounded-3xl border border-gray-100 bg-white hover:border-pink-200 hover:shadow-lg hover:shadow-pink-50/50 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-pink-50 group-hover:text-pink-400 transition-colors border border-gray-100">
                    <Package size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-800">Order #{order.orderNumber || order.id.slice(0, 8)}</h4>
                    <p className="text-sm text-gray-500 font-bold mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 md:gap-6">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="font-black text-gray-900 text-lg">₦{(order.total || 0).toLocaleString()}</p>
                  </div>

                  <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                    {order.status || 'Pending'}
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-pink-500 hover:scale-105 transition-all shadow-md active:scale-95"
                  >
                    <Eye size={14} />
                    Details
                  </button>
                </div>
              </div>

              {order.items?.length > 0 && (
                <div className="mt-5 pt-5 border-t border-gray-50 flex gap-2 overflow-hidden">
                  {order.items.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                      <img src={item.image || 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=50&h=50&fit=crop'} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 text-xs font-bold border border-gray-100">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default MyOrders;