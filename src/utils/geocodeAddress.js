// This translates an address string into a coordinate array (forward geocoding) using OpenCage API (https://opencagedata.com/)
// src/utils/geocodeAddress.js

export async function geocodeAddress(address) {
  try {
    const response = await fetch(`/api/geocode?q=${encodeURIComponent(address)}`);

    if (!response.ok) {
      throw new Error(`Geocoding request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return { lat, lng };
    } else {
      throw new Error("No results found");
    }
  } catch (err) {
    console.error("Geocoding failed:", err);
    throw err;
  }
}