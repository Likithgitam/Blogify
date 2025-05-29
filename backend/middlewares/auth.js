const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "Not Authenticated" });
  }

  const token = authorization.split(" ")[1];
  if (token != undefined) {
    try {
      const user = jwt.verify(token, process.env.SECRET_KEY);
      req.user = user;
      next();
    } catch (e) {
      return res.status(401).json({ message: "Not Authenticated" });
    }
  }
};

module.exports = { authMiddleware };
