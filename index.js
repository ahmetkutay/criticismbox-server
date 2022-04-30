const cookieParser = require('cookie-parser');
const express = require('express');
const httpErrors = require('http-errors');
const bodyparser = require("body-parser");
const session = require('cookie-session');

const indexRouter = require('./routes/index');
const setupPassport = require('./lib/passport');


module.exports = (config) => {
    const app = express();
    const passport = setupPassport(config);

    app.locals.databaseStatus = config.database.status;

    app.use(
        session({
            name: 'session',
            keys: [
                'a set',
                'of keys',
                'used',
                'to encrypt',
                'the session',
                'change in',
                'production',
            ],
            resave: false,
            saveUninitialized: true,
            sameSite: 'lax',
            maxAge: null,
        })
    );

    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(async (req, res, next) => {
        req.sessionOptions.maxAge =
            req.session.rememberme || req.sessionOptions.maxAge;
        res.locals.user = req.user;
        return next();
    });

    app.use(async (req, res, next) => {
        if (!req.session.messages) {
            req.session.messages = [];
        }
        res.locals.messages = req.session.messages;
        return next();
    });

    app.use('/', indexRouter({config}));

    app.use((req, res, next) => {
        next(httpErrors(404));
    });

    app.use((err, req, res) => {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        res.status(err.status || 500);
        res.render('error');
    });

    return app;
};