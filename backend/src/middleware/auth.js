import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: "Sign in to continue." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Account no longer exists." });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Session expired. Please sign in." });
  }
}
