import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '../../Context/AuthContextCore';
import { useToast } from '../../Context/ToastContext';
import { updatePassword, getErrorMessage } from '../../firebase/auth';

const SettingsPage = () => {
  const { currentUser, logout } = useAuth();
  const toast = useToast();
  const [isEmailPasswordUser, setIsEmailPasswordUser] = useState(true);
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
    if (currentUser) {
      // Check if user has email/password provider
      const hasPassword = currentUser.app_metadata?.provider === 'email';
      setIsEmailPasswordUser(hasPassword);
    }
  }, [currentUser]);

  const handlePasswordChange = async () => {
    // Validation
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      toast.warning('Please fill all password fields');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.warning('New password must be at least 6 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.warning('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const result = await updatePassword(passwordData.newPassword);

      if (result.success) {
        toast.success('Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error('Failed to update password: ' + getErrorMessage(result.code));
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getProviderName = () => {
    if (!currentUser) return 'Email';
    const provider = currentUser.app_metadata?.provider;
    return provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : 'Email';
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        toast.info('Account deletion feature will be implemented soon');
        // Future: Implement actual account deletion via Firebase
        // await logout();
      } catch (error) {
        toast.error('Failed to delete account. Please contact support.');
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">Account Settings</h2>
        <p className="text-gray-500 text-sm mt-1">Manage security and preferences</p>
      </div>

      <div className="space-y-10">
        {/* Change Password - Only for Email/Password Users */}
        <section className="animate-in fade-in slide-in-from-bottom-2 delay-100">
          {isEmailPasswordUser ? (
            <div className="bg-gray-50/50 rounded-3xl p-6 md:p-8 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
                  <Settings size={16} strokeWidth={2.5} />
                </div>
                Change Password
              </h3>

              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-5 py-3 rounded-2xl bg-white border-2 border-transparent focus:border-pink-200 focus:ring-4 focus:ring-pink-50 transition-all outline-none font-medium text-gray-700"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-5 py-3 rounded-2xl bg-white border-2 border-transparent focus:border-pink-200 focus:ring-4 focus:ring-pink-50 transition-all outline-none font-medium text-gray-700"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 ml-1 font-medium">Minimum 6 characters</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-5 py-3 rounded-2xl bg-white border-2 border-transparent focus:border-pink-200 focus:ring-4 focus:ring-pink-50 transition-all outline-none font-medium text-gray-700"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handlePasswordChange}
                    disabled={loading}
                    className="px-8 py-3 bg-pink-400 text-white font-bold rounded-full shadow-lg shadow-pink-200 hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {loading ? 'Updating Password...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-3xl">
              <h3 className="font-bold text-gray-800 mb-2 text-lg">Account Authentication</h3>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    You signed in with <span className="font-bold text-gray-800">{getProviderName()}</span>.
                    Password changes are managed through your social login provider.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Notifications */}
        <section className="animate-in fade-in slide-in-from-bottom-2 delay-200">
          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Email Notifications</h3>
          <div className="space-y-4">
            {[
              "Order updates and confirmations",
              "Promotions and special offers",
              "New arrivals and products",
              "Account security updates"
            ].map((label, index) => (
              <label key={index} className="flex items-center gap-4 cursor-pointer group p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="relative flex items-center">
                  <input type="checkbox" defaultChecked className="peer w-5 h-5 rounded-md border-2 border-gray-300 text-pink-500 focus:ring-pink-500 focus:ring-offset-0 transition-all checked:border-pink-500 checked:bg-pink-500" />
                </div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Privacy Settings */}
        <section className="animate-in fade-in slide-in-from-bottom-2 delay-300">
          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Privacy Settings</h3>
          <div className="space-y-4">
            {[
              "Allow personalized recommendations",
              "Share data with analytics partners",
              "Make profile public"
            ].map((label, index) => (
              <label key={index} className="flex items-center gap-4 cursor-pointer group p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="relative flex items-center">
                  <input type="checkbox" defaultChecked={index < 2} className="peer w-5 h-5 rounded-md border-2 border-gray-300 text-pink-500 focus:ring-pink-500 focus:ring-offset-0 transition-all checked:border-pink-500 checked:bg-pink-500" />
                </div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Delete Account */}
        <section className="animate-in fade-in slide-in-from-bottom-2 delay-500">
          <div className="bg-red-50/50 border border-red-100 rounded-3xl p-6 md:p-8">
            <h3 className="font-black text-red-500 mb-2 text-lg flex items-center gap-2">
              <span className="p-1.5 bg-red-100 rounded-lg">
                <LogOut size={16} strokeWidth={3} />
              </span>
              Danger Zone
            </h3>
            <p className="text-sm text-gray-600 mb-6 font-medium">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="px-6 py-2.5 bg-white border-2 border-red-100 text-red-500 font-bold rounded-full hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-200 transition-all text-sm"
            >
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;