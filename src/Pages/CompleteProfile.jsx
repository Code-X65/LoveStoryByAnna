import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContextCore';
import { useToast } from '../Context/ToastContext';
import { updateUserProfile } from '../firebase/userProfileServices';
import { User, Phone, Calendar, Heart, ArrowRight } from 'lucide-react';

const CompleteProfile = () => {
    const { currentUser, userProfile, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        phone: '',
        dateOfBirth: '',
        gender: ''
    });

    useEffect(() => {
        if (userProfile && userProfile.isComplete) {
            navigate('/profile');
        }
    }, [userProfile, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.gender || !formData.dateOfBirth || !formData.phone) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const result = await updateUserProfile(currentUser.uid, formData);
            if (result.success) {
                await refreshProfile();
                toast.success('Profile completed successfully!');
                navigate('/profile');
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-800">Complete Your Profile</h2>
                        <p className="text-gray-500 mt-2">Just a few more details to get you started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                                Who are you shopping for?
                            </label>
                            <div className="relative">
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-pink-200 focus:ring-4 focus:ring-pink-50 text-gray-800 font-medium transition-all outline-none appearance-none"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Female">Female</option>
                                    <option value="Male">Male</option>
                                    <option value="Other">Other</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <Heart size={18} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                                Date of Birth
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-pink-200 focus:ring-4 focus:ring-pink-50 text-gray-800 font-medium transition-all outline-none"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <Calendar size={18} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                                Phone Number
                            </label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+234..."
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-pink-200 focus:ring-4 focus:ring-pink-50 text-gray-800 font-medium transition-all outline-none"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <Phone size={18} />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-pink-100 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Finish Setup'}
                            {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompleteProfile;
