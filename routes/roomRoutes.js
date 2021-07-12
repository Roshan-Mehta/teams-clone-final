const { Router } = require("express");
const requireAuth = require("../middleware/authMiddleware");
const { v4: uuidv4 } = require("uuid");

const router = Router();
router.get("/", (req, res) => {
  res.render("home");
});
router.get("/home", (req, res) => {
  res.render("home");
});


module.exports = router;
