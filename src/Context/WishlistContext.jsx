import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContextCore';
import {
    getUserWishlist,
    addToWishlist as addToWishlistService,
    removeFromWishlist as removeFromWishlistService,
    isInWishlist as checkIsInWishlist
} from '../firebase/wishlistServices';

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const { currentUser, loading: authLoading } = useAuth();

    useEffect(() => {
        if (authLoading) return;

        const loadWishlist = async () => {
            if (currentUser) {
                setLoading(true);
                try {
                    const items = await getUserWishlist(currentUser.uid);
                    setWishlistItems(items || []);
                    const ids = new Set((items || []).map(item => item.productId));
                    setWishlistIds(ids);
                } catch (error) {
                    console.error('Error loading wishlist:', error);
                    setWishlistItems([]);
                    setWishlistIds(new Set());
                } finally {
                    setLoading(false);
                }
            } else {
                setWishlistItems([]);
                setWishlistIds(new Set());
                setLoading(false);
            }
        };

        loadWishlist();
    }, [currentUser, authLoading]);

    const addToWishlist = useCallback(async (product) => {
        if (!currentUser) {
            return { success: false, error: 'Please login to add items to wishlist' };
        }

        try {
            const result = await addToWishlistService(currentUser.uid, product);

            if (result.success) {
                const items = await getUserWishlist(currentUser.uid);
                setWishlistItems(items);
                const ids = new Set(items.map(item => item.productId));
                setWishlistIds(ids);
            }

            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }, [currentUser]);

    const removeFromWishlist = useCallback(async (wishlistItemId) => {
        if (!currentUser) {
            return { success: false, error: 'Please login to manage wishlist' };
        }

        try {
            const result = await removeFromWishlistService(currentUser.uid, wishlistItemId);

            if (result.success) {
                setWishlistItems(prev => prev.filter(item => item.wishlistItemId !== wishlistItemId));
                const removed = wishlistItems.find(item => item.wishlistItemId === wishlistItemId);
                if (removed) {
                    setWishlistIds(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(removed.productId);
                        return newSet;
                    });
                }
            }

            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }, [currentUser, wishlistItems]);

    const isInWishlist = useCallback((productId) => {
        return wishlistIds.has(productId);
    }, [wishlistIds]);

    const getWishlistItemId = useCallback((productId) => {
        const item = wishlistItems.find(i => i.productId === productId);
        return item?.wishlistItemId || null;
    }, [wishlistItems]);

    const toggleWishlist = useCallback(async (product) => {
        if (!currentUser) {
            return { success: false, error: 'Please login to manage wishlist' };
        }

        const productId = product.id || product.productId;

        if (isInWishlist(productId)) {
            const wishlistItemId = getWishlistItemId(productId);
            if (wishlistItemId) {
                return await removeFromWishlist(wishlistItemId);
            }
            return { success: false, error: 'Item not found in wishlist' };
        } else {
            return await addToWishlist({ id: productId, ...product });
        }
    }, [currentUser, isInWishlist, getWishlistItemId, addToWishlist, removeFromWishlist]);

    const wishlistCount = wishlistItems.length;

    const value = {
        wishlistItems,
        loading,
        wishlistCount,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getWishlistItemId,
        toggleWishlist
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};

export default WishlistContext;

