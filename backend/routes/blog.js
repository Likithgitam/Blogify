const express = require("express");

const { upload } = require("../utils/fileUpload");
const { authMiddleware } = require("../middlewares/auth");

const {
  handleCreateNewBlog,
  handleGetAllBlogs,
  handleGetSpecificBlog,
  handleUpdateSpecificBlog,
  handleDeleteSpecificBlog,
} = require("../controllers/blog");

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, upload.single("coverImage"), handleCreateNewBlog)
  .get(handleGetAllBlogs);

router
  .route("/:blogId")
  .get(handleGetSpecificBlog)
  .delete(authMiddleware, handleDeleteSpecificBlog);

router.put(
  "/edit/:blogId",
  authMiddleware,
  upload.single("coverImage"),
  handleUpdateSpecificBlog
);

module.exports = router;
