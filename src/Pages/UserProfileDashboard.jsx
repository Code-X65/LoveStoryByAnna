import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, Heart, Settings, LogOut, ChevronRight, Edit2, Trash2, Plus, Eye } from 'lucide-react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import MyAccount from './AccountManagement/MyAccount';
import MyOrders from './AccountManagement/MyOrders';
import AddressBook from './AccountManagement/AddressBook';
import Wishlist from '../Pages/WishlistPage';
import SettingsPage from './AccountManagement/SettingsPage';
import { auth } from '../Firebase/Firebase';
import { getUserProfile } from '../Firebase/userProfileServices';
import { logout } from '../Firebase/auth';

// Sidebar Component
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    displayName: ''
  });
  const [loading, setLoading] = useState(true);
  
  const navItems = [
    { path: '/profile/account', label: 'My Account', icon: User },
    { path: '/profile/orders', label: 'My Orders', icon: Package },
    { path: '/profile/addresses', label: 'Address Book', icon: MapPin },
    { path: '/profile/wishlist', label: 'Wishlist', icon: Heart },
    { path: '/profile/settings', label: 'Settings', icon: Settings }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const result = await getUserProfile(user.uid);
        if (result.success) {
          setUserData({
            firstName: result.data.firstName || '',
            lastName: result.data.lastName || '',
            email: user.email || '',
            displayName: result.data.displayName || user.displayName || ''
          });
        } else {
          // Fallback to auth data if profile not found
          setUserData({
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
            email: user.email || '',
            displayName: user.displayName || ''
          });
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      const result = await logout();
      if (result.success) {
        navigate('/login');
      } else {
        alert('Failed to logout: ' + result.error);
      }
    }
  };

  const getInitials = () => {
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName[0]}${userData.lastName[0]}`;
    } else if (userData.displayName) {
      const names = userData.displayName.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`;
      }
      return userData.displayName.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    } else if (userData.displayName) {
      return userData.displayName;
    }
    return 'User';
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 p-4">
      {/* User Info */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="w-16 h-16 bg-pink-300 text-white flex items-center justify-center text-2xl font-semibold mb-3 rounded-full">
          {getInitials()}
        </div>
        <h3 className="font-semibold text-gray-900">{getDisplayName()}</h3>
        <p className="text-sm text-gray-600 break-all">{userData.email}</p>
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
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </nav>
    </div>
  );
};

// Main Dashboard Component
const UserProfileDashboard = () => {
  const navigate = useNavigate();
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // Redirect to login if not authenticated
        navigate('/login');
      }
      setAuthChecking(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (authChecking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-300 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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