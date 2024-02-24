const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const path = require("path");
const app = express();
require("dotenv").config();
const port = 3000;

// mongoose
//   .connect("mongodb://localhost:27017/travel-planner", {})
//   .then(() => console.log("MongoDB connected..."))
//   .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Route for the index page
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/results", (req, res) => {
  let resultsData;
  if (req.query.data) {
    resultsData = JSON.parse(req.query.data);
  } else {
    return res.render("error");
  }

  res.render("results", { destination: resultsData.destination, resultsData });
});

app.post("/plan-trip", async (req, res) => {
  console.log("Received form submission:", req.body);
  console.log("Destination:", req.body.destination);
  const destination = req.body.destination;
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);
  const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY;

  try {
    // Fetch the CURRENT weather data
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${destination}&appid=${OPEN_WEATHER_API_KEY}&units=imperial`
    );

    // Fetch the forecast data
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${destination}&appid=${OPEN_WEATHER_API_KEY}&units=imperial`
    );

    // Process the forecast data
    const dailyForecasts = [];
    const forecastData = forecastResponse.data.list;

    for (let forecast of forecastData) {
      const forecastDate = new Date(forecast.dt * 1000);
      let iso8601Date;

      const dateStr = forecast.date;
      if (dateStr) {
        iso8601Date = new Date(dateStr);

        if (isNaN(iso8601Date.getTime())) {
          const parts = dateStr.split("T")[0].split("-");
          iso8601Date = new Date(parts[0], parts[1] - 1, parts[2]);
        }
      } else {
        console.error(
          "Forecast object is missing a 'date' property:",
          forecast
        );
      }

      if (forecastDate >= startDate && forecastDate <= endDate) {
        console.log(`Forecast date: ${typeof forecastDate}`);
        dailyForecasts.push({
          date: iso8601Date,
          temperature: forecast.main.temp,
          conditions: forecast.weather[0].description,
        });
      }
    }

    // Construct resultsData
    const resultsData = {
      destination: destination,
      weather: {
        temperature: weatherResponse.data.main.temp,
        conditions: weatherResponse.data.weather[0].description,
      },
      forecasts: dailyForecasts,
      attractions: [
        { name: "Example Attraction 1" },
        { name: "Example Attraction 2" },
      ],
    };
    console.log(resultsData);
    // Redirect
    res.redirect(
      "/results?data=" + encodeURIComponent(JSON.stringify(resultsData))
    );
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res
      .status(500)
      .json({ success: false, error: "Error fetching weather data" });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
