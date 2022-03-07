const express = require("express");
const router = express.Router();
const firebaseAdminDb = require("../connections/firebaseAdmin");

const categoriesRef = firebaseAdminDb.ref("/categories");
const articlesRef = firebaseAdminDb.ref("/articles");

router.get("/article/create", function (req, res, next) {
  categoriesRef.once("value").then((snapshot) => {
    const categories = snapshot.val();
    res.render("dashboard/article", { title: "Express", categories });
  });
});

router.get("/article/:id", function (req, res, next) {
  const id = req.params.id;
  console.log(id);
  let categories = {};
  categoriesRef
    .once("value")
    .then((snapshot) => {
      categories = snapshot.val();
      return articlesRef.child(id).once("value");
    })
    .then((snapshot) => {
      const article = snapshot.val();
      console.log(article);
      res.render("dashboard/article", {
        title: "Express",
        categories,
        article,
      });
    });
});

router.post("/article/create", function (req, res) {
  const data = req.body;
  const articleRef = articlesRef.push();
  const key = articleRef.key;
  const updateTime = Math.floor(Date.now() / 1000);
  data.id = key;
  data.update_time = updateTime;
  console.log(data);
  articleRef.set(data).then(() => {
    res.redirect(`/dashboard/article/${key}`);
  });
});

router.get("/archives", function (req, res, next) {
  res.render("dashboard/archives", { title: "Express" });
});

router.get("/categories", function (req, res, next) {
  const message = req.flash("info");
  categoriesRef.once("value").then((snapshot) => {
    const categories = snapshot.val();
    console.log(categories);
    res.render("dashboard/categories", {
      title: "Express",
      categories,
      message,
      hasInfo: message.length > 0,
    });
  });
});

router.post("/categories/create", function (req, res) {
  const data = req.body;
  const categoryRef = categoriesRef.push();
  const key = categoryRef.key;
  data.id = key;
  categoriesRef
    .orderByChild("path")
    .equalTo(data.path)
    .once("value")
    .then((snapshot) => {
      if (snapshot.val() !== null) {
        req.flash("info", "已有相同路徑");
        res.redirect("/dashboard/categories");
      } else {
        categoryRef.set(data).then(function () {
          res.redirect("/dashboard/categories");
        });
      }
    });
});

router.post("/categories/delete/:id", function (req, res) {
  const id = req.params.id;
  categoriesRef.child(id).remove();
  req.flash("info", "欄位已刪除");
  res.redirect("/dashboard/categories");
});

module.exports = router;
