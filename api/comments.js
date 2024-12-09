const express = require("express");
const router = express.Router();
const prisma = require("../prisma")

router.get('/movies/:movieId/comments', async (req, res, next) => {
  const { movieId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { movieId: parseInt(movieId, 10) },
      include: { user: true, replies: true },
    });
    res.json(comments);
  } catch (e) {
    next(e);
  }
});

router.post('/movies/:movieId/comments', async (req, res, next) => {
  const { movieId } = req.params; 
  const { userId, text, parentId } = req.body;
  try {
    const newComment = await prisma.comment.create({
      data: {
        movieId: parseInt(movieId, 10),
        userId,
        text, 
        parentId, 
      },
    });
    res.status(201).json(newComment);
  } catch (e) {
    next(e);
  }
});

router.put('/comments/:id', async (req, res, next) => {
  const { id } = req.params;
  const { text } = req.body;
  try {
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id, 10) },
      data: { text },
    });
    res.json(updatedComment);
  } catch (e) {
    next(e);
  }
});

router.delete('/comments/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.comment.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

module.exports = router;