const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token.' });
  }
};

router.post('/movies/:id/rate', authenticateUser, async (req, res) => {
  const movieId = parseInt(req.params.id, 10);
  const { rating } = req.body;
  const userId = req.user.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
  }

  try {
    const existingRating = await prisma.rating.findFirst({
      where: { movieId, userId },
    });

    if (existingRating) {
      await prisma.rating.update({
        where: { id: existingRating.id },
        data: { rating },
      });
    } else {
      await prisma.rating.create({
        data: {
          movieId,
          userId,
          rating,
        },
      });
    }

    const allRatings = await prisma.rating.findMany({
      where: { movieId },
    });

    const averageRating =
      allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    res.json({ average: averageRating });
  } catch (error) {
    console.error('Error saving rating:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.get('/movies/:id/ratings', authenticateUser, async (req, res) => {
  const movieId = parseInt(req.params.id, 10);

  try {
    const allRatings = await prisma.rating.findMany({
      where: { movieId },
    });

    const averageRating =
      allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length || 0;

    const userRating = await prisma.rating.findFirst({
      where: { movieId, userId: req.user.id },
    });

    res.json({
      average: averageRating,
      userRating: userRating ? userRating.rating : null,
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;