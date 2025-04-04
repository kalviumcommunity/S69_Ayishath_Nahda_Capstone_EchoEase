const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Debugging logs
  console.log("Headers Received:", req.headers);
  console.log("Authorization Header:", req.headers.authorization);

  // Check if Authorization header exists
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  // Verify Bearer token format
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      error: "Access denied. Invalid token format. Use 'Bearer <token>'." 
    });
  }

  // Extract token
  const token = authHeader.split(" ")[1];
  console.log("Extracted Token:", token);

  if (!token) {
    return res.status(401).json({ error: "Access denied. Token is empty." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    
    // Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    
    // Differentiate between token expiration and other errors
    const statusCode = error.name === 'TokenExpiredError' ? 401 : 400;
    const errorMessage = error.name === 'TokenExpiredError' 
      ? "Token expired. Please log in again." 
      : "Invalid token.";
    
    res.status(statusCode).json({ 
      error: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
};