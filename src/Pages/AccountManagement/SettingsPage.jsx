import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { auth } from '../../Firebase/Firebase';
import { 
  updatePassword, 
  EmailAuthProvider, 
  reauthenticateWithCredential 
} from 'firebase/auth';

const SettingsPage = () => {
  const [isEmailPasswordUser, setIsEmailPasswordUser] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user signed in with email/password
    const user = auth.currentUser;
    if (user) {
      // Check provider data
      const hasPasswordProvider = user.providerData.some(
        provider => provider.providerId === 'password'
      );
      setIsEmailPasswordUser(hasPasswordProvider);
    }
  }, []);

  const handlePasswordChange = async () => {
    const user = auth.currentUser;
    
    if (!user) {
      alert('Please login to change password');
      return;
    }

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill all password fields');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      alert('New password must be different from current password');
      return;
    }

    setLoading(true);

    try {
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );
      
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, passwordData.newPassword);
      
      alert('Password updated successfully!');
      
      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        alert('Current password is incorrect');
      } else if (error.code === 'auth/requires-recent-login') {
        alert('Please logout and login again before changing password');
      } else {
        alert('Failed to update password: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getProviderName = () => {
    const user = auth.currentUser;
    if (!user) return '';
    
    const providers = user.providerData.map(provider => {
      if (provider.providerId === 'google.com') return 'Google';
      if (provider.providerId === 'facebook.com') return 'Facebook';
      return '';
    }).filter(Boolean);
    
    return providers.join(', ');
  };

  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>
      
      <div className="space-y-6">
        {/* Change Password - Only for Email/Password Users */}
        {isEmailPasswordUser ? (
          <div className="pb-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Change Password</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <button 
                onClick={handlePasswordChange}
                disabled={loading}
                className="bg-pink-300 text-white px-6 py-2 font-medium hover:bg-pink-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        ) : (
          <div className="pb-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Account Authentication</h3>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded">
              <p className="text-sm text-blue-800">
                You signed in with <span className="font-semibold">{getProviderName()}</span>. 
                Password changes are not available for social login accounts.
              </p>
            </div>
          </div>
        )}

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

export default SettingsPage;