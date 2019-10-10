const express = require("express");
const router = express.Router();

const { check, validationResult } = require('express-validator');

const config = require('../config.json');

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", {
        title: "Széchenyi Diák Párt"
    });
});

/* POST home page. */
router.post("/", function (req, res, next) {
    if(req.body.pwd == config.pwd) {
        console.log(req.body);
        res.redirect("/post");
    } else {
        console.log("Wrong pwd!");
        res.render("index", {
            title: "Széchenyi Diák Párt"
        });
    }
});

module.exports = router;