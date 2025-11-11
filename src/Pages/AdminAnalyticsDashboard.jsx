import React, { useState, useEffect } from 'react';
import { Users, Eye, ShoppingCart, Package, TrendingUp, DollarSign } from 'lucide-react';
import { getDashboardSummary, getAllUsersAnalytics, getTopProducts } from '../Firebase/analyticsServices';

const AdminAnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [userAnalytics, setUserAnalytics] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('viewCount');

  useEffect(() => {
    fetchAnalytics();
  }, [selectedMetric]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [summaryResult, usersResult, productsResult] = await Promise.all([
        getDashboardSummary(),
        getAllUsersAnalytics(),
        getTopProducts(selectedMetric, 10)
      ]);

      if (summaryResult.success) {
        setSummary(summaryResult.data);
      }

      if (usersResult.success) {
        setUserAnalytics(usersResult.data);
      }

      if (productsResult.success) {
        setTopProducts(productsResult.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-300 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: summary?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Page Views',
      value: summary?.totalPageViews || 0,
      icon: Eye,
      color: 'bg-purple-500',
      change: '+8%'
    },
    {
      title: 'Product Views',
      value: summary?.totalProductViews || 0,
      icon: ShoppingCart,
      color: 'bg-green-500',
      change: '+15%'
    },
    {
      title: 'Total Orders',
      value: summary?.totalOrders || 0,
      icon: Package,
      color: 'bg-orange-500',
      change: '+23%'
    },
    {
      title: 'Conversion Rate',
      value: `${summary?.conversionRate || 0}%`,
      icon: TrendingUp,
      color: 'bg-pink-500',
      change: '+5%'
    },
    {
      title: 'Total Revenue',
      value: `₦${(summary?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-red-500',
      change: '+18%'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track user behavior and product performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Top Users by Spend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Users by Spend</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Page Views</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Orders</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {summary?.topUsers.slice(0, 5).map((user, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900 font-mono">
                        {user.userId.substring(0, 8)}...
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {user.totalPageViews || 0}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {user.totalOrders || 0}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-green-600">
                        ₦{(user.totalSpent || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Top Products</h2>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-pink-300"
              >
                <option value="viewCount">By Views</option>
                <option value="addToCartCount">By Add to Cart</option>
                <option value="purchaseCount">By Purchases</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Views</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Conversions</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.slice(0, 5).map((product, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {product.productName || 'Unknown'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {product.viewCount || 0}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {product.purchaseCount || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* All Users Analytics Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Users Analytics</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Page Views</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product Views</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Add to Cart</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Orders</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {userAnalytics.map((user, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900 font-mono">
                      {user.userId.substring(0, 12)}...
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {user.totalPageViews || 0}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {user.totalProductViews || 0}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {user.totalAddToCart || 0}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {user.totalOrders || 0}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-green-600">
                      ₦{(user.totalSpent || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsDashboard;