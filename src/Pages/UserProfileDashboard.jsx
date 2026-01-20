import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, Heart, Settings, LogOut, ChevronRight, Edit2, Trash2, Plus, Eye } from 'lucide-react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContextCore';
import { getUserProfile } from '../firebase/userProfileServices';
import MyAccount from './AccountManagement/MyAccount';
import MyOrders from './AccountManagement/MyOrders';
import AddressBook from './AccountManagement/AddressBook';
import Wishlist from '../Pages/WishlistPage';
import SettingsPage from './AccountManagement/SettingsPage';
import InlineLoader from '../Components/common/InlineLoader';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); // Assuming logout is exposed
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
    const fetchUserProfile = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const result = await getUserProfile(currentUser.uid);
        if (result.success && result.data) {
          setUserData({
            ...result.data,
            email: result.data.email || currentUser.email
          });
        } else {
          setUserData(prev => ({ ...prev, email: currentUser.email }));
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setUserData(prev => ({ ...prev, email: currentUser.email || '' }));
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to logout?')) {
      return;
    }

    try {
      await logout();
      // Redirect to home page after successful logout
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
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
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-5 bg-gray-200 rounded-xl w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-xl w-full mb-6"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded-2xl"></div>
            <div className="h-12 bg-gray-200 rounded-2xl"></div>
            <div className="h-12 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-6">
      {/* User Info */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <div className="relative w-24 h-24 mb-4">
          <div className="w-full h-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 text-white flex items-center justify-center text-2xl font-black rounded-full shadow-lg overflow-hidden border-2 border-white">
            {userData.photoURL ? (
              <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              getInitials()
            )}
          </div>
          <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-400 border-4 border-white rounded-full"></div>
        </div>
        <h3 className="font-black text-gray-800 text-lg mb-1">{getDisplayName()}</h3>
        <p className="text-sm text-gray-500 break-all font-medium">{userData.email}</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-300 group ${isActive
                ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg shadow-pink-200'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <Icon size={20} strokeWidth={2.5} className={isActive ? '' : 'group-hover:scale-110 transition-transform'} />
              <span className="text-sm font-bold flex-1">{item.label}</span>
              {isActive && <ChevronRight size={18} strokeWidth={3} />}
            </Link>
          );
        })}

        {/* Logout Button */}
        <div className="pt-4 mt-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group font-bold text-sm"
          >
            <LogOut size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

// Main Dashboard Component
const UserProfileDashboard = () => {
  const navigate = useNavigate();
  const { loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <InlineLoader size="lg" text="Loading your profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-purple-50/30 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-2 tracking-tight">My Profile</h1>
          <p className="text-sm text-gray-500 font-medium">Manage your account and preferences</p>
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
              <Route path="account" element={<MyAccount />} />
              <Route path="orders" element={<MyOrders />} />
              <Route path="addresses" element={<AddressBook />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDashboard;