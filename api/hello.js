import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 1113;

app.get("/api/hello", async (req, res) => {
  try {
    const visitorName = req.query.visitorName || "Anonymous";
    const visitorIp = req.ip || req.headers["x-forwarded-for"] || "8.8.8.8"; // Use Google's DNS as fallback

    console.log(`Visitor IP: ${visitorIp}`);

    // Using ipapi.co for IP geolocation
    const locationResponse = await axios.get(
      `https://ipapi.co/${visitorIp}/json/`
    );
    console.log("Location data:", locationResponse.data);

    const { country_name: country, city } = locationResponse.data;

    if (!city) {
      throw new Error("Unable to determine city from IP");
    }

    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    console.log("Weather data:", weatherResponse.data);

    const temperature = weatherResponse.data.main.temp;

    res.json({
      clientName: visitorName,
      finder: country,
      found: city,
      greeting: `Hello ${visitorName} from ${country}, temperature is ${temperature} degree C in ${city}`,
    });
  } catch (error) {
    console.error("Error details:", error.message);
    if (error.response) {
      console.error("Error response:", error.response.data);
    }
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
