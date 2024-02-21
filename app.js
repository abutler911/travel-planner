const express = require("express");
const mongoose = require("mongoose");
const path = require("path"); // Include the path module
const app = express();
const port = 3000;

// mongoose
//   .connect("mongodb://localhost:27017/travel-planner", {})
//   .then(() => console.log("MongoDB connected..."))
//   .catch((err) => console.log(err));

// Set up EJS
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

app.post("/plan-trip", (req, res) => {
  const destination = req.body.destination;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  // TODO: Fetch data using APIs (OpenWeatherMap, etc.) based on destination, startDate, endDate

  // Construct results data (Example)
  const resultsData = {
    weather: {
      temperature: "75°F",
      conditions: "Sunny",
    },
    attractions: [
      { name: "Example Attraction 1" },
      { name: "Example Attraction 2" },
    ],
  };

  res.json({ success: true, results: resultsData });
  console.log("Results data:", resultsData);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
