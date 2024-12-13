const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { authenticate } = require("../api/auth"); // Import the authenticate middleware

const prisma = new PrismaClient();

router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: +id },
    });
    res.json(user);
  } catch (e) {
    next(e);
  }
});

router.get('/:id/comments', async (req, res, next) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const userComments = await prisma.comment.findMany({
      where: { userId },
    });
    res.json(userComments);
  } catch (error) {
    next(error);
  }
});

// "I've watched this" functionality
router.post('/:id/watched', authenticate, async (req, res, next) => {
  const userId = parseInt(req.params.id, 10);
  const { movieId } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        watchedMovies: {
          push: movieId,
        },
      },
    });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// Get watched movies
router.get('/:id/watched', authenticate, async (req, res, next) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
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