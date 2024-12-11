require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require(`cors`);

// CORS handling
app.use(cors({
  origin: 'https://codevengers.netlify.app',  // Allow this domain to access the backend
  allowedHeaders: ['Content-Type', 'Authorization'],  // Ensure the Authorization header is allowed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']  // Allow necessary HTTP methods
}));

app.options('*', cors());

// Middlewares
app.use(require("morgan")("dev"));
app.use(express.json());

// Handle the base route with a welcome message
app.get("/", (req, res) => {
  res.send("Welcome to the Marvel API! Use /movies or /auth for valid routes.");
});

// Import the movie routes
const movieRoutes = require("./api/movies");

// Use the movie routes for the '/movies' path
app.use("/movies", movieRoutes);

// Users routes
const usersRoutes = require("./api/users");
app.use("/users", usersRoutes);

// Authentication routes
const authRoutes = require("./api/auth").router;
app.use("/auth", authRoutes);

// Commenting routes
const commentsRouter = require('./api/comments');
app.use("/comments", commentsRouter);

// Watchlist routes
const watchlistRouter = require("./api/watchlist");
app.use("/watchlist", watchlistRouter);

// Ratings routes
const ratingsRouter = require("./api/ratings");
app.use("/ratings", ratingsRouter);

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
