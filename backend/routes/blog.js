const express = require("express");
const { upload } = require("../utils/fileUpload");
const { handleCreateNewBlog } = require("../controllers/blog");

const router = express.Router();

router.post("/", upload.single("coverImage"), handleCreateNewBlog);

module.exports = router;
