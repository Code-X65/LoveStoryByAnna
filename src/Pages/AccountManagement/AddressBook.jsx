import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, Heart, Settings, LogOut, ChevronRight, Edit2, Trash2, Plus, Eye, Mail } from 'lucide-react';
import { auth } from '../../Firebase/Firebase';
import { 
  getUserAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress 
} from '../../Firebase/addressServices';

const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    isDefault: false
  });

  // Fetch addresses on mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const user = auth.currentUser;
    if (user) {
      const data = await getUserAddresses(user.uid);
      setAddresses(data);
    }
    setLoading(false);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddAddress = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('Please login to add address');
      return;
    }

    if (!formData.label || !formData.name || !formData.email || !formData.address || !formData.city || !formData.state || !formData.phone) {
      alert('Please fill all fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    const result = await addAddress(user.uid, formData);
    
    if (result.success) {
      alert('Address added successfully!');
      setShowAddForm(false);
      setFormData({
        label: '',
        name: '',
        email: '',
        address: '',
        city: '',
        state: '',
        phone: '',
        isDefault: false
      });
      fetchAddresses();
    } else {
      alert('Failed to add address: ' + result.error);
    }
  };

  const handleUpdateAddress = async () => {
    const user = auth.currentUser;
    if (!user || !editingAddress) return;

    if (!validateEmail(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    const result = await updateAddress(user.uid, editingAddress, formData);
    
    if (result.success) {
      alert('Address updated successfully!');
      setEditingAddress(null);
      setFormData({
        label: '',
        name: '',
        email: '',
        address: '',
        city: '',
        state: '',
        phone: '',
        isDefault: false
      });
      fetchAddresses();
    } else {
      alert('Failed to update address: ' + result.error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    const user = auth.currentUser;
    if (!user) return;

    const result = await deleteAddress(user.uid, addressId);
    
    if (result.success) {
      alert('Address deleted successfully!');
      fetchAddresses();
    } else {
      alert('Failed to delete address: ' + result.error);
    }
  };

  const handleSetDefault = async (addressId) => {
    const user = auth.currentUser;
    if (!user) return;

    const result = await setDefaultAddress(user.uid, addressId);
    
    if (result.success) {
      fetchAddresses();
    } else {
      alert('Failed to set default address: ' + result.error);
    }
  };

  const startEdit = (address) => {
    setEditingAddress(address.id);
    setFormData({
      label: address.label,
      name: address.name,
      email: address.email || '',
      address: address.address,
      city: address.city,
      state: address.state,
      phone: address.phone,
      isDefault: address.isDefault
    });
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-300 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Address Book</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-pink-300 text-white px-4 py-2 text-sm font-medium hover:bg-pink-400 transition-colors"
        >
          <Plus size={16} />
          Add New
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingAddress) && (
        <div className="mb-6 border border-gray-200 p-4 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-4">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Label (e.g., Home, Office) *"
              value={formData.label}
              onChange={(e) => setFormData({...formData, label: e.target.value})}
              className="px-4 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
            />
            <input
              type="text"
              placeholder="Full Name *"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="px-4 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
            />
            <input
              type="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="px-4 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
            />
            <input
              type="tel"
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="px-4 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
            />
            <input
              type="text"
              placeholder="Street Address *"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="px-4 py-2 border border-gray-300 focus:outline-none focus:border-pink-300 md:col-span-2"
            />
            <input
              type="text"
              placeholder="City *"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className="px-4 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
            />
            <input
              type="text"
              placeholder="State *"
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              className="px-4 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
            />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
              className="w-4 h-4 text-pink-300 focus:ring-pink-300"
            />
            <label htmlFor="isDefault" className="text-sm text-gray-700">
              Set as default address
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
              className="px-6 py-2 bg-pink-300 text-white font-medium hover:bg-pink-400 transition-colors"
            >
              {editingAddress ? 'Update' : 'Save'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingAddress(null);
                setFormData({
                  label: '',
                  name: '',
                  email: '',
                  address: '',
                  city: '',
                  state: '',
                  phone: '',
                  isDefault: false
                });
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No addresses saved yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address.id} className="border border-gray-200 p-4 relative hover:border-pink-300 transition-colors">
              {address.isDefault && (
                <span className="absolute top-4 right-4 px-2 py-1 bg-pink-300 text-white text-xs font-medium rounded">
                  Default
                </span>
              )}
              
              <h3 className="font-semibold text-gray-900 mb-1 text-lg">{address.label}</h3>
              <p className="text-sm text-gray-900 font-medium mb-3">{address.name}</p>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">{address.address}</p>
                <p className="text-sm text-gray-600">{address.city}, {address.state}</p>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t border-gray-200">
                  <Mail size={14} className="text-pink-300" />
                  <span>{address.email || 'No email provided'}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-3.5 h-3.5 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{address.phone}</span>
                </div>
              </div>
              
              <div className="flex gap-3 pt-3 border-t border-gray-200">
                <button 
                  onClick={() => startEdit(address)}
                  className="text-sm text-pink-300 hover:text-pink-400 font-medium flex items-center gap-1"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-sm text-gray-600 hover:text-gray-900 font-medium ml-auto"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressBook;