import React, { useState } from 'react';
import { User, Package, MapPin, Heart, Settings, LogOut, ChevronRight, Edit2, Trash2, Plus, Eye } from 'lucide-react';

// Account Component
const MyAccount = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: 'Chioma',
    lastName: 'Okonkwo',
    email: 'chioma.okonkwo@email.com',
    phone: '+234 803 456 7890',
    dateOfBirth: '1990-05-15',
    gender: 'Female'
  });

  return (
    <div className="bg-white border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 text-pink-300 hover:text-pink-400 text-sm font-medium"
        >
          <Edit2 size={16} />
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={userData.firstName}
            disabled={!isEditing}
            onChange={(e) => setUserData({...userData, firstName: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-pink-300 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={userData.lastName}
            disabled={!isEditing}
            onChange={(e) => setUserData({...userData, lastName: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-pink-300 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={userData.email}
            disabled={!isEditing}
            onChange={(e) => setUserData({...userData, email: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-pink-300 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={userData.phone}
            disabled={!isEditing}
            onChange={(e) => setUserData({...userData, phone: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-pink-300 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            value={userData.dateOfBirth}
            disabled={!isEditing}
            onChange={(e) => setUserData({...userData, dateOfBirth: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-pink-300 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            value={userData.gender}
            disabled={!isEditing}
            onChange={(e) => setUserData({...userData, gender: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-pink-300 disabled:bg-gray-50 disabled:text-gray-600"
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {isEditing && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-2 bg-pink-300 text-white font-medium hover:bg-pink-400 transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default MyAccount