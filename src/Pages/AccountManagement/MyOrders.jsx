import React, { useState } from 'react';
import { User, Package, MapPin, Heart, Settings, LogOut, ChevronRight, Edit2, Trash2, Plus, Eye } from 'lucide-react';
// Orders Component
const MyOrders = () => {
  const orders = [
    {
      id: 'ORD-2024-001',
      date: '2024-10-15',
      status: 'Delivered',
      total: 83950,
      items: 3,
      image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=100&h=100&fit=crop'
    },
    {
      id: 'ORD-2024-002',
      date: '2024-10-28',
      status: 'In Transit',
      total: 45000,
      items: 2,
      image: 'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=100&h=100&fit=crop'
    },
    {
      id: 'ORD-2024-003',
      date: '2024-11-02',
      status: 'Processing',
      total: 67500,
      items: 2,
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=100&h=100&fit=crop'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-600 bg-green-50';
      case 'In Transit':
        return 'text-blue-600 bg-blue-50';
      case 'Processing':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">My Orders</h2>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 p-4 hover:border-pink-300 transition-colors">
            <div className="flex flex-col sm:flex-row gap-4">
              <img
                src={order.image}
                alt="Order"
                className="w-20 h-20 object-cover border border-gray-200"
              />
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.date).toLocaleDateString('en-GB', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
                  <div className="text-sm text-gray-600">
                    <p>{order.items} item{order.items > 1 ? 's' : ''}</p>
                    <p className="font-semibold text-gray-900 mt-1">
                      Total: ₦{order.total.toLocaleString()}
                    </p>
                  </div>
                  
                  <button className="flex items-center gap-2 text-pink-300 hover:text-pink-400 text-sm font-medium">
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
  );
};


export default MyOrders