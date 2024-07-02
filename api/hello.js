import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 1113;

app.get("/api/hello", async (req, res) => {
  try {
    const visitorName = req.query.visitorName || anonny;
    const visitorIp = req.ip || req.connection.remoteAddress;
    const location = axios.get(`https://whoer.com/ip/${visitorIp}`);
    const { country } = (await location).data;
    const { city } = (await location).data;
    const weather = axios.get(
      `api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${process.env.OPENWEATHER_API_KEY}&unit=metric`
    );
    const temperature = (await weather).data.main.temp;
    res.json({
      clientName: visitorName,
      finder: country,
      found: city,
      greeting: `Hello ${visitorName} from ${country} temperature is ${temperature} degree C in ${city}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `an error occured` });
  }
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
