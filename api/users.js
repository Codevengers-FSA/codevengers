const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { authenticate } = require("../api/auth");

const prisma = new PrismaClient();

router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (e) {
    next(e);
  }
});

router.get("/:username", async (req, res, next) => {
  const { username } = req.params;
  try {
    console.log(`Fetching user with username: ${username}`);
    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('User found:', user);
    res.json(user);
  } catch (e) {
    console.error('Error fetching user:', e);
    res.status(500).json({ error: 'Server error' });
    next(e);
  }
});

router.get('/:username/comments', async (req, res, next) => {
  const { username } = req.params;

  try {
    console.log(`Fetching user with username: ${username}`);
    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    const userComments = await prisma.comment.findMany({
      where: { userId: user.id },
    });

    console.log('Comments found:', userComments);
    res.json(userComments);
  } catch (error) {
    console.error('Error fetching user comments:', error);
    res.status(500).json({ error: 'Server error' });
    next(error);
  }
});

// "I've watched this" functionality
router.post('/:username/watched', authenticate, async (req, res, next) => {
  const { username } = req.params;
  const { movieId } = req.body;

  try {
    console.log(`Fetching user with username: ${username}`);
    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        watchedMovies: {
          push: parseInt(movieId, 10), // Ensure movieId is an integer
        },
      },
    });

    console.log('Updated user with new watched movie:', updatedUser);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating watched movies:', error);
    res.status(500).json({ error: 'Server error' });
    next(error);
  }
});

// Get watched movies
router.get('/:username/watched', authenticate, async (req, res, next) => {
  const { username } = req.params;

  try {
    console.log(`Fetching user with username: ${username}`);
    const user = await prisma.user.findUnique({
      where: { username: username },
      select: {
        watchedMovies: true,
      },
    });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Watched movies found:', user.watchedMovies);
    res.status(200).json(user.watchedMovies);
  } catch (error) {
    console.error('Error fetching watched movies:', error);
    res.status(500).json({ error: 'Server error' });
    next(error);
  }
});

module.exports = router;