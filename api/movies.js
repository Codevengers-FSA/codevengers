const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma/phases")

router.get("/", async(req, res, next) =>{
    try{
        const movies = await prisma.movie.findMany();
        res.json(movies);
        } catch (e) {
            next(e);
        }
});

router.get("/:id", async (req, res, next) =>{
    const { id } = req.params;
    try {
        const movie = await prisma.movie.findUniqueOrThrow({
            where: { id: +id },
        });
        res.json(movie);
    } catch(e) {
        next(e);
    }
});

