const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// Import movie data from phases
const phase1 = require("../prisma/phases/phase1");
const phase2 = require("../prisma/phases/phase2");
const phase3 = require("../prisma/phases/phase3");
const phase4 = require("../prisma/phases/phase4");
const phase5 = require("../prisma/phases/phase5");

// Combine the movie data from all phases into a single array
const allMovies = [...phase1, ...phase2, ...phase3, ...phase4, ...phase5];

router.get("/", async (req, res, next) => {
  try {
    const movies = await prisma.movie.findMany();
    res.json(movies);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const movie = await prisma.movie.findUniqueOrThrow({
      where: { id: +id },
    });
    res.json(movie);
  } catch (e) {
    next(e);
  }
});

module.exports = router;