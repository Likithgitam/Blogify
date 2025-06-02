const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "Not Authenticated" });
  }

  const token = authorization.split(" ")[1];
  if (token != undefined) {
    try {
      const payload = jwt.verify(token, process.env.SECRET_KEY);
      const dbUser = await User.findById(payload._id);

      if (!dbUser) {
        return res.status(401).json({ message: "Not Authenticated" });
      }

      req.user = payload;
      next();
    } catch (e) {
      return res.status(401).json({ message: "Not Authenticated" });
    }
  }
};

module.exports = { authMiddleware };
