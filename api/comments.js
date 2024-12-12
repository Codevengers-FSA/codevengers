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

// Get all comments for a movie
router.get('/movies/:movieId/comments', async (req, res, next) => {
  const { movieId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { movieId: parseInt(movieId, 10) },
      include: { user: { select: { id: true, username: true } }, replies: { include: { user: { select: { id: true, username: true } } } } }, // Fetch user details
    });
    res.json(comments);
  } catch (e) {
    next(e);
  }
});

// Add a new comment for a movie
router.post('/movies/:movieId/comments', authenticateUser, async (req, res, next) => {
  const { movieId } = req.params;
  const { text, parentId } = req.body;
  const userId = req.user.id;

  console.log(req.user.id)

  try {
    const newComment = await prisma.comment.create({
      data: {
        movieId: parseInt(movieId, 10),
        userId,
        text,
        parentId,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true },
    });

    const commentWithUser = {
      ...newComment,
      user,
    };

    res.status(201).json(commentWithUser);
  } catch (e) {
    next(e);
  }
});

// Update an existing comment
router.put('/comments/:id', authenticateUser, async (req, res, next) => {
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

// Delete a comment
router.delete('/comments/:id', authenticateUser, async (req, res, next) => {
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
    console.error("Error in DELETE /comments/:id:", e);
    next(e);
  }
});

// Add a reply to a comment
router.post('/comments/:id/replies', authenticateUser, async (req, res, next) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  console.log("Request to add reply - Params:", req.params, "Body:", req.body, "User ID:", userId);

  try {
    const parentComment = await prisma.comment.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!parentComment) {
      console.log("Parent comment not found for ID:", id);
      return res.status(404).json({ message: 'Parent comment not found' });
    }

    console.log("Parent comment found:", parentComment);

    const newReply = await prisma.comment.create({
      data: {
        text,
        userId,
        parentId: parseInt(id, 10),
        movieId: parentComment.movieId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    console.log("New reply created:", newReply);

    res.status(201).json(newReply);
  } catch (e) {
    console.error('Error in POST /comments/:id/replies:', e.message);
    res.status(500).json({ error: 'Internal Server Error', message: e.message });
  }
});

// Delete a reply
router.delete('/comments/replies/:id', authenticateUser, async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  console.log("Delete Reply - Params:", req.params, "User ID:", userId);

  try {
    const reply = await prisma.comment.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!reply) {
      console.log("Reply not found for ID:", id);
      return res.status(404).json({ message: 'Reply not found' });
    }

    console.log("Reply found:", reply);

    if (reply.userId !== userId) {
      console.log("User not authorized to delete reply for ID:", id);
      return res.status(403).json({ message: 'Unauthorized to delete this reply' });
    }

    await prisma.comment.delete({
      where: { id: parseInt(id, 10) },
    });

    console.log("Reply deleted successfully:", id);

    res.status(200).json({ message: 'Reply deleted successfully' });
  } catch (e) {
    console.error('Error in DELETE /comments/replies/:id:', e.message);
    res.status(500).json({ error: 'Internal Server Error', message: e.message });
  }
});

module.exports = router;
