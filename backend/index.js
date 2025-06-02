const express = require("express");
require("dotenv").config();

const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");

const { connectToMongoDB } = require("./connection");
const { authMiddleware } = require("./middlewares/auth");

// MongoDB Connection
connectToMongoDB(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log(error);
  });

const app = express();

// middlewares
app.use(express.json());

// router registrations
app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);

// GET endpoint to check if user is logged in or not
app.get("/api/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: "authorised", user: req.user });
});

// POST endpoint to handle file upload
app.listen(process.env.PORT, () => {
  console.log(`Server Running at http://localhost:${process.env.PORT}`);
});
