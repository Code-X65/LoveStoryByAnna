import React, { useState, useEffect } from 'react';
import { nigerianStates, getCitiesByState } from '../data/nigerianStates';

const StateAndCitySelector = ({
    selectedState,
    selectedCity,
    onStateChange,
    onCityChange,
    stateLabel = "State",
    cityLabel = "City",
    required = true,
    className = ""
}) => {
    const [cities, setCities] = useState([]);

    useEffect(() => {
        if (selectedState) {
            const stateCities = getCitiesByState(selectedState);
            setCities(stateCities);

            // Reset city if it's not in the new state's cities
            if (selectedCity && !stateCities.includes(selectedCity)) {
                onCityChange('');
            }
        } else {
            setCities([]);
            onCityChange('');
        }
    }, [selectedState]);

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
            {/* State Selector */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                    {stateLabel} {required && <span className="text-red-500">*</span>}
                </label>
                <select
                    value={selectedState}
                    onChange={(e) => onStateChange(e.target.value)}
                    required={required}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-300 transition-all bg-white"
                >
                    <option value="">Select State</option>
                    {nigerianStates.map((state) => (
                        <option key={state.state} value={state.state}>
                            {state.state}
                        </option>
                    ))}
                </select>
            </div>

            {/* City Selector */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                    {cityLabel} {required && <span className="text-red-500">*</span>}
                </label>
                <select
                    value={selectedCity}
                    onChange={(e) => onCityChange(e.target.value)}
                    required={required}
                    disabled={!selectedState}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-300 transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                    <option value="">
                        {selectedState ? 'Select City' : 'Select State First'}
                    </option>
                    {cities.map((city) => (
                        <option key={city} value={city}>
                            {city}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default StateAndCitySelector;
