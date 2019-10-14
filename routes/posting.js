var express = require("express");
const { check, validationResult } = require('express-validator');
var router = express.Router();
/* GET posting page. */
router.get("/", function (req, res, next) {
    res.render("posting");
});

/* POST posting page. */
router.post("/", function (req, res, next) {
    console.log(req.body);
    res.redirect("/");
});

module.exports = router;