import React from 'react';
import Logo from '../../assets/Logo.png';

/**
 * Inline loading spinner with logo - for use within pages/components
 * @param {string} size - 'sm', 'md', or 'lg' (default: 'md')
 * @param {string} text - Optional loading text
 */
const InlineLoader = ({ size = 'md', text = 'Loading...' }) => {
    const sizes = {
        sm: {
            container: 'w-16 h-16',
            logo: 'w-10 h-10',
            text: 'text-sm'
        },
        md: {
            container: 'w-24 h-24',
            logo: 'w-16 h-16',
            text: 'text-base'
        },
        lg: {
            container: 'w-32 h-32',
            logo: 'w-20 h-20',
            text: 'text-lg'
        }
    };

    const currentSize = sizes[size] || sizes.md;

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Spinner with logo in the center */}
            <div className={`relative ${currentSize.container} flex items-center justify-center`}>
                {/* Spinning border */}
                <div className="absolute inset-0 border-4 border-pink-300 border-t-pink-500 rounded-full animate-spin"></div>

                {/* Center logo */}
                <img
                    src={Logo}
                    alt="Love Story by Anna"
                    className={`${currentSize.logo} object-contain`}
                />
            </div>

            {/* Loading text */}
            {text && <p className={`text-gray-600 font-medium ${currentSize.text}`}>{text}</p>}
        </div>
    );
};

export default InlineLoader;
