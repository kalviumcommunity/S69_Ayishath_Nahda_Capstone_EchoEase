const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
 
  console.log("Headers Received:", req.headers); // Debugging log

  const token = req.header("Authorization");
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const tokenValue = token.split(" ")[1];
  if (!tokenValue) {
    return res.status(401).json({ error: "Invalid token format." });
  }

  try {
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to request
    next();
  } catch (error) {
    console.error("Token verification error:", error); // Debugging log
    res.status(400).json({ error: "Invalid token." });
=======
  const authHeader = req.header("Authorization");

  console.log("Authorization Header:", authHeader); // Debug log

  if (!authHeader) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. Invalid token format. Use 'Bearer <token>'." });
  }

  const token = authHeader.split(" ")[1];
  console.log("Extracted Token:", token); // Debug log

  if (!token) {
    return res.status(401).json({ error: "Access denied. Token is empty." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debug log
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(400).json({ error: "Invalid token.", details: error.message });

  }
};