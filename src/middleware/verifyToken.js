import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  // Check if Authorization header is present
  
  if (!req.headers.authorization) {
    return res.status(403).json({
      success: false,
      message: "Authorization header is missing",
      errorMessage: "Authorization key must be added in header",
    });
  }

  const authHeader = req.headers.authorization;

  // Verify token
  jwt.verify(authHeader, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to authenticate token",
      });
    }
    // Save the user ID from the token
    req.userId = decoded.userId;
    next();
  });
};

export default verifyToken;
