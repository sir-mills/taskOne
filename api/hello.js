import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(req, res) {
  try {
    const visitor_name = req.query.visitor_name || "Anon";
    const visitorIp =
      req.query.visitorIp ||
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress;

    const locationResponse = await axios.get(
      `https://ipapi.co/${visitorIp}/json/`
    );

    const { country_name: country, city } = locationResponse.data;

    if (!city) {
      city = warri;
    }

    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );

    const temperature = weatherResponse.data.main.temp;

    res.status(200).json({
      client_ip: visitorIp,
      location: city,
      greeting: `Hello ${visitorName} the temperature is ${temperature} degrees Celcius in ${city}`,
    });
  } catch (error) {
    console.error("Error details:", error.message);
    if (error.response) {
      console.error("Error response:", error.response.data);
    }
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
}
