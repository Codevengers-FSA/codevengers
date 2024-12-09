const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

router.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;
  try {
    const watchlist = await prisma.watchlist.findMany({
      where: { ownerId: parseInt(userId, 10) },
      include: { movie: true },
    });
    res.json(watchlist);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  const { userId, movieId, title } = req.body;
  try {
    const newWatchlistItem = await prisma.watchlist.create({
      data: {
        ownerId: parseInt(userId, 10),
        movieId: parseInt(movieId, 10),
        title,
      },
    });
    res.status(201).json(newWatchlistItem);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.watchlist.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

module.exports = router;