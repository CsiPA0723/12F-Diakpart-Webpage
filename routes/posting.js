const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const Functions = require('../funtions.js');
const database = require('../database.js');

/* GET posting page. */
router.get("/", function (req, res, next) {
    res.render("posting");
});

/* POST posting page. */
router.post("/", function (req, res, next) {
    //console.log(req.body);
    var post = database.GetPostTemplate();
    post.title = req.body.title;
    post.title_desc = req.body.title_desc;
    post.post_text = req.body.post_text;
    post.embed_link = req.body.embed_link;
    post.date = Functions.DateFormat(Date.now());
    //console.log(post);
    database.SetDataForTable('posts', post);
    res.redirect("/");
});

module.exports = router;