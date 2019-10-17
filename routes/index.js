const express = require("express");
const router = express.Router();

const { check, validationResult } = require('express-validator');

const database = require('../database.js');
const config = require('../config.json');

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", {
        title: "Széchenyi Diák Párt",
        page: "startpage"
    });
});

router.get("/rolunk", function (req, res, next) {
    res.render("index", {
        title: "Széchenyi Diák Párt",
        page: "aboutus"
    });
});

router.get("/szerv_felepites", function (req, res, next) {
    res.render("index", {
        title: "Széchenyi Diák Párt",
        page: "orgbuildup"
    });
});

router.get("/getlastpost", function (req, res, next) {
    var data = database.GetLastAvaiableId('posts');
    res.json({id: data - 1});
});

/* POST home page. */
router.post("/", function (req, res, next) {
    if(req.body.pwd) {
        if(req.body.pwd == config.pwd) {
            //console.log("req.body: ", req.body);
            res.redirect("/posting");
        } else {
            //console.log("Wrong pwd!");
            res.render("index", {
                title: "Széchenyi Diák Párt"
            });
        }
    }
});

router.post("/post", function (req, res, next) {
    //console.log(req.body);
    //console.log(req.get('content-type'));
    var data = database.GetDataFromTable('posts', req.body.id);
    //console.log(data);
    if(data) res.json(data);
    else res.json({id: -1});
});

module.exports = router;