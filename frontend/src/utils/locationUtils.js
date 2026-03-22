/**
 * Location Utilities for SmartMark
 */

/**
 * Get current browser location with high accuracy
 * @returns {Promise<{lat: number, lng: number, accuracy: number}>}
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported by your browser'));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let msg = 'Could not get your location';
        if (error.code === 1) msg = 'Location permission denied';
        else if (error.code === 3) msg = 'Location request timed out';
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      }
    );
  });
};

/**
 * Calculate Haversine distance between two points in meters
 * @param {Object} pos1 {lat, lng}
 * @param {Object} pos2 {lat, lng}
 * @returns {number} distance in meters
 */
export const calculateDistance = (pos1, pos2) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371000; // Earth radius in meters
  
  const dLat = toRad(pos2.lat - pos1.lat);
  const dLng = toRad(pos2.lng - pos1.lng);
  
  const lat1 = toRad(pos1.lat);
  const lat2 = toRad(pos2.lat);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Check if distance is within the 100 meter range
 * @param {number} distance in meters
 * @returns {boolean}
 */
export const isWithinRange = (distance) => {
  const MAX_RANGE = 100;
  return distance <= MAX_RANGE;
};
