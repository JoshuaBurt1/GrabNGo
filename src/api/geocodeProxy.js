// api/geocode.js
export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Address query parameter 'q' is required." });
  }

  const apiKey = process.env.OPENCAGE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENCAGE_API_KEY is not set in environment variables." });
  }

  try {
    const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      q
    )}&key=${apiKey}`;

    const response = await fetch(geocodeUrl, {
      headers: {
        "User-Agent": "GrabAndGo/1.0",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error proxying geocode request:", error);
    return res.status(500).json({ error: "Internal server error during geocoding." });
  }
}