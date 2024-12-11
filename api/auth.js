const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const prisma = require("../prisma");

const JWT_SECRET = process.env.JWT_SECRET;

const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
};

router.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);
  const token = authHeader?.slice(7);
  console.log("Extracted Token:", token);
  if (!token) return next();

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    console.log("Decoded Token ID:", id);
    const user = await prisma.user.findUniqueOrThrow({ where: { id } });
    req.user = user;
    next();
  } catch (e) {
    console.error("Error in Auth Middleware:", e);
    next(e);
  }
});

router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    const token = createToken(user.id);
    res.status(201).json({ token });
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid username" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = createToken(user.id);
    res.json({ token });
  } catch (e) {
    next(e);
  }
});

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader); 

  if (!authHeader) return next({ status: 401, message: "You must be logged in" });

  const token = authHeader.slice(7);
  console.log("Extracted Token:", token);

  if (!token) return next({ status: 401, message: "You must be logged in" });

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    req.user = { id };
    next();
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      return next({ status: 401, message: "Token expired, please log in again" });
    }
    console.error("Error in Auth Middleware:", e);
    next(e);
  }
};

module.exports = {
  router,
  authenticate,
};