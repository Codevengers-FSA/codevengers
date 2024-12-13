require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// CORS handling
app.use(
  cors({
    origin: '*', // Update this to your frontend's URL, e.g., https://codevengers.netlify.app
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

app.options('*', cors());

// Middleware
app.use(morgan('dev'));
app.use(express.json());

// Base route
app.get('/', (req, res) => {
  res.send('Welcome to the Marvel API! Use /movies or /auth for valid routes.');
});

// Import and use routes
const movieRoutes = require('./api/movies');
app.use('/movies', movieRoutes);

const usersRoutes = require('./api/users');
app.use('/users', usersRoutes);

const { router: authRoutes } = require('./api/auth');
app.use('/auth', authRoutes);

const commentsRouter = require('./api/comments');
app.use('/comments', commentsRouter);

const watchlistRouter = require('./api/watchlist');
app.use('/watchlist', watchlistRouter);

const ratingsRouter = require('./api/ratings');
app.use('/ratings', ratingsRouter);

const aiMoviesRouter = require('./api/aiMovies');
app.use('/ai-movies', aiMoviesRouter);

// 404 Error Handling
app.use((req, res, next) => {
  next({ status: 404, message: 'Endpoint not found' });
});

// Global Error Handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send(err.message || 'Sorry, something broke');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
