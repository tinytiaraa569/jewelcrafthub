// userMiddleware.js
const jwt = require("jsonwebtoken");

const userToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided. Please log in." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Handle possible variations in the token payload (id or userId)
    req.userId = decoded.id || decoded.userId;

    if (!req.userId) {
      return res.status(401).json({ message: "Token is invalid. Missing user ID." });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("JWT verification error:", error.message);
    res.status(401).json({ message: "Invalid or expired token. Please log in again." });
  }
};

module.exports = userToken;
