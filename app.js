const express = require("express");
const mongoose = require("mongoose");
const path = require("path"); // Include the path module
const app = express();
const port = 3000;

mongoose
  .connect("mongodb://localhost:27017/travel-planner", {})
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

// Set up EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());

// Route for the index page
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
