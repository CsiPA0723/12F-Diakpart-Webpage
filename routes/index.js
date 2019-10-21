const express = require("express");
const router = express.Router();

var postIds = require('../database/ids.json');

const { check, validationResult } = require('express-validator');

const Functions = require('../funtions.js');

const database = require('../database.js');
const config = require('../config.json');

const youtubeRegExp = /(?:https?:\/\/)?(?:(?:(?:www\.?)?youtube\.com(?:\/(?:(?:watch\?.*?(v=[^&\s]+).*)|(?:v(\/.*))|(channel\/.+)|(?:user\/(.+))|(?:results\?(search_query=.+))))?)|(?:youtu\.be(\/.*)?))/g;

//const imgurRegExp = /(?:https?:\/\/)?(?:(?:(?:www\.?)?youtube\.com(?:\/(?:(?:watch\?.*?(v=[^&\s]+).*)|(?:v(\/.*))|(channel\/.+)|(?:user\/(.+))|(?:results\?(search_query=.+))))?)|(?:youtu\.be(\/.*)?))/g;

//const facebookRegExp = /(?:https?:\/\/)?(?:(?:(?:www\.?)?youtube\.com(?:\/(?:(?:watch\?.*?(v=[^&\s]+).*)|(?:v(\/.*))|(channel\/.+)|(?:user\/(.+))|(?:results\?(search_query=.+))))?)|(?:youtu\.be(\/.*)?))/g;

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", {
        title: "Széchenyi Diák Párt",
        page: "startpage"
    });
});

router.get("/szerv_felepites", function (req, res, next) {
    res.render("index", {
        title: "Széchenyi Diák Párt",
        page: "orgbuildup"
    });
});

router.get("/getpostids", function (req, res, next) {
    delete postIds;
    postIds = require('../database/ids.json');
    res.json({ ids: postIds });
});

router.post("/post", function (req, res, next) {
    console.log(req.body);
    console.log(req.get('content-type'));
    var data = database.GetDataFromTable('posts', req.body.id);
    console.log(data);
    if(data) res.json(data);
    else res.json({id: -1});
});

router.post("/posting", function (req, res, next) {
    console.log("/posting");
    if(req.body.pwd == config.pwd) {
        console.log("req.body: ", req.body);
        var post = database.GetPostTemplate();
        post.title = req.body.title;
        post.title_desc = req.body.title_desc;
        post.post_text = req.body.post_text;
        post.date = Functions.DateFormat(Date.now());
        console.log(post);
        console.log(postIds);
        database.SetDataForTable('posts', post);
        console.log(postIds);
        res.redirect("/");
    }
    else res.redirect("/");
});

router.post("/editing", function (req, res, next) {
    console.log("/editing");
    if(req.body.pwd == config.pwd) {
        console.log("req.body: ", req.body);
        var post = database.GetDataFromTable('posts', req.body.id);
        post.title = req.body.title;
        post.title_desc = req.body.title_desc;
        post.post_text = req.body.post_text;
        post.date = Functions.DateFormat(Date.now());
        console.log(post);
        console.log(postIds);
        database.SetDataForTable('posts', post);
        console.log(postIds);
        res.redirect("/");
    }
    else res.redirect("/");
});

router.post("/deleting", function (req, res, next) {
    console.log("/deleting");
    if(req.body.pwd == config.pwd) {
        console.log("req.body: ", req.body);
        console.log(postIds);
        database.DeleteDataFromTable('posts', req.body.id);
        console.log(postIds);
        res.redirect("/");
    }
    else res.redirect("/");
});

module.exports = router;