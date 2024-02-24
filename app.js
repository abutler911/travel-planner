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
  const destination = req.body.destination;
  const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY;

  try {
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${destination}&appid=${OPEN_WEATHER_API_KEY}&units=imperial`
    );

    // Organize forecasts by date
    let forecastsByDate = {};
    forecastResponse.data.list.forEach((forecast) => {
      const date = new Date(forecast.dt_txt).toDateString();
      if (!forecastsByDate[date]) {
        forecastsByDate[date] = [];
      }
      forecastsByDate[date].push(forecast);
    });

    // Reduce to daily forecasts
    let dailyForecasts = Object.keys(forecastsByDate).map((date) => {
      const forecasts = forecastsByDate[date];
      const avgTemp =
        forecasts.reduce((acc, cur) => acc + cur.main.temp, 0) /
        forecasts.length;
      const conditions =
        forecasts[Math.floor(forecasts.length / 2)].weather[0].description;
      return {
        date,
        temperature: avgTemp.toFixed(2),
        conditions,
      };
    });

    const resultsData = {
      destination,
      forecasts: dailyForecasts,
    };

    res.redirect(
      "/results?data=" + encodeURIComponent(JSON.stringify(resultsData))
    );
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    res.status(500).json({ error: "Error fetching forecast data" });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
