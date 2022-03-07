const express = require("express");
const router = express.Router();
const firebaseAdminDb = require("../connections/firebaseAdmin");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/post", function (req, res, next) {
  res.render("post", { title: "Express" });
});

router.get("/dashboard/signup", function (req, res, next) {
  res.render("dashboard/signup", { title: "Express" });
});

module.exports = router;
