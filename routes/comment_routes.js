const router = require("express").Router();
const commentController = require("../controller/comment_controller");
const authenticate  = require("../middleware/authenticate");
const {commentIdCheck,userCommentCheck}= require("../controller/comment_controller");

router.post("/add/:blogId", authenticate, commentController.create);
router.put("/update/:commentId", [authenticate,commentIdCheck,userCommentCheck], commentController.editComment);
router.delete("/delete/:commentId", [authenticate,commentIdCheck,userCommentCheck], commentController.deleteComment);

module.exports = router;
