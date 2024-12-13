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
    const user = await prisma.user.findUniqueOrThrow({
      where: { username: username },
    });
    res.json(user);
  } catch (e) {
    next(e);
  }
});

router.get('/:username/comments', async (req, res, next) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { username: username },
    });

    const userComments = await prisma.comment.findMany({
      where: { userId: user.id },
    });

    res.json(userComments);
  } catch (error) {
    next(error);
  }
});

// "I've watched this" functionality
router.post('/:username/watched', authenticate, async (req, res, next) => {
  const { username } = req.params;
  const { movieId } = req.body;

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { username: username },
    });

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        watchedMovies: {
          push: parseInt(movieId, 10), // Ensure movieId is an integer
        },
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// Get watched movies
router.get('/:username/watched', authenticate, async (req, res, next) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { username: username },
      select: {
        watchedMovies: true,
      },
    });

    res.status(200).json(user.watchedMovies);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
