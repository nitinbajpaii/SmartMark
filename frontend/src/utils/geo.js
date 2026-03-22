/**
 * Enhanced Geolocation Utility
 * Implements retries, high/low accuracy fallbacks, and detailed error handling.
 * Accuracy threshold: 50m. Timeout: 15s.
 */

const getPosition = (options) => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

export async function getAccurateLocation(options = {}) {
  const {
    timeout = 15000,
    maximumAge = 0,
    maxRetries = 1,
    accuracyThreshold = 50 // meters
  } = options;

  const highAccuracyOptions = {
    enableHighAccuracy: true,
    timeout,
    maximumAge
  };

  const lowAccuracyOptions = {
    enableHighAccuracy: false,
    timeout,
    maximumAge
  };

  let lastError = null;

  // Retry Loop
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Geo] Attempt ${attempt + 1}: Requesting high accuracy...`);
      const pos = await getPosition(highAccuracyOptions);
      
      console.log(`[Geo] Fix found: ${pos.coords.latitude}, ${pos.coords.longitude} (+/- ${pos.coords.accuracy}m)`);
      
      // If accuracy is worse than threshold, retry unless it's the last attempt
      if (pos.coords.accuracy > accuracyThreshold && attempt < maxRetries) {
        console.warn(`[Geo] Accuracy (${pos.coords.accuracy}m) worse than threshold (${accuracyThreshold}m). Retrying...`);
        continue;
      }

      return pos;
    } catch (err) {
      lastError = err;
      console.warn(`[Geo] High accuracy failed (Attempt ${attempt + 1}):`, err.message);
      
      // If permission is denied, don't bother retrying
      if (err.code === err.PERMISSION_DENIED) {
        throw new Error("Location permission denied. Please allow access in your browser settings.");
      }

      // On last attempt, try fallback to low accuracy
      if (attempt === maxRetries) {
        try {
          console.log(`[Geo] Final fallback: Requesting normal accuracy...`);
          const pos = await getPosition(lowAccuracyOptions);
          console.log(`[Geo] Success (Low Accuracy fallback): ${pos.coords.latitude}, ${pos.coords.longitude} (+/- ${pos.coords.accuracy}m)`);
          return pos;
        } catch (fallbackErr) {
          console.error(`[Geo] Fallback failed:`, fallbackErr.message);
          throw formatError(fallbackErr);
        }
      }
    }
  }

  throw formatError(lastError);
}

function formatError(err) {
  switch (err.code) {
    case 1: // PERMISSION_DENIED
      return new Error("Location permission denied. Please allow access.");
    case 2: // POSITION_UNAVAILABLE
      return new Error("Position unavailable. Ensure GPS is on and you have a signal.");
    case 3: // TIMEOUT
      return new Error("Location request timed out. Please try again or move to an open area.");
    default:
      return new Error(err.message || "An unknown location error occurred.");
  }
}
