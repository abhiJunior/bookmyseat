import jwt from "jsonwebtoken";

const isLoggedIn = (req, res, next) => {
  try {
    // ✅ Get token from "Authorization" header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ status: false, message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract the JWT

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_PASSWORD);

    if (!decoded) {
      return res.status(401).json({ status: false, message: "Invalid token." });
    }

    // ✅ Attach user info to request
    req.user = decoded;

    next(); // Continue to controller
  } catch (e) {
    console.error("Authentication error:", e.message);
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }
};

export default isLoggedIn;
