const router = require("express").Router();
const blogController = require("../controller/blog_controller");
const authenticate  = require("../middleware/authenticate");
let {blogIdCheck, userBlogCheck} = require("../controller/blog_controller")

router.post("/create", authenticate, blogController.createBlog);
router.put("/edit/:blogId",[authenticate,blogIdCheck, userBlogCheck], blogController.editBlog)
router.delete("/delete/:blogId", [authenticate,blogIdCheck, userBlogCheck], blogController.deleteBlog);
router.get("/read/:blogId", [authenticate], blogController.readUserBlog);
router.get("/get/blogs",[authenticate],blogController.allCurrentBlogs);
router.get("/get/blogs/:userId",[authenticate],blogController.allUserBlogs)
module.exports = router;
