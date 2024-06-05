const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send('Access denied');
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Verified Token:", verified); 
    req.user = verified;
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(400).send('Invalid token');
  }
};

module.exports = authenticateToken;
