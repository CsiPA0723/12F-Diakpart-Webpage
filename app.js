var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const Database = require('./database');

const config = require('./config.json');

var indexRouter = require('./routes/index');

var app = express();

// Preping databases
Database.Prepare("posts");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

if(config.mode == "dev") app.use(logger('dev'));
else app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

app.options("*", function(req,res,next){res.send(200);});

// error handler
app.use(function (err, req, res, next) {
    if(config.mode == "dev") {
            // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = err;
        // render the error page
        res.status(err.status || 500);
        res.render('error');
    } else {
        res.status(err.status || 500).send();
    }
});

module.exports = app;