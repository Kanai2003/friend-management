import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  // Extract token from cookies or Authorization header
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach decoded token payload to `req.user`
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized. Invalid or expired token." });
  }
};
