var express = require("express");
var router = express.Router();
/* GET login page. */
router.get("/", function (req, res, next) {
    res.render("posting", {
        title: "Széchenyi Diák Párt"
    });
});

module.exports = router;