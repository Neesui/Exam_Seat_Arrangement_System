import jwt from "jsonwebtoken";
import prisma from "../utils/db.js";

// Authenticate JWT and attach user to request
export const authenticate = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) return res.status(401).json({ message: "You are not authorized" });

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token is invalid or expired" });
  }
};

