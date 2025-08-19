const express = require("express");
const router = express.Router();
const passport = require("passport");
const adminController = require("../controllers/adminController");

console.log("Main router loaded");

// Login routes
router.get("/login", adminController.loginpage);
router.post(
  "/login",
  passport.authenticate("admin-local", {
    failureRedirect: "/login",
    successRedirect: "/admin/dashboard",
  })
);

// Redirect the home page to the user panel first
router.get("/", (req, res) => {
  return res.redirect("/user/blogs");
});

// Use the specific routers for each section
// Admin routes contain their own per-route protection; expose /admin/register publicly
router.use("/admin", require("./adminRoutes"));
router.use(
  "/category",
  passport.checkAuthentication,
  require("./categoryRoutes")
);
router.use("/blog", passport.checkAuthentication, require("./blogRoutes"));

module.exports = router;
