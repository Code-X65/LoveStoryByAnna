import React, { useState, useEffect, useRef } from 'react';
import { Upload, Camera, User, Package, MapPin, Heart, Settings, LogOut, ChevronRight, Edit2, Trash2, Plus, Eye } from 'lucide-react';
import { useAuth } from '../../Context/AuthContextCore';
import { useToast } from '../../Context/ToastContext';
import { getUserProfile, updateUserProfile } from '../../firebase/userProfileServices';
import { uploadFile } from '../../firebase/storageServices';

const MyAccount = () => {
  const { currentUser, refreshProfile } = useAuth();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    photoURL: ''
  });

  useEffect(() => {
    if (currentUser) {
      loadProfile();
    }
  }, [currentUser]);

  const loadProfile = async () => {
    setLoading(true);
    const result = await getUserProfile(currentUser.uid);
    if (result.success && result.data) {
      setUserData({
        ...result.data,
        // Fallback to auth email if not in profile
        email: result.data.email || currentUser.email
      });
    } else {
      // Init with auth data
      setUserData(prev => ({
        ...prev,
        email: currentUser.email
      }));
    }
    setLoading(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;

    try {
      setLoading(true);
      const path = `users/${currentUser.uid}/profile_${Date.now()}`;
      const url = await uploadFile(file, path);

      const updatedData = { ...userData, photoURL: url };
      const result = await updateUserProfile(currentUser.uid, updatedData);

      if (result.success) {
        setUserData(updatedData);
        await refreshProfile();
        toast.success('Profile picture updated!');
      }
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!currentUser) return;
    setLoading(true);

    const result = await updateUserProfile(currentUser.uid, userData);

    if (result.success) {
      await refreshProfile();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } else {
      toast.error('Failed to update profile: ' + result.error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[400px] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-pink-400 mx-auto"></div>
        <p className="text-gray-400 font-medium mt-4 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 relative overflow-hidden">
      {/* Decorative Background Blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>

      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Personal Information</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your personal details</p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${isEditing
            ? 'bg-red-50 text-red-500 hover:bg-red-100'
            : 'bg-pink-50 text-pink-500 hover:bg-pink-100 hover:scale-105 shadow-sm'
            }`}
        >
          {isEditing ? (
            <>Cancel Editing</>
          ) : (
            <>
              <Edit2 size={16} strokeWidth={2.5} />
              Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col items-center mb-10 relative z-10">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-50 flex items-center justify-center relative">
            {userData.photoURL ? (
              <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white text-4xl font-black">
                {userData.firstName ? userData.firstName[0] : 'U'}
              </div>
            )}

            {isEditing && (
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={24} />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            )}
          </div>
        </div>
        <p className="text-xs font-bold text-gray-400 mt-4 uppercase tracking-[0.2em]">Profile Photo</p>
      </div>

      <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">First Name</label>
          <input
            type="text"
            value={userData.firstName}
            disabled={!isEditing}
            onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-pink-200 focus:ring-4 focus:ring-pink-50 text-gray-800 font-medium transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed"
            placeholder="Enter first name"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Last Name</label>
          <input
            type="text"
            value={userData.lastName}
            disabled={!isEditing}
            onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-pink-200 focus:ring-4 focus:ring-pink-50 text-gray-800 font-medium transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed"
            placeholder="Enter last name"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              value={userData.email}
              disabled={true} // Email usually shouldn't be editable directly
              className="w-full px-5 py-3 rounded-2xl bg-gray-100/50 border-2 border-transparent text-gray-500 font-medium cursor-not-allowed"
            />
            {!isEditing && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">Verified</span>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Phone Number</label>
          <input
            type="tel"
            value={userData.phone}
            disabled={!isEditing}
            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-pink-200 focus:ring-4 focus:ring-pink-50 text-gray-800 font-medium transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed"
            placeholder="+234..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Date of Birth</label>
          <input
            type="date"
            value={userData.dateOfBirth}
            disabled={!isEditing}
            onChange={(e) => setUserData({ ...userData, dateOfBirth: e.target.value })}
            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-pink-200 focus:ring-4 focus:ring-pink-50 text-gray-800 font-medium transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Who are you shopping for?</label>
          <div className="relative">
            <select
              value={userData.gender}
              disabled={!isEditing}
              onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
              className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-pink-200 focus:ring-4 focus:ring-pink-50 text-gray-800 font-medium transition-all outline-none appearance-none disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronRight size={18} className="rotate-90" />
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-8 flex gap-4 animate-in fade-in slide-in-from-bottom-4 relative z-10">
          <button
            onClick={handleSaveChanges}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold rounded-full shadow-lg shadow-pink-200 hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            disabled={loading}
            className="px-8 py-3 bg-white border-2 border-gray-100 text-gray-600 font-bold rounded-full hover:bg-gray-50 hover:border-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default MyAccount;