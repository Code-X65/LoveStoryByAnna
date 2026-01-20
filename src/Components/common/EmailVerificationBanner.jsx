import React, { useState, useEffect } from 'react';
import { Mail, X, RefreshCw } from 'lucide-react';
import { verifyEmail, resendVerificationEmail } from '../../firebase/auth';
import { useAuth } from '../../Context/AuthContextCore';

const EmailVerificationBanner = () => {
    const { currentUser } = useAuth();
    const [isVerified, setIsVerified] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    useEffect(() => {
        const checkVerification = async () => {
            if (!currentUser) {
                setIsVisible(false);
                return;
            }

            const result = await verifyEmail();
            if (result.success && !result.verified) {
                setIsVerified(false);
                setIsVisible(true);
            } else {
                setIsVerified(true);
                setIsVisible(false);
            }
        };

        checkVerification();
    }, [currentUser]);

    const handleResendEmail = async () => {
        if (!currentUser?.email) return;

        setLoading(true);
        setMessage('');

        try {
            const result = await resendVerificationEmail(currentUser.email);
            if (result.success) {
                setMessageType('success');
                setMessage('Verification email sent! Please check your inbox.');
            } else {
                setMessageType('error');
                setMessage('Failed to send email. Please try again later.');
            }
        } catch (error) {
            setMessageType('error');
            setMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
            // Clear message after 5 seconds
            setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 5000);
        }
    };

    const handleDismiss = () => {
        setIsVisible(false);
        // Store dismissal in localStorage to not show again for this session
        localStorage.setItem('emailVerificationBannerDismissed', 'true');
    };

    // Don't show if dismissed in this session
    useEffect(() => {
        const dismissed = localStorage.getItem('emailVerificationBannerDismissed');
        if (dismissed === 'true') {
            setIsVisible(false);
        }
    }, []);

    if (!isVisible || isVerified) return null;

    return (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Mail className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800">
                                Please verify your email address
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">
                                Check your inbox for a verification link or{' '}
                                <button
                                    onClick={handleResendEmail}
                                    disabled={loading}
                                    className="text-amber-600 hover:text-amber-700 font-semibold underline disabled:opacity-50"
                                >
                                    {loading ? 'Sending...' : 'resend email'}
                                </button>
                            </p>
                            {message && (
                                <p className={`text-xs mt-1 font-medium ${messageType === 'success' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {message}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="p-1.5 hover:bg-amber-100 rounded-full transition-colors flex-shrink-0"
                        aria-label="Dismiss"
                    >
                        <X className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailVerificationBanner;
