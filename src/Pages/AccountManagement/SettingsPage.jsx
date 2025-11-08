import React, { useState } from 'react';
import { User, Package, MapPin, Heart, Settings, LogOut, ChevronRight, Edit2, Trash2, Plus, Eye } from 'lucide-react';
// Settings Component
const SettingsPage = () => {
  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>
      
      <div className="space-y-6">
        {/* Change Password */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Change Password</h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
              />
            </div>
            <button className="bg-pink-300 text-white px-6 py-2 font-medium hover:bg-pink-400 transition-colors">
              Update Password
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Email Notifications</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-pink-300" />
              <span className="text-sm text-gray-700">Order updates and confirmations</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-pink-300" />
              <span className="text-sm text-gray-700">Promotions and special offers</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-pink-300" />
              <span className="text-sm text-gray-700">New arrivals and products</span>
            </label>
          </div>
        </div>

        {/* Delete Account */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Delete Account</h3>
          <p className="text-sm text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="border border-red-600 text-red-600 px-6 py-2 font-medium hover:bg-red-50 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage