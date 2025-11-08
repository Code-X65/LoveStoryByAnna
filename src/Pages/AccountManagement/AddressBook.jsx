import React, { useState } from 'react';
import { User, Package, MapPin, Heart, Settings, LogOut, ChevronRight, Edit2, Trash2, Plus, Eye } from 'lucide-react';

const AddressBook = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: 'Home',
      name: 'Chioma Okonkwo',
      address: '23 Mission Road, GRA',
      city: 'Benin City',
      state: 'Edo State',
      phone: '+234 803 456 7890',
      isDefault: true
    },
    {
      id: 2,
      label: 'Office',
      name: 'Chioma Okonkwo',
      address: '15 Akpakpava Street',
      city: 'Benin City',
      state: 'Edo State',
      phone: '+234 803 456 7890',
      isDefault: false
    }
  ]);

  const removeAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const setDefaultAddress = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  return (
    <div className="bg-white border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Address Book</h2>
        <button className="flex items-center gap-2 bg-pink-300 text-white px-4 py-2 text-sm font-medium hover:bg-pink-400 transition-colors">
          <Plus size={16} />
          Add New
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div key={address.id} className="border border-gray-200 p-4 relative">
            {address.isDefault && (
              <span className="absolute top-4 right-4 px-2 py-1 bg-pink-300 text-white text-xs font-medium">
                Default
              </span>
            )}
            
            <h3 className="font-semibold text-gray-900 mb-1">{address.label}</h3>
            <p className="text-sm text-gray-900 font-medium mb-2">{address.name}</p>
            <p className="text-sm text-gray-600 mb-1">{address.address}</p>
            <p className="text-sm text-gray-600 mb-1">{address.city}, {address.state}</p>
            <p className="text-sm text-gray-600 mb-4">{address.phone}</p>
            
            <div className="flex gap-3">
              <button className="text-sm text-pink-300 hover:text-pink-400 font-medium">
                Edit
              </button>
              <button
                onClick={() => removeAddress(address.id)}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Delete
              </button>
              {!address.isDefault && (
                <button
                  onClick={() => setDefaultAddress(address.id)}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Set as Default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressBook