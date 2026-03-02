// This translates an address string into a coordinate array (forward geocoding) using OpenCage API (https://opencagedata.com/)
export async function geocodeAddress(address) {
  const apiKey = "b74715ad7e3d48bcb323718ef3d0f828";
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    address
  )}&key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.results.length > 0) {
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
