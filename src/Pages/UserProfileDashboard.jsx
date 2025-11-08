import React, { useState } from 'react';
import { User, Package, MapPin, Heart, Settings, LogOut, ChevronRight, Edit2, Trash2, Plus, Eye } from 'lucide-react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import MyAccount from './AccountManagement/MyAccount';
import MyOrders from './AccountManagement/MyOrders';
import AddressBook from './AccountManagement/AddressBook';
import Wishlist from './AccountManagement/Wishlist';
import SettingsPage from './AccountManagement/SettingsPage';










// Sidebar Component
const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/profile/account', label: 'My Account', icon: User },
    { path: '/profile/orders', label: 'My Orders', icon: Package },
    { path: '/profile/addresses', label: 'Address Book', icon: MapPin },
    { path: '/profile/wishlist', label: 'Wishlist', icon: Heart },
    { path: '/profile/settings', label: 'Settings', icon: Settings }
  ];

  const userData = {
    firstName: 'Chioma',
    lastName: 'Okonkwo',
    email: 'chioma.okonkwo@email.com'
  };

  return (
    <div className="bg-white border border-gray-200 p-4">
      {/* User Info */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="w-16 h-16 bg-pink-300 text-white flex items-center justify-center text-2xl font-semibold mb-3">
          {userData.firstName[0]}{userData.lastName[0]}
        </div>
        <h3 className="font-semibold text-gray-900">{userData.firstName} {userData.lastName}</h3>
        <p className="text-sm text-gray-600">{userData.email}</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                isActive
                  ? 'bg-pink-300 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
              <ChevronRight size={16} className="ml-auto" />
            </Link>
          );
        })}
        <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors">
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </nav>
    </div>
  );
};

// Main Dashboard Component
const UserProfileDashboard = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">My Profile</h1>
          <p className="text-sm text-gray-600">Manage your account and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Routes>
              <Route path="/" element={<Navigate to="/profile/account" replace />} />
              <Route path="/account" element={<MyAccount />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/addresses" element={<AddressBook />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDashboard;