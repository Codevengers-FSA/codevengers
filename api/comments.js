const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

const { authenticate } = require("../api/auth");

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

router.post('/movies/:movieId/comments', authenticate, async (req, res, next) => {
  const { movieId } = req.params; 
  const { text, parentId } = req.body;
  const userId = req.user.id;

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

router.put('/comments/:id', authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this comment' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id, 10) },
      data: { text },
    });
    res.json(updatedComment);
  } catch (e) {
    next(e);
  }
});

router.delete('/comments/:id', authenticate, async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  console.log("Delete Comment - Params:", req.params, "User ID:", userId);

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id, 10) },
    });

    console.log("Comment Found:", comment);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this comment' });
    }

    await prisma.comment.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete('/replies/:id', authenticate, async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  console.log("Delete Reply - Params:", req.params, "User ID:", userId);

  try {
    const reply = await prisma.comment.findUnique({
      where: { id: parseInt(id, 10) },
    });

    console.log("Reply Found:", reply);

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    if (reply.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this reply' });
    }

    await prisma.comment.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(200).json({ message: 'Reply deleted successfully' });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
