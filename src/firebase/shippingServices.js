/**
 * Shipping regions and their costs in Naira
 */
export const SHIPPING_RATES = {
    'lagos': 2500,
    'south_west': 4000, // Ogun, Oyo, Osun, Ondo, Ekiti
    'other': 5500,
};

/**
 * List of South-West states for calculation
 */
const SOUTH_WEST_STATES = ['ogun', 'oyo', 'osun', 'ondo', 'ekiti'];

/**
 * Calculate shipping cost based on state/region
 * @param {string} state - The delivery state
 * @returns {number} - Shipping cost
 */
export const calculateShippingCost = (state) => {
    if (!state) return SHIPPING_RATES.other;

    const normalizedState = state.toLowerCase().trim();

    if (normalizedState === 'lagos') {
        return SHIPPING_RATES.lagos;
    }

    if (SOUTH_WEST_STATES.includes(normalizedState)) {
        return SHIPPING_RATES.south_west;
    }

    return SHIPPING_RATES.other;
};

/**
 * Get display name for a region code
 */
export const getRegionLabel = (state) => {
    const cost = calculateShippingCost(state);
    if (cost === SHIPPING_RATES.lagos) return 'Lagos Delivery';
    if (cost === SHIPPING_RATES.south_west) return 'South-West Regional';
    return 'Other Regions / Nationwide';
};
