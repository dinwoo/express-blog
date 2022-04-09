const express = require("express");
const router = express.Router();
const firebaseAdminDb = require("../connections/firebaseAdmin");
const stringtags = require("striptags");
const moment = require("moment");
const converPagination = require("../modules/convertPagination");

const categoriesRef = firebaseAdminDb.ref("/categories");
const articlesRef = firebaseAdminDb.ref("/articles");

/* GET home page. */
router.get("/", function (req, res, next) {
  let currentPage = Number(req.query.page) || 1;
  let categories = {};
  categoriesRef
    .once("value")
    .then((snapshot) => {
      categories = snapshot.val();
      return articlesRef.orderByChild("update_time").once("value");
    })
    .then((snapshot) => {
      let articles = [];
      snapshot.forEach((snapshotChild) => {
        if (snapshotChild.val().status == "public") {
          articles.push(snapshotChild.val());
        }
      });
      articles.reverse();

      const data = converPagination(articles, currentPage);

      res.render("index", {
        title: "Express",
        categories,
        articles: data.articles,
        stringtags,
        moment,
        page: data.page,
      });
    });
});

router.get("/post/:id", function (req, res, next) {
  const id = req.params.id;
  let categories = {};
  categoriesRef
    .once("value")
    .then((snapshot) => {
      categories = snapshot.val();
      return articlesRef.child(id).once("value");
    })
    .then((snapshot) => {
      const article = snapshot.val();
      if (!article) {
        return res.render("error", {
          title: "找不到該文章",
        });
      }
      res.render("post", {
        title: "Express",
        categories,
        article,
        moment,
      });
    });
});

router.get("/dashboard/signup", function (req, res, next) {
  res.render("dashboard/signup", { title: "Express" });
});

module.exports = router;
