const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

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
  const userId = req.params.id;

  try{
    const userComments = await db.query('SELECT * FROM comments WHERE userId = $1', [userId]);
    res.json(userComments.rows);
  } catch (error) {
    res.status(500).json({error: 'Error fetching user comments'});
  }
})

module.exports = router;