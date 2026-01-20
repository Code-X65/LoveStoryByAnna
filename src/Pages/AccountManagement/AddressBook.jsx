import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, Heart, Settings, LogOut, ChevronRight, Edit2, Trash2, Plus, Eye, Mail, Star, Phone } from 'lucide-react';
import { useToast } from '../../Context/ToastContext';
import { useAuth } from '../../Context/AuthContextCore';
import { getUserAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '../../firebase/addressServices';
import StateAndCitySelector from '../../Components/StateAndCitySelector';

const AddressBook = () => {
  const toast = useToast();
  const { currentUser } = useAuth();
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
    zipCode: '',
    phone: '',
    isDefault: false
  });

  // Removed NIGERIAN_STATES - now using StateAndCitySelector component

  // Fetch addresses on mount or when currentUser changes
  useEffect(() => {
    if (currentUser) {
      fetchAddresses();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchAddresses = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const userAddresses = await getUserAddresses(currentUser.uid);

      // Map database addresses to expected format
      const formattedAddresses = userAddresses.map(addr => ({
        id: addr.id,
        label: addr.label || 'Address',
        name: `${addr.firstName || ''} ${addr.lastName || ''}`.trim() || addr.name || 'Unknown',
        firstName: addr.firstName,
        lastName: addr.lastName,
        email: addr.email,
        address: addr.addressLine || addr.address,
        city: addr.city,
        state: addr.state,
        zipCode: addr.zipCode,
        phone: addr.phone,
        isDefault: addr.isDefault || false
      }));

      setAddresses(formattedAddresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddAddress = async () => {
    if (!formData.label || !formData.name || !formData.email || !formData.address || !formData.city || !formData.state || !formData.phone) {
      toast.warning('Please fill all required fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.warning('Please enter a valid email address');
      return;
    }

    if (!currentUser) {
      toast.warning('Please login to add an address');
      return;
    }

    try {
      const result = await addAddress(currentUser.uid, {
        label: formData.label,
        name: formData.name,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        phone: formData.phone,
        isDefault: formData.isDefault
      });

      if (result.success) {
        toast.success('Address added successfully!');
        setShowAddForm(false);
        setFormData({
          label: '',
          name: '',
          email: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          phone: '',
          isDefault: false
        });
        fetchAddresses();
      } else {
        toast.error('Failed to add address: ' + result.error);
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('An error occurred while adding the address');
    }
  };

  const handleUpdateAddress = async () => {
    if (!editingAddress || !currentUser) return;

    if (!validateEmail(formData.email)) {
      toast.warning('Please enter a valid email address');
      return;
    }

    try {
      const result = await updateAddress(currentUser.uid, editingAddress, {
        label: formData.label,
        name: formData.name,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        phone: formData.phone,
        isDefault: formData.isDefault
      });

      if (result.success) {
        toast.success('Address updated successfully!');
        setEditingAddress(null);
        setFormData({
          label: '',
          name: '',
          email: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          phone: '',
          isDefault: false
        });
        fetchAddresses();
      } else {
        toast.error('Failed to update address: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error('An error occurred while updating the address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    if (!currentUser) return;

    try {
      const result = await deleteAddress(currentUser.uid, addressId);

      if (result.success) {
        toast.success('Address deleted successfully!');
        fetchAddresses();
      } else {
        toast.error('Failed to delete address: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('An error occurred while deleting the address');
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    if (!currentUser) return;
    try {
      await setDefaultAddress(currentUser.uid, addressId);
      fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
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
      zipCode: address.zipCode || '',
      phone: address.phone,
      isDefault: address.isDefault
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[400px] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-pink-400 mx-auto"></div>
        <p className="text-gray-400 font-bold mt-4 animate-pulse">Loading addresses...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Address Book</h2>
          <p className="text-gray-500 text-sm mt-1">Manage delivery locations</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm ${showAddForm
            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            : 'bg-pink-400 text-white hover:bg-pink-500 hover:scale-105'
            }`}
        >
          {showAddForm ? 'Cancel' : (
            <>
              <Plus size={18} strokeWidth={2.5} />
              Add New Address
            </>
          )}
        </button>
      </div>

      {(showAddForm || editingAddress) && (
        <div className="mb-8 p-6 md:p-8 bg-gray-50/50 rounded-3xl border border-gray-100 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center">
              <MapPin size={16} strokeWidth={2.5} />
            </div>
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h3>

          <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Label (e.g. Home)</label>
              <input
                type="text"
                placeholder="Home, Office..."
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full px-5 py-3 rounded-2xl bg-white border-2 border-transparent focus:border-pink-200 focus:ring-4 focus:ring-pink-50 transition-all outline-none font-medium text-gray-700 placeholder-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-3 rounded-2xl bg-white border-2 border-transparent focus:border-pink-200 focus:ring-4 focus:ring-pink-50 transition-all outline-none font-medium text-gray-700 placeholder-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-3 rounded-2xl bg-white border-2 border-transparent focus:border-pink-200 focus:ring-4 focus:ring-pink-50 transition-all outline-none font-medium text-gray-700 placeholder-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+234..."
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-5 py-3 rounded-2xl bg-white border-2 border-transparent focus:border-pink-200 focus:ring-4 focus:ring-pink-50 transition-all outline-none font-medium text-gray-700 placeholder-gray-300"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Street Address</label>
              <input
                type="text"
                placeholder="123 Love Story Lane..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-5 py-3 rounded-2xl bg-white border-2 border-transparent focus:border-pink-200 focus:ring-4 focus:ring-pink-50 transition-all outline-none font-medium text-gray-700 placeholder-gray-300"
              />
            </div>
            {/* State and City Selector */}
            <div className="md:col-span-2">
              <StateAndCitySelector
                selectedState={formData.state}
                selectedCity={formData.city}
                onStateChange={(value) => setFormData({ ...formData, state: value })}
                onCityChange={(value) => setFormData({ ...formData, city: value })}
                required={true}
              />
            </div>

            {/* Zip Code */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Zip/Postal Code</label>
              <input
                type="text"
                placeholder="100001"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                className="w-full px-5 py-3 rounded-2xl bg-white border-2 border-transparent focus:border-pink-200 focus:ring-4 focus:ring-pink-50 transition-all outline-none font-medium text-gray-700 placeholder-gray-300"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 cursor-pointer hover:border-pink-200 transition-colors" onClick={() => setFormData({ ...formData, isDefault: !formData.isDefault })}>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.isDefault ? 'border-pink-500 bg-pink-500' : 'border-gray-300'}`}>
              {formData.isDefault && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
            </div>
            <label className="text-sm font-bold text-gray-700 cursor-pointer select-none">
              Set as default address
            </label>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
              className="px-8 py-3 bg-pink-400 text-white font-bold rounded-full shadow-lg shadow-pink-200 hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex-1 md:flex-none"
            >
              {editingAddress ? 'Update Request' : 'Save Address'}
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
                  zipCode: '',
                  phone: '',
                  isDefault: false
                });
              }}
              className="px-8 py-3 bg-white border-2 border-gray-100 text-gray-600 font-bold rounded-full hover:bg-gray-50 flex-1 md:flex-none"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <MapPin size={32} className="text-gray-300" />
          </div>
          <p className="text-gray-900 font-bold text-lg">No addresses saved yet</p>
          <p className="text-gray-500 text-sm mt-1 max-w-xs">Add your first delivery address to make checkout faster!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className={`group relative p-6 rounded-3xl border-2 transition-all duration-300 ${address.isDefault ? 'border-pink-200 bg-pink-50/10' : 'border-gray-100 bg-white hover:border-pink-100 hover:shadow-lg hover:shadow-pink-50/50'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                    {address.label}
                    {address.isDefault && (
                      <span className="px-2.5 py-0.5 bg-pink-500 text-white text-[10px] uppercase tracking-widest font-bold rounded-full">
                        Default
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 font-bold mt-1">{address.name}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-pink-100 group-hover:text-pink-500 transition-colors">
                  <MapPin size={20} />
                </div>
              </div>

              <div className="space-y-3 mb-6 bg-gray-50/50 p-4 rounded-2xl">
                <p className="text-sm text-gray-700 font-medium leading-relaxed">
                  {address.address}, {address.city}, {address.state} {address.zipCode}
                </p>

                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Mail size={14} className="text-pink-300" />
                    <span className="truncate">{address.email || 'No email provided'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Phone size={14} className="text-pink-300" />
                    <span>{address.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(address)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wider hover:bg-white hover:shadow-md transition-all"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-500 text-xs font-bold uppercase tracking-wider hover:bg-white hover:shadow-md hover:shadow-red-100 transition-all"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefaultAddress(address.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border-2 border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider hover:border-pink-200 hover:text-pink-500 transition-all"
                  >
                    <Star size={14} />
                    Set Default
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
