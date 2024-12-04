require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 3000;

// Middlewares
app.use(require("morgan")("dev"));
app.use(express.json());

// Import the movie routes
const movieRoutes = require("./api/movies");

// Use the movie routes for the '/movies' path
app.use("/movies", movieRoutes);

// Authentication routes
app.use(require("./api/auth").router);

// 404 Error Handling
app.use((req, res, next) => {
  next({ status: 404, message: "Endpoint not found" });
});

// Global Error Handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.send(err.message ?? "Sorry, something broke");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});