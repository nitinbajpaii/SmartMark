/**
 * Robust Geolocation Fetcher
 * This utility handles common GPS issues:
 * 1. Warm-up delay (first fix is often inaccurate)
 * 2. Accuracy thresholding
 * 3. Timeout handling
 */
export async function getAccurateLocation(options = {}) {
  const {
    maxAccuracy = 80, // meters
    timeout = 25000,  // ms (longer to allow GPS settle)
    maxRetries = 3
  } = options

  return new Promise((resolve, reject) => {
    let watchId = null
    let timer = null
    let bestPos = null
    let retries = 0

    const cleanup = () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId)
      if (timer !== null) clearTimeout(timer)
    }

    const startWatching = () => {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords
          console.log(`[Geo] Fix: ${latitude}, ${longitude} (+/- ${accuracy}m)`)
          
          if (!bestPos || accuracy < bestPos.coords.accuracy) {
            bestPos = pos
          }

          // If accuracy is good enough, resolve immediately
          if (accuracy <= maxAccuracy) {
            console.log(`[Geo] Accurate fix found: ${accuracy}m`)
            cleanup()
            resolve(pos)
          }
        },
        (err) => {
          console.error(`[Geo] Error:`, err)
          // If it's a timeout or position unavailable, we might want to retry
          if (retries < maxRetries) {
            retries++
            console.log(`[Geo] Retrying... (${retries}/${maxRetries})`)
          } else {
            cleanup()
            reject(err)
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    }

    timer = setTimeout(() => {
      cleanup()
      if (bestPos) {
        console.log(`[Geo] Timeout reached. Returning best fix: ${bestPos.coords.accuracy}m`)
        resolve(bestPos)
      } else {
        reject(new Error('Geolocation timeout - no position found'))
      }
    }, timeout)

    startWatching()
  })
}
