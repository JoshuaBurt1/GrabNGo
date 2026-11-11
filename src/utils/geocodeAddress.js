// src/utils/geocodeAddress.js

export async function geocodeAddress(address) {
  try {
    let url;

    // Use direct API call locally; use Vercel API proxy in production
    if (import.meta.env.DEV) {
      const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;
      url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        address
      )}&key=${apiKey}`;
    } else {
      url = `/api/geocode-proxy?q=${encodeURIComponent(address)}`;
    }

    const response = await fetch(url);

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