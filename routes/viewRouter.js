const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/add", (req, res) => {
  res.render("form");
});

router.get("/distance", (req, res) => {
  res.render("distance");
});

router.get("/list", (req, res) => {
  res.render("list");
});

router.get("/find", (req, res) => {
  res.render("find");
});

module.exports = router;
