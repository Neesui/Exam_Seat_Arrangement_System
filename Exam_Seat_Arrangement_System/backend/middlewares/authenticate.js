import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    let token;

    // 1. Try to get token from cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 2. If not in cookies, check Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 3. If no token found
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated: Token missing" });
    }

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach decoded user to request
    req.user = decoded;

    // 6. Move to next middleware or controller
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
