import jwt from "jsonwebtoken";

// Middleware to check if user is authenticated
export const authenticate = (req, res, next) => {
  try {
    // 1. Get token from cookies
    const token = req.cookies?.token;
    // 2. If no token, reject request
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    // 3. Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 4. Save decoded user info to request object for future use
    req.user = decoded;
    // 5. Allow the request to continue to the next handler
    next();
  } catch (err) {
    // If token is invalid or expired
    console.error("JWT Error:", err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
